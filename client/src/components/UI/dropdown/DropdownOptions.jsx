import "./DropdownOptions.css";
import { useEffect, useRef } from "react";
import useClickOutsideOptions from "../../../hooks/useClickOutsideOptions";
import { onKeyDown } from "../../../utils/dropdownOptionsControl";
import { Link } from "react-router-dom";
import URLActions from "../../../utils/URLActions";

const DropdownOptions = (props) => {
  const ulRef = useRef(null);
  const optionRefs = useRef([]);

  const isToRenderOptions = props.visible;

  useEffect(() => {
    if (!isToRenderOptions) optionRefs.current = [];
  }, [isToRenderOptions]);

  useEffect(() => {
    if (props.selectedId >= 0 && typeof props.selectedId === "number") {
      optionRefs.current[props.selectedId]?.focus();
    } else {
      // we have to focus the first option if there's no any selected option
      optionRefs.current[0]?.focus();
    }
    // eslint-disable-next-line
  }, [isToRenderOptions])

  useClickOutsideOptions(isToRenderOptions ? props.hide : null);

  function onSelectButton(title, id) {
    props.setValue(title);
    props.setSelectedId(id);

    if (props.onSelectCb) props.onSelectCb(id);
  }

  let className = "dropdown-options";
  if (!isToRenderOptions) {
    className += " display-none";
  }

  return (
    <ul
      className={className}
      id={props.dropdownOptionsId}
      data-testid={props.dropdownOptionsId}
      aria-live="polite"
      role="radiogroup"
      ref={ulRef}
    >
      {isToRenderOptions && (
        <>
          <div className="options-start" data-testid="options-start" tabIndex={0} onFocus={props.hide} />
          {props.options.map(opt => {
            const isSelected = opt.id === props.selectedId;
    
            if (props.paramKey) {
              let to = URLActions.setNewParam(props.paramKey, opt.value);
              if (props.variant === "sorting-filter") {
                to = URLActions.getURLWithResettedPageRelatedParams(to);
              }
    
              return (
                <li key={opt.id} className={isSelected ? "active" : ""}>
                  <Link
                    to={to}
                    onKeyDown={(e) => onKeyDown(e, opt.id, props.options, optionRefs)}
                    data-testid={`dropdown-option-${props.paramKey} ${opt.id}`}
                    ref={ref => {
                      if (optionRefs.current.length === props.options.length) return;
                      optionRefs.current.push(ref)
                    }}
                    aria-checked={isSelected}
                    role="radio"
                    preventScrollReset={true}
                  >
                    {opt.title}
                  </Link>
                </li>
              );
            }
    
            return (
              <li key={opt.id} className={isSelected ? "active" : ""}>
                <button
                  onClick={() => onSelectButton(opt.title, opt.id)}
                  onKeyDown={(e) => onKeyDown(e, opt.id, props.options, optionRefs)}
                  data-testid={`option ${opt.id}`}
                  ref={ref => {
                    if (optionRefs.current.length === props.options.length) return;
                    optionRefs.current.push(ref)
                  }}
                  aria-checked={isSelected}
                  role="radio"
                >
                  {opt.title}
                </button>
              </li>
            );
          }
    
          )}
          <div className="options-end" data-testid="options-end" tabIndex={0} onFocus={props.hide} />
        </>
      )}
    </ul>
  );
};

export default DropdownOptions;
