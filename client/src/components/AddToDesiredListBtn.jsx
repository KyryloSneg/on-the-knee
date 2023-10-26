import { useContext } from "react";
import desiredListIcon from "../assets/favorite.svg";
import "./styles/AddToDesiredListBtn.css";
import { Context } from "../Context";

const AddToDesiredListBtn = ({ deviceId }) => {
  const { app, deviceStore } = useContext(Context);

  function onClick() {
    // TODO: add to desired list
  }
  
  // using this to not add redundant empty refs 
  const firstAddToListRef = deviceId === deviceStore.devices[0].id ? {ref: app.deviceSectionRef} : {};
  return (
    <button className="add-to-desired-list" onClick={onClick} {...firstAddToListRef}>
      <img src={desiredListIcon} alt="Add to desired list" draggable="false" />
    </button>
  );
}

export default AddToDesiredListBtn;
