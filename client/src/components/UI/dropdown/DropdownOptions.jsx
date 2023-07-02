import { useEffect, useRef } from "react";
import "./DropdownOptions.css";
import useClickOutsideOptions from "../../../hooks/useClickOutsideOptions";
import { onKeyDown } from "../../../utils/dropdownOptionsControl";

const DropdownOptions = (props) => {
  const ulRef = useRef(null);
  const optionRefs = useRef([]);

  useEffect(() => {
    optionRefs.current[props.selectedId].focus();
    // eslint-disable-next-line
  }, [])

  useClickOutsideOptions(props.hide);

  function onSelectButton(paramValue, value, id) {
    props.setValue(value);
    props.setSelectedId(id);
    // TODO: adding URL params ?
  }

  return (
    <ul
      className="dropdown-options"
      id="dropdown-options"
      data-testid="dropdown-options"
      aria-live="polite"
      ref={ulRef}
    >
      <div className="options-start" data-testid="options-start" tabIndex={0} onFocus={props.hide} />
      {props.options.map(opt => {
        const isSelected = opt.id === props.selectedId;

        return (
          <li key={opt.id} className={isSelected ? "active" : ""}>
            <button
              onClick={() => onSelectButton(opt.value, opt.title, opt.id)}
              onKeyDown={(e) => onKeyDown(e, opt.id, props.options, optionRefs)}
              data-testid={`option ${opt.id}`}
              ref={ref => {
                if (optionRefs.length === props.options.length) return;
                optionRefs.current.push(ref)
              }}
            >
              {opt.title}
            </button>
          </li>
        );
      }

      )}
      <div className="options-end" data-testid="options-end" tabIndex={0} onFocus={props.hide} />
    </ul>
  );
};

export default DropdownOptions;
