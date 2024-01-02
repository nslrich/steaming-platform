/**
 * Function to convert a decimal seconds into a readable minutes:seconds with zero padding
 * @param {Number} decimalSeconds Seconds in decial form
 * @returns String value of Minutes:Seconds
 */
export function secondsToMinutes (decimalSeconds) {

  // Convert seconds to minutes
  const decimalMinutes = decimalSeconds / 60;

  // Get the base minutes
  const minutes = Math.floor(decimalMinutes);

  // Get the leftover seconds
  const decimal = decimalMinutes - minutes;

  // Convert from decial to 0-60
  const seconds = decimal * 60;

  // Check to see if minutes is greater that 60
  const hours = minutes >= 60 ? Math.floor(minutes / 60) : 0;

  // Setup return string
  var readable = '';
  var minutesAfterHours = minutes;

  // If longer than an hour add the hour part
  if (hours != 0) {
    readable = readable + hours < 10 ? "0" + hours + ":" : hours + ":";
    minutesAfterHours = Math.floor(minutes - (hours * 60));
  }

  // Setup normal minutes:seconds
  readable = readable + `${minutesAfterHours < 10 ? "0" + minutesAfterHours : minutesAfterHours}:${Math.floor(seconds) < 10 ? "0" + Math.floor(seconds) : Math.floor(seconds)}`;
  return readable;
}