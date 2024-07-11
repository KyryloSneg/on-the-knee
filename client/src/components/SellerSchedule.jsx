import "./styles/SellerSchedule.css";

const SellerSchedule = ({ seller }) => {
  return (
    <dl className="seller-schedule">
      {Object.entries(seller.schedule).map(([key, value]) => {
        const startTime = new Date(value.start).toLocaleTimeString([], { hour: "2-digit", minute:"2-digit" });
        const endTime = new Date(value.end).toLocaleTimeString([], { hour: "2-digit", minute:"2-digit" });

        return (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{startTime} - {endTime}</dd>
          </div>
        );
      })}
    </dl>
  );
}

export default SellerSchedule;
