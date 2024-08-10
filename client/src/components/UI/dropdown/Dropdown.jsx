import "./Dropdown.css";
import { forwardRef, useEffect, useState } from "react";
import DropdownBtn from "./DropdownBtn";
import DropdownOptions from "./DropdownOptions";
import URLActions from "../../../utils/URLActions";
import { v4 } from "uuid";
import useInitialDropdownValue from "../../../hooks/useInitialDropdownValue";

// options item sample:
// {
//   id: index,
//   title: object.fullName,
//   value: object
// }

// if we provided propsSelectedId it will be always used instead of default selectedId
// thus we have to use our own setter fn (onSelectCb(index) or smth like this)
const Dropdown = forwardRef((
  { variant = "default-select", options, propsSelectedId = null, paramKey = null, placeHolder, onSelectCb = null, ...props },
  ref
) => {
  const [value, setValue] = useState(variant === "sorting-filter" ? options[0]?.title : placeHolder);
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(propsSelectedId || 0);
  
  const selectedIdToUse = propsSelectedId >= 0 ? propsSelectedId : selectedId;
  const dropdownOptionsId = `dropdown-options-${paramKey || v4()}`;

  const paramValue = URLActions.getParamValue(paramKey);
  useInitialDropdownValue(variant, paramKey, paramValue, options, setValue, setSelectedId, onSelectCb);

  useEffect(() => {
    // we can change propsSelectedId outside the dropdown component, so handle value changing here
    setValue(options[selectedIdToUse]?.title || value);
    // eslint-disable-next-line
  }, [selectedIdToUse]);

  function onClick(e) {
    e.stopPropagation();
    setVisible(!visible);
  }

  return (
    <div className="dropdown">
      <DropdownBtn
        variant={variant}
        value={value}
        onClick={onClick}
        visible={visible}
        dropdownOptionsId={dropdownOptionsId}
        ref={ref}
        {...props}
      />
      {visible && (
        <DropdownOptions
          options={options}
          visible={visible}
          hide={() => setVisible(false)}
          setValue={setValue}
          selectedId={selectedIdToUse}
          setSelectedId={setSelectedId}
          paramKey={paramKey}
          dropdownOptionsId={dropdownOptionsId}
          variant={variant}
          onSelectCb={onSelectCb}
        />
      )
      }
    </div>
  );
});

export default Dropdown;
