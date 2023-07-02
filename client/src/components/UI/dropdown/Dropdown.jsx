import { forwardRef, useState } from "react";
import DropdownBtn from "./DropdownBtn";
import "./Dropdown.css";
import { sortingOptions } from "../../../utils/consts";
import DropdownOptions from "./DropdownOptions";

const Dropdown = forwardRef(({ variant, options = sortingOptions, paramKey, placeHolder }, ref) => {
  const [value, setValue] = useState(variant === "default-select" ? placeHolder : options[0].title);
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(variant === "default-select" ? null : 0);

  function onClick(e) {
    e.stopPropagation();
    setVisible(!visible);
  }

  return (
    <div className="dropdown">
      <DropdownBtn variant={variant} value={value} onClick={onClick} visible={visible} ref={ref} />
      {visible && (
          <DropdownOptions
            options={options}
            visible={visible}
            hide={() => setVisible(false)}
            setValue={setValue}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            paramKey={paramKey}
          />
        )
      }
    </div>
  );
});

export default Dropdown;
