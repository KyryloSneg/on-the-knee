import { forwardRef, useState } from "react";
import DropdownBtn from "./DropdownBtn";
import "./Dropdown.css";
import DropdownOptions from "./DropdownOptions";
import URLActions from "../../../utils/URLActions";
import { v4 } from "uuid";
import useInitialDropdownValue from "../../../hooks/useInitialDropdownValue";

const Dropdown = forwardRef(({ variant, options, paramKey = null, placeHolder }, ref) => {
  const [value, setValue] = useState(variant === "default-select" ? placeHolder : options[0].title);
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(variant === "default-select" ? null : 0);
  const dropdownOptionsId = `dropdown-options-${paramKey || v4()}`;

  const paramValue = URLActions.getParamValue(paramKey);
  useInitialDropdownValue(paramKey, paramValue, options, setValue, setSelectedId);

  function onClick(e) {
    e.stopPropagation();
    setVisible(!visible);
  }

  return (
    <div className="dropdown" role="radiogroup">
      <DropdownBtn 
        variant={variant} 
        value={value} 
        onClick={onClick} 
        visible={visible} 
        dropdownOptionsId={dropdownOptionsId}
        ref={ref} 
      />
      {visible && (
          <DropdownOptions
            options={options}
            visible={visible}
            hide={() => setVisible(false)}
            setValue={setValue}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            paramKey={paramKey}
            dropdownOptionsId={dropdownOptionsId}
            variant={variant}
          />
        )
      }
    </div>
  );
});

export default Dropdown;
