const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_MINUTES = 1000 * 60;
const MS_PER_SECONDS = 1000;

export default class DateActions {
  /**
   * adding zero placeholders to a date part (from 967 to 0967, if datePart === 967 && requiredStrLength === 4)
   * 
   * @param {number | string} datePart - date part (1990, for example).
   * @param {number} requiredStrLength - date part length to match with (for example, 4 while datePart length is 3).
   * @return {string} - datePart with possibly additional zero placeholders
   */
  static getDatePartWithPossibleZeros(datePart, requiredStrLength) {
    let result = datePart;

    const lengthsDifference = requiredStrLength - String(datePart).length
    if (lengthsDifference > 0) {
      const additionalZeros = "0".repeat(lengthsDifference);
      result = additionalZeros + result;
    }

    return result;
  }

  /**
   * get difference of two dates in days
   * 
   * @param {Date} a - first date
   * @param {Date} b - second date
   * @return {number} - number of day(s) if everything is ok
   */
  static getDateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / MS_PER_DAY);
  }

  /**
   * get difference of two dates in ms
   * 
   * @param {Date} a - first date
   * @param {Date} b - second date
   * @return {number} - number of ms if everything is ok
   */
  static getDateDiffInMs(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds(), b.getMilliseconds());
  
    return utc2 - utc1;
  }

  /**
   * human-readable time object 
   * @typedef {Object} HumanReadableTime
   * @property {number} days
   * @property {number} hours
   * @property {number} minutes
   * @property {number} seconds
   * @property {number} ms
   */
  /**
   * transform ms to human-readable time
   * 
   * @param {number} ms
   * @return {HumanReadableTime} 
   */
  static msToDaysHoursMinutesSecondsAndMs(ms) {
    const days = Math.floor(ms / MS_PER_DAY);
    const hours = Math.floor(ms / MS_PER_HOUR % 24);
    const minutes = Math.floor(ms / MS_PER_MINUTES % 60);
    const seconds = Math.floor(ms / MS_PER_SECONDS % 60);
    const remainingMs = Math.floor(ms / MS_PER_SECONDS % 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      ms: remainingMs,
    };
  }
};