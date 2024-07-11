import "./styles/SellerScheduleSection.css";
import AskSellerBtn from "./AskSellerBtn";
import SellerSchedule from "./SellerSchedule";

const SellerScheduleSection = ({ seller }) => {
  return (
    <section className="seller-schedule-section">
      <h3>Schedule</h3>
      <SellerSchedule seller={seller} />
      <AskSellerBtn seller={seller} />
    </section>
  );
}

export default SellerScheduleSection;
