import moment from "moment";

// some formats might not work i think ("MMM Do" and "MMM Do YYYY" work well)
function getDateStr(date, format = "MMM Do YYYY") {
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
  
  // d.toLocaleDateString() + moment.js
  const dateStr = moment(new Date(getFormattedDateString(date))).format(format);
  return dateStr;
}

export default getDateStr;