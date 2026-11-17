/**
 * Google Analytics 4 configuration.
 *
 * Replace the placeholder below with your GA4 Measurement ID
 * (Google Analytics → Admin → Data streams → your web stream).
 *
 * While the placeholder is present the site runs in "local mode": every
 * component still records its events in memory, the analytics section shows
 * them live, but nothing is sent to Google.
 */
export const analyticsConfig = {
  measurementId: 'G-XXXXXXXXXX',
  debug: false,
} as const;

export function isMeasurementIdConfigured(measurementId: string): boolean {
  return /^G-[A-Z0-9]{4,}$/i.test(measurementId) && !measurementId.toUpperCase().includes('XXXX');
}
