import getDateStr from "utils/getDateStr";
import getDatetime from "utils/getDatetime";

const TimeRange = ({ createdAtDate, expiresAtDate, startWithCapitalLetter = true, ...props }) => {
  const createdAtStr = getDateStr(createdAtDate, "MMM Do");
  const createdAtDatetime = getDatetime(createdAtDate);

  const expiresAtStr = getDateStr(expiresAtDate, "MMM Do YYYY");
  const expiresAtDatetime = getDatetime(expiresAtDate);

  return (
    <p {...props}>
      {startWithCapitalLetter ? "From" : "from"} 
      <time dateTime={createdAtDatetime}>
        <strong> {createdAtStr} </strong>
      </time> 
      to 
      <time dateTime={expiresAtDatetime}>
        <strong> {expiresAtStr}</strong>
      </time>
    </p>
  );
}

export default TimeRange;
