import "./styles/SellerScheduleSection.css";
import AskSellerBtn from "./AskSellerBtn";
import SellerSchedule from "./SellerSchedule";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "Context";

const SellerScheduleSection = observer(({ seller }) => {
  const { user } = useContext(Context);
  const [isToShowSellerAskQuestion, setIsToShowSellerAskQuestion] = useState(false);

  const isUserASellerOrManager = user.user?.roles?.includes("SELLER") || user.user?.roles?.includes("SELLER-MANAGER");

  useEffect(() => {
    if (!isUserASellerOrManager) setIsToShowSellerAskQuestion(false);
  }, [isUserASellerOrManager]);

  return (
    <aside className="seller-schedule-section">
      <h3>Schedule</h3>
      <SellerSchedule seller={seller} />
      {isToShowSellerAskQuestion && (
        <p className="seller-cant-ask-question-error-msg">
          A seller or a seller manager can't ask any seller
        </p>
      )}
      <AskSellerBtn
        seller={seller}
        isUserASellerOrManager={isUserASellerOrManager}
        setIsToShowSellerAskQuestion={setIsToShowSellerAskQuestion}
      />
    </aside>
  );
});

export default SellerScheduleSection;
