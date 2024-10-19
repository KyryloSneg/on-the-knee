export default class DateActions {
    /**
     * adding zero placeholders to a date part (from 967 to 0967, if datePart === 967 && requiredStrLength === 4)
     * @param {number | string} datePart - date part (1990, for example).
     * @param {number} requiredStrLength - date part length to match with (for example, 4 while datePart length is 3).
     */
  static getDatePartWithPossibleZeros(datePart, requiredStrLength) {
    let result = datePart;

    const lengthsDifference = requiredStrLength - datePart.toString().length
    if (lengthsDifference > 0) {
      const additionalZeros = "0".repeat(lengthsDifference);
      result = additionalZeros + result;
    }

    return result;
  }
};