// getting only short variations of week days
export default function getWeekDay(date) {
  const weekDayNumber = date?.getDay();

  let weekDay;
  switch (weekDayNumber) {
    case 0:
      weekDay = "Sun";
      break;
    case 1:
      weekDay = "Mon";
      break;
    case 2:
      weekDay = "Tue";
      break;
    case 3:
      weekDay = "Wed";
      break;
    case 4:
      weekDay = "Thu";
      break;
    case 5:
      weekDay = "Fri";
      break;
    case 6:
      weekDay = "Sat";
      break;
    default:
      weekDay = "";
      break;
  }

  return weekDay;
}