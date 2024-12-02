import moment from "moment";

function getDateStr(date, format = "MMM Do YYYY") {
  let dateStr = moment(date).format(format);
  return dateStr;
}

export default getDateStr;