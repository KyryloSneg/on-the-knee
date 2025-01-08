import "./UIDetails.css";
import { v4 } from "uuid";
import DropdownArrow from "../dropdownArrow/DropdownArrow";
import React, { useMemo, useState } from 'react';

// btnChildren should include heading
const UIDetails = ({ 
  btnChildren, contentChildren, isInitiallyExpanded = false,
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

  const contentId = useMemo(() => v4(), []);

  let className = "ui-details";
  if (propsClassName) {
    className += ` ${propsClassName}`;
  }

  let contentWrapperClassName = "ui-details-content-wrapper";
  if (!isExpanded) {
    contentWrapperClassName += " display-none";
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
          <DropdownArrow isExpanded={isExpanded} />
        </button>
      </header>
      {/* this method not as good as the one i used in the categories menu, but it's a LOT easier to maintain */}
      <div id={contentId} className={contentWrapperClassName}>
        {isExpanded && contentChildren}
      </div>
    </section>
  );
}

export default UIDetails;
