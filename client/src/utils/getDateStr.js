import moment from "moment";

// some formats might not work i think ("MMM Do" and "MMM Do YYYY" work well)
function getDateStr(date, format = "MMM Do YYYY", isDayMonthYear = true) {
  function getFormattedDateString(date) {
    function switchDayAndMonth(dateStr) {
      const day = dateStr.slice(0, 2);
      const month = dateStr.slice(3, 5);
      const year = dateStr.slice(6, 10);
  
      const result = `${month}.${day}.${year}`
      return result;
    }
  
    const localeDateString = date.toLocaleDateString();
    const formattedDateString = switchDayAndMonth(localeDateString);
  
    return formattedDateString;
  }
  
  // if we used as format smth like "hh:mm A"
  // we mustn't use getFormattedDateString fn
  let dateStr;
  if (isDayMonthYear) {
    // d.toLocaleDateString() + moment.js
    dateStr = moment(new Date(getFormattedDateString(date))).format(format);;
  } else {
    dateStr = moment(date).format(format);
  }

  return dateStr;
}

export default getDateStr;