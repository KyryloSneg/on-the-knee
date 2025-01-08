import "./styles/AdditionalServicesExpandedList.css";
import AdditionalServicesExpandedListItem from "./AdditionalServicesExpandedListItem";
import { DEVICE_ROUTE } from "../utils/consts";
import _ from "lodash";
import { useRef } from "react";

const AdditionalServicesExpandedList = ({
  names, deviceId, additionalServiceOptions,
  labelledBy, parentId,
  selectedItems, setSelectedItems, isReadOnly
}) => {
  const optionRefs = useRef([]);

  return (
    <div
      className="additional-services-expanded-list"
      role="radiogroup"
      aria-labelledby={labelledBy}
    >
      {additionalServiceOptions.map((option, index) => {
        const name = names[index];
        const selectedItem = selectedItems.find(item => item.parentId === parentId);

        let selectedId = null;
        if (selectedItem) {
          additionalServiceOptions.find((item, index) => {
            selectedId = index;
            return selectedItem.id === index;
          });
        }

        const deviceRouteCombo = option.combinationString
          ? option.combinationString
          : "default";
        const to = DEVICE_ROUTE + `${deviceId}--${deviceRouteCombo}`;

        function checkItem(optionItem, optionIndex) {
          if (isReadOnly) return;
          const selectedItemsCopy = _.cloneDeep(selectedItems);

          let selectedItemIndex;
          let selectedItemWithSameParent = selectedItemsCopy.find((item, index) => {
            selectedItemIndex = index;
            return item.parentId === parentId;
          });

          if (selectedItemWithSameParent) {
            if (selectedItemWithSameParent.id === optionIndex) return;
            // REPLACING existing selected item with new one
            selectedItemsCopy[selectedItemIndex] = {
              id: optionIndex,
              parentId: parentId,
              price: optionItem.price
            };

            setSelectedItems(selectedItemsCopy);
          } else {
            // PUSHING new selected item
            const nextSelectedItems = [
              ...selectedItemsCopy,
              {
                id: optionIndex,
                parentId: parentId,
                price: optionItem.price
              }
            ];

            setSelectedItems(nextSelectedItems);
          }
        }

        function onCheck() {
          if (isReadOnly) return;
          checkItem(option, index);
        }

        function checkNext() {
          if (isReadOnly) return;
          if (additionalServiceOptions.length === 1) return;

          let id;
          if (index === additionalServiceOptions.length - 1) {
            id = 0;
            checkItem(additionalServiceOptions[id], id);
          } else {
            id = index + 1;
            checkItem(additionalServiceOptions[id], id);
          }

          optionRefs.current[id].focus();
        }

        function checkPrev() {
          if (isReadOnly) return;
          if (additionalServiceOptions.length === 1) return;

          let id;
          if (index === 0) {
            id = additionalServiceOptions.length - 1;
            checkItem(additionalServiceOptions[id], id);
          } else {
            id = index - 1;
            checkItem(additionalServiceOptions[id], id);
          }

          optionRefs.current[id].focus();
        }

        return (
          <AdditionalServicesExpandedListItem
            key={option.id}
            additionalServiceOption={option}
            isChecked={selectedId === index}
            onCheck={onCheck}
            checkNext={checkNext}
            checkPrev={checkPrev}
            name={name}
            ref={ref => {
              if (optionRefs.current.length === additionalServiceOptions.length) return;
              optionRefs.current.push(ref)
            }}
            to={to}
            isReadOnly={isReadOnly}
          />
        );
      })}
    </div>
  );
}

export default AdditionalServicesExpandedList;
