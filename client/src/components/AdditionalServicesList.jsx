import "./styles/AdditionalServicesList.css";
import AdditionalServicesListItem from "./AdditionalServicesListItem";

const AdditionalServicesList = ({ additionalServices, selectedItems, setSelectedItems }) => {
  return (
    <ul className="additional-services-list">
      {additionalServices.map((service, index) => 
        <li key={service.id}>
          <AdditionalServicesListItem 
            additionalService={service}
            id={index}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </li>
      )}
    </ul>
  );
}

export default AdditionalServicesList;
