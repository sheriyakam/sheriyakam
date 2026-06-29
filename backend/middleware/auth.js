/**
 * auth.js
 * Express middleware to verify Supabase JWT Access Token.
 * Attaches the verified user metadata to req.user on success.
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client for token verification
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Middleware to protect private routes using Supabase JWT
 */
const requireAuth = async (req, res, next) => {
    // 1. Check configuration
    if (!supabase) {
        console.warn('[Security/Auth] Supabase is not configured on the backend. Bypassing auth check (Development mode only).');
        req.user = { id: 'dev_user_bypass', email: 'dev@example.com', role: 'user' };
        return next();
    }

    try {
        // 2. Extract Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: Missing or malformed Authorization header' });
        }

        const token = authHeader.split(' ')[1];

        // 3. Verify user with Supabase Auth using the access token (JWT)
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error('[Security/Auth] Supabase token verification failed:', error?.message || 'Invalid User');
            return res.status(401).json({ error: 'Unauthorized: Invalid access token' });
        }

        // 4. Attach verified user profile metadata to request object
        req.user = {
            id: user.id,
            email: user.email,
            role: user.user_metadata?.role || 'user',
            name: user.user_metadata?.name || '',
            mobile: user.user_metadata?.mobile || ''
        };

        next();

    } catch (err) {
        console.error('[Security/Auth] Auth middleware exception:', err.message);
        return res.status(500).json({ error: 'Internal server error during authentication' });
    }
};

module.exports = { requireAuth };
