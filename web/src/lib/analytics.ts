export type AnalyticsEvent = 
  | 'service_view'
  | 'service_selected'
  | 'view_service_details'
  | 'location_checked'
  | 'location_available'
  | 'location_unavailable'
  | 'open_booking_flow'
  | 'booking_started'
  | 'otp_requested'
  | 'otp_verified'
  | 'booking_confirmed'
  | 'booking_completed'
  | 'booking_failed';

export function trackEvent(eventName: AnalyticsEvent, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  // Log in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics] ${eventName}`, properties || {});
  }

  // Plausible / Google Analytics / Mixpanel hook if configured
  try {
    if ((window as any).plausible) {
      (window as any).plausible(eventName, { props: properties });
    }
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
  } catch (e) {
    // Non-blocking
  }
}
