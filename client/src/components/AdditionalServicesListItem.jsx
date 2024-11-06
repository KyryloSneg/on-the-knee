import "./styles/AdditionalServicesListItem.css";
import { useEffect, useState } from 'react';
import dropdownArrowIcon from "../assets/expand_more.svg";
import AdditionalServicesExpandedList from './AdditionalServicesExpandedList';
import _ from "lodash";

const AdditionalServicesListItem = ({ additionalService, id, selectedItems, setSelectedItems, isReadOnly }) => {
  const isChecked = !!selectedItems?.find(item => item.parentId === id);
  const [isExpanded, setIsExpanded] = useState(isChecked);
  // finding device-combinations of device in "additional-service" field
  const additionalServiceOptions = additionalService["additional-service"].device["device-combinations"];
  const addServiceImageSrc = additionalServiceOptions[0].images[0].src;

  useEffect(() => {
    setIsExpanded(isChecked);
  }, [isChecked]);

  let checkboxDivClass = "checkbox-div";
  if (isChecked) {
    checkboxDivClass += " checked";
  }

  function onCheckboxClick() {
    const nextStatesValue = !isChecked;
    if (isExpanded !== !isChecked) setIsExpanded(true);
    
    if (isReadOnly) return;

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
  }

  function onArrowClick() {
    setIsExpanded(!isExpanded);
  }

  const spanId = `additional-services-list-item-span-${additionalService.id}-${_.uniqueId()}`;
  return (
    <div className="additional-services-list-item">
      <div>
        <button
          type="button"
          aria-checked={isChecked}
          role="checkbox"
          onClick={onCheckboxClick}
          className="additional-services-checkbox-btn"
          disabled={isReadOnly}
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
        <button type="button" className="additional-services-item-arrow" onClick={onArrowClick}>
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
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          isReadOnly={isReadOnly}
        />
      }
    </div>
  );
}

export default AdditionalServicesListItem;
