/**
 * Certificate text and participant formatting utilities.
 */

/**
 * Format participant name for certificates:
 * - If a participant has more than three name components (words separated by whitespace),
 *   include only the first three components.
 * - For example: "Arun Kumar Rajesh Christopher" -> "Arun Kumar Rajesh"
 * - Maintains original spelling and capitalization without altering original participant records.
 */
export function formatCertificateName(name: string | null | undefined): string {
  if (!name) return "";
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length > 3) {
    return parts.slice(0, 3).join(" ");
  }
  return parts.join(" ");
}

export const DEFAULT_CERTIFICATE_TEMPLATE = "/templates/default-certificate.png";

export const DEFAULT_CERTIFICATE_WORDING = 
  "This certificate is awarded to the above-mentioned participant for their participation in **{eventName}**, held on **{eventDate}**.";

/**
 * Formats the official certificate text with dynamic event name and event date in markdown bold (**...**).
 */
export function buildCertificateWording(
  eventName?: string | null,
  eventDate?: string | null,
  templateString: string = DEFAULT_CERTIFICATE_WORDING
): string {
  const cleanName = eventName && eventName.trim() ? eventName.trim() : "[EVENT NAME]";
  const cleanDate = eventDate && eventDate.trim() ? eventDate.trim() : "[EVENT DATE]";

  return templateString
    .replace(/\{eventName\}|\[EVENT NAME\]/g, cleanName)
    .replace(/\{eventDate\}|\[EVENT DATE\]/g, cleanDate);
}
