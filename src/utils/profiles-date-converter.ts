/**
 * Parse a custom date format string into a Date object.
 * @param dateString A string representing the date in the format '/Date(timestamp)/'
 * @returns A Date object parsed from the input string
 * @throws If the input string is not in the expected format or the timestamp is invalid
 */
export function parseCustomDate(dateString: string): Date {
  const match = /\/Date\((-?\d+)\)\//.exec(dateString);
  if (!match || match.length < 2) {
    throw new Error('Invalid date format. Use a valid date string');
  }
  const timestamp = parseInt(match[1]);
  if (isNaN(timestamp)) {
    throw new Error('Invalid timestamp. Cannot parse date');
  }
  return new Date(timestamp);
}

/**
 * Convert a custom date format string into ISO 8601 format.
 * @param dateString A string representing the date in the format '/Date(timestamp)/'
 * @returns A string representing the date in ISO 8601 format
 * @throws If the input string is not in the expected format or the timestamp is invalid
 */
export function convertCustomDateToISO(dateString: string): string {
  const date = parseCustomDate(dateString);
  return date.toISOString();
}

/**
 * Validate and convert a custom date format string into ISO 8601 format.
 * @param dateString A string representing the date in the format '/Date(timestamp)/'
 * @returns A string representing the date in ISO 8601 format
 * @throws If the input string is not in the expected format or the timestamp is invalid
 */
export async function validateAndConvertDate(
  dateString: string,
): Promise<string> {
  return convertCustomDateToISO(dateString);
}
