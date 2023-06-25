import { useEffect, useRef } from "react";
import "./DropdownOptions.css";

const DropdownOptions = (props) => {
  const ulRef = useRef(null);
  const optionRefs = useRef([]);

  useEffect(() => {
    optionRefs.current[props.selectedId].focus();
    // eslint-disable-next-line
  }, [])

  useEffect(() => {

    function clickHandler() {
      props.hide();
    }

    window.addEventListener("click", clickHandler);

    return () => {
      window.removeEventListener("click", clickHandler);
    }
  });

  function onSelectButton(paramValue, value, id) {
    props.setValue(value);
    props.setSelectedId(id);
    // TODO: adding URL params and filtering products by them
  }

  function onKeyDown(e, id) {
    switch (e.key) {
      case "ArrowDown":
        if (id === props.options.length - 1) {
          optionRefs.current[0].focus();
        } else {
          optionRefs.current[id + 1].focus();
        }
        break;
      case "ArrowUp":
        if (id === 0) {
          optionRefs.current[props.options.length - 1].focus();
        } else {
          optionRefs.current[id - 1].focus();
        }
        break;
      default: 
        break;  
    }
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
              onKeyDown={(e) => onKeyDown(e, opt.id)}
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
