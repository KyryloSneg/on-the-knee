import "./styles/RemainSellerDevFeedbackDevList.css";
import { useContext } from 'react';
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import RemainSellerDevFeedbackDevListItem from "./RemainSellerDevFeedbackDevListItem";

const RemainSellerDevFeedbackDevList = observer(() => {
  const { app } = useContext(Context);

  return (
    <ul className="remain-seller-dev-feedback-dev-list">
      {app.remainSellerDeviceFeedbackDevCombos?.map(combo => 
        <li key={combo.id}>
          <RemainSellerDevFeedbackDevListItem combination={combo} />
        </li>
      )}
    </ul>
  );
});

export default RemainSellerDevFeedbackDevList;
