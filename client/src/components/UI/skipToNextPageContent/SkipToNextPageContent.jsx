const SkipToNextPageContent = ({ title, elemToFocus, focusCallback = null, iconSrc = null, iconAlt = "", svgElem = null, isIconInTheEnd = true, testId = null, ...props }) => {
  let className = "skip-to-next-page-content";
  if (props.className) {
    className += ` ${props.className}`;
  }

  function onClick() {
    // to focus element
    // adding "?." to not throw an error when an elem is not implemented atm 

    // sometimes in order to fix some bugs we need to use refs
    // (for example when we don't want to re-render a component to use correct element to focus)
    if (elemToFocus?.current) {
      elemToFocus.current?.focus();
    } else {
      elemToFocus?.focus();
    }

    if (focusCallback) focusCallback();
  }

  let icon = svgElem || (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
      <path d="m14 18-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45 14 6l6 6Z" />
    </svg>
  );

  if (iconSrc) {
    icon = <img src={iconSrc} alt={iconAlt} />
  }

  return (
    <button className={className} onClick={onClick} data-testid={`${testId}`}>
      {!isIconInTheEnd && icon}
      {title && <p>{title}</p>}
      {isIconInTheEnd && icon}
    </button>
  );
}

export default SkipToNextPageContent;
