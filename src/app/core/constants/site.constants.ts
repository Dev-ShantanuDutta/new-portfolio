/**
 * Canonical production origin, used to build absolute URLs for Open Graph,
 * JSON-LD, and the generated sitemap. Update once a domain is live.
 */
export const SITE_URL = '[YOUR: production domain, e.g. https://shantanudutta.dev]';

/**
 * Open Graph/Twitter Card preview image, shared by every route until a real
 * one exists. Replace with a real designed image (ideally 1200x630) once
 * available.
 */
export const SITE_OG_IMAGE = '[YOUR: path to a social preview image, e.g. /og-image.png]';

/**
 * EmailJS account the contact form sends through. The public key is meant to
 * ship to the browser; the template uses from_name, from_email, subject,
 * message and to_email.
 */
export const EMAILJS_CONFIG = {
  serviceId: 'service_sw37ss6',
  templateId: 'template_noo0ps6',
  publicKey: 'FgGUVwu7gXmpn4K74',
} as const;
