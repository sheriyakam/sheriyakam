/**
 * Job Photo Storage Service
 * Handles uploading and retrieving before/after repair photos tied to booking IDs.
 */

import { supabase, isSupabaseConfigured } from '../config/supabaseConfig';
import { getBookings, bookingEvents } from '../constants/bookingStore';

export const StorageService = {
    /**
     * Attach a before or after repair photo to a booking
     */
    async uploadJobPhoto(bookingId, photoUri, type = 'before') {
        try {
            // If Supabase Storage is configured
            if (isSupabaseConfigured) {
                const fileName = `jobs/${bookingId}_${type}_${Date.now()}.jpg`;
                const { data, error } = await supabase.storage
                    .from('job-photos')
                    .upload(fileName, photoUri, { contentType: 'image/jpeg', upsert: true });

                if (error) {
                    console.warn('[Storage] Supabase upload failed, using local URI:', error);
                } else if (data) {
                    const { data: publicData } = supabase.storage.from('job-photos').getPublicUrl(fileName);
                    this._attachPhotoToLocalBooking(bookingId, publicData.publicUrl, type);
                    return { success: true, url: publicData.publicUrl };
                }
            }

            // Fallback: Attach URI directly to local store
            this._attachPhotoToLocalBooking(bookingId, photoUri, type);
            return { success: true, url: photoUri };
        } catch (err) {
            console.error('[Storage] Error in uploadJobPhoto:', err);
            return { success: false, error: err.message };
        }
    },

    _attachPhotoToLocalBooking(bookingId, url, type) {
        const bookings = getBookings();
        const b = bookings.find(item => item.id === bookingId);
        if (b) {
            if (type === 'before') {
                b.beforePhotoUrl = url;
            } else {
                b.afterPhotoUrl = url;
            }
            bookingEvents.emit('change');
        }
    }
};
