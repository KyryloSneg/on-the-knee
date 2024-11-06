import "./UIDetails.css";
import React, { useState } from 'react';
import dropdownArrowIcon from "../../../assets/expand_more.svg";

// btnChildren should include heading
const UIDetails = ({ 
  btnChildren, contentChildren, contentId, isInitiallyExpanded = false,
  isToPassBtnChildIsExpandedProp = false, isToPassBtnChildSetIsExpandedProp = false,
  propsClassName = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded)

  function onClick() {
    setIsExpanded(!isExpanded);
  }

  let btnChildrenToRender;
  if (isToPassBtnChildIsExpandedProp && isToPassBtnChildSetIsExpandedProp) {
    btnChildrenToRender = React.cloneElement(btnChildren, { ...btnChildren.props, isExpanded, setIsExpanded });
  } else if (isToPassBtnChildIsExpandedProp) {
    btnChildrenToRender = React.cloneElement(btnChildren, { ...btnChildren.props, isExpanded });
  } else if (isToPassBtnChildSetIsExpandedProp) {
    btnChildrenToRender = React.cloneElement(btnChildren, { ...btnChildren.props, setIsExpanded });
  } else {
    btnChildrenToRender = btnChildren;
  }

  let className = "ui-details";
  if (propsClassName) {
    className += ` ${propsClassName}`;
  }

  return (
    <section className={className}>
      <header>
        <button 
          className="ui-details-btn" 
          aria-expanded={isExpanded}
          aria-controls={contentId}
          aria-label={`${isExpanded ? "Collapse" : "Expand"} the details`}
          onClick={onClick}
        >
          {/* passing isExpanded and setIsExpanded props to the btn children element */}
          {btnChildrenToRender}
          <img
            src={dropdownArrowIcon}
            alt={isExpanded ? "Collapse" : "Expand"}
            className={isExpanded ? "rotated" : ""}
            draggable="false"
          />
        </button>
      </header>
      {isExpanded && contentChildren}
    </section>
  );
}

export default UIDetails;
