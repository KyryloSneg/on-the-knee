import "./styles/AdditionalServicesList.css";
import AdditionalServicesListItem from "./AdditionalServicesListItem";

const AdditionalServicesList = ({ additionalServices, selectedItems, setSelectedItems, isReadOnly }) => {
  return (
    <ul className="additional-services-list">
      {additionalServices.map((service, index) => 
        <li key={service.id}>
          <AdditionalServicesListItem 
            additionalService={service}
            id={index}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            isReadOnly={isReadOnly}
          />
        </li>
      )}
    </ul>
  );
}

export default AdditionalServicesList;
