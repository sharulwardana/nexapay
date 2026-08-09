/**
 * Strip HTML tags and dangerous patterns from user input.
 * Prevents stored XSS when values are rendered in dashboards or emails.
 */
export function sanitizeInput(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}
