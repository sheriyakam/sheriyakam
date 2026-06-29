/**
 * auth.js
 * Auth routes for syncing Supabase Auth events to MongoDB.
 * Replaces the custom credentials logins with managed webhooks.
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');

const { requireAuth } = require('../middleware/auth');
const { createClient } = require('@supabase/supabase-js');

// Verification secret to secure webhook requests
const SUPABASE_WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

// Admin client to perform user deletions in Supabase Auth
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = (supabaseUrl && supabaseAdminKey)
    ? createClient(supabaseUrl, supabaseAdminKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      })
    : null;

/**
 * WEBHOOK ROUTE
 * Listens to row changes (INSERT/DELETE) in Supabase Auth table auth.users
 */
router.post('/webhook', async (req, res) => {
    try {
        // Secure verification checks
        if (SUPABASE_WEBHOOK_SECRET) {
            const signature = req.headers['x-supabase-webhook-secret'];
            if (signature !== SUPABASE_WEBHOOK_SECRET) {
                console.warn('[Security Warning] Blocked unauthorized webhook request.');
                return res.status(401).json({ error: 'Unauthorized: Invalid webhook secret' });
            }
        }

        const { type, record, old_record } = req.body;
        console.log(`[Supabase Webhook] Received database auth event: ${type}`);

        if (type === 'INSERT') {
            const { id, email, raw_user_meta_data } = record;

            // Prevent duplicate entries
            const existing = await User.findOne({ userId: id });
            if (existing) {
                return res.status(200).json({ status: 'ignored', message: 'User already exists in MongoDB' });
            }

            const newUser = new User({
                userId: id,
                name: raw_user_meta_data?.name || email.split('@')[0],
                email: email,
                mobile: raw_user_meta_data?.mobile || '',
                role: raw_user_meta_data?.role || 'user'
            });

            await newUser.save();
            console.log(`[Supabase Webhook] Successfully synced user registration: ${email}`);
            return res.status(201).json({ status: 'created', user: newUser });
        }

        if (type === 'DELETE') {
            const { id } = old_record || record || {};
            if (!id) {
                return res.status(400).json({ error: 'Bad Request: Missing ID on DELETE event' });
            }

            const result = await User.deleteOne({ userId: id });
            console.log(`[Supabase Webhook] Synced user deletion. MongoDB ID: ${id}, Deleted Count: ${result.deletedCount}`);
            return res.status(200).json({ status: 'deleted', deletedCount: result.deletedCount });
        }

        return res.status(200).json({ status: 'ignored', message: `Unhandled event type: ${type}` });

    } catch (error) {
        console.error('[Supabase Webhook Error] Webhook catch block:', error.message);
        return res.status(500).json({ error: 'Internal server error processing webhook' });
    }
});

/**
 * DELETE USER ACCOUNT
 * Validates request with requireAuth middleware, purges MongoDB profile, and deletes the Supabase Auth profile.
 */
router.delete('/delete-account', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`[Delete Account] Requested account deletion for user ID: ${userId}`);

        // 1. Purge user record from local MongoDB metadata database
        const mongoResult = await User.deleteOne({ userId: userId });
        console.log(`[Delete Account] Purged user from MongoDB. Deleted count: ${mongoResult.deletedCount}`);

        // 2. Terminate session and profile inside Supabase Auth
        if (supabaseAdmin) {
            const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
            if (error) {
                console.error('[Delete Account] Supabase Auth deletion error:', error.message);
                return res.status(500).json({ error: 'Failed to purge authentication profile.' });
            }
            console.log('[Delete Account] Successfully deleted user from Supabase Auth.');
        } else {
            console.warn('[Delete Account] Supabase Admin client not configured. Bypassing Auth deletion.');
        }

        return res.status(200).json({ success: true, message: 'Account deleted successfully' });

    } catch (error) {
        console.error('[Delete Account Error] Catch block:', error.message);
        return res.status(500).json({ error: 'Internal server error processing deletion' });
    }
});

module.exports = router;
