import { forwardRef, useContext } from "react";
import { Context } from "../Context";
import CategoryFilter from "./CategoryFilter";
import "./styles/CategoryFilterList.css";
import { observer } from "mobx-react-lite";
import { onKeyDown } from "../utils/dropdownOptionsControl";

const CategoryFilterList = observer(forwardRef(({ filter, optionRefs, filterCategoryBlockId, className }, ref) => {
  const { deviceStore } =  useContext(Context);

  return (
    <ul className={className} ref={ref} data-testid={`CategoryFilterList: ${filterCategoryBlockId}`}>
      {deviceStore.filters[filter].map(value => {
        let active;
        const id = deviceStore.filters[filter].indexOf(value);

        if (deviceStore.usedFilters[filter]) {
          active = deviceStore.usedFilters[filter].includes(value);
        }

        return (
          <li key={`${filter}: ${value}`}>
            <CategoryFilter
              filter={filter}
              value={value}
              active={active}
              onKeyDown={e => onKeyDown(e, id, deviceStore.filters[filter], optionRefs)}
              ref={ref => {
                if (optionRefs.current.length === deviceStore.filters[filter].length) return;
                optionRefs.current.push(ref)
              }}
              testId={`${filter}: ${value}`}
            />
          </li>
        );
      })}
    </ul>
  );
}));

export default CategoryFilterList;
