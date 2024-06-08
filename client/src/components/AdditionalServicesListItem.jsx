import "./styles/AdditionalServicesListItem.css";
import { useState } from 'react';
import dropdownArrowIcon from "../assets/expand_more.svg";
import AdditionalServicesExpandedList from './AdditionalServicesExpandedList';
import _ from "lodash";

const AdditionalServicesListItem = ({ additionalService, id, selectedItems, setSelectedItems }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  // finding device-combinations of device in "additional-service" field
  const additionalServiceOptions = additionalService["additional-service"].device["device-combinations"];
  const addServiceImageSrc = additionalServiceOptions[0].images[0].src;

  let checkboxDivClass = "checkbox-div";
  if (isChecked) {
    checkboxDivClass += " checked";
  }

  function onCheckboxClick() {
    const nextStatesValue = !isChecked;

    let nextSelectedItems;
    if (nextStatesValue) {
      const firstOption = additionalServiceOptions[0];
      nextSelectedItems = [
        ...selectedItems,
        {
          id: 0,
          parentId: id,
          price: firstOption.price
        }
      ];
    } else {
      nextSelectedItems = selectedItems.filter(item => item.parentId !== id);
    }

    setSelectedItems(nextSelectedItems);
    setIsChecked(nextStatesValue);

    if (isExpanded !== nextStatesValue) setIsExpanded(true);
  }

  function onArrowClick() {
    setIsExpanded(!isExpanded);
  }

  const spanId = `additional-services-list-item-span-${additionalService.id}-${_.uniqueId()}`;
  return (
    <div className="additional-services-list-item">
      <div>
        <button
          aria-checked={isChecked}
          role="checkbox"
          onClick={onCheckboxClick}
          className="additional-services-checkbox-btn"
        >
          <div>
            <div className={checkboxDivClass} />
            <img 
              src={addServiceImageSrc} 
              alt=""
              className="additional-service-image"
              draggable="false" 
            />
          </div>
          <span className="hidden-overflow-name" id={spanId}>
            {additionalService.name}
          </span>
        </button>
        <button className="additional-services-item-arrow" onClick={onArrowClick}>
          <img
            src={dropdownArrowIcon}
            alt={isExpanded ? "Collapse" : "Expand"}
            className={isExpanded ? "rotated" : ""}
            draggable="false"
          />
        </button>
      </div>
      {isExpanded &&
        <AdditionalServicesExpandedList
          names={additionalService["additional-service"].names}
          deviceId={additionalService["additional-service"].device.id}
          additionalServiceOptions={additionalServiceOptions}
          labelledBy={spanId}
          parentId={id}
          setParentIsChecked={setIsChecked}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      }
    </div>
  );
}

export default AdditionalServicesListItem;
