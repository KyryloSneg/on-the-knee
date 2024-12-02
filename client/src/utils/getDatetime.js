import DateActions from "./DateActions";

// we can extend this function to support different datetimes in the future
export default function getDatetime(date) {
  const year = DateActions.getDatePartWithPossibleZeros(date.getFullYear(), 4);
  const month = DateActions.getDatePartWithPossibleZeros(date.getMonth() + 1, 2);
  const monthDay = DateActions.getDatePartWithPossibleZeros(date.getDate(), 2);

  // YYYY-MM-DD
  const datetime = `${year}-${month}-${monthDay}`;
  return datetime
}