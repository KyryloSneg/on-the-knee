import "./styles/SellerSchedule.css";

const SellerSchedule = ({ seller }) => {
  return (
    <dl className="seller-schedule">
      <div>
        <dt>Mon-Fri</dt>
        <dd>11 AM - 8 PM</dd>
      </div>
      <div>
        <dt>Sat-Sun</dt>
        <dd>1 PM - 7 PM</dd>
      </div>
      Seller schedule
    </dl>
  );
}

export default SellerSchedule;
