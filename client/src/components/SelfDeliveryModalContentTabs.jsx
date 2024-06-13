import "./styles/SelfDeliveryModalContentTabs.css";

const SelfDeliveryModalContentTabs = ({ selectedTab, setSelectedTab }) => {
  return (
    <ul className="self-delivery-modal-content-tabs">
      <li>
        <button
          onClick={() => setSelectedTab("pointsList")}
          className={selectedTab === "pointsList" ? "selected" : ""}
        >
          As a list
        </button>
      </li>
      <li>
        <button
          onClick={() => setSelectedTab("map")}
          className={selectedTab === "map" ? "selected" : ""}
        >
          On map
        </button>
      </li>
    </ul>
  );
}

export default SelfDeliveryModalContentTabs;
