const SkipToNextPageContent = ({ title, toFocusRef, testId = null, ...props }) => {
  let className = "skip-to-next-page-content";
  if (props.className) {
    className += ` ${props.className}`;
  }

  function onClick() {
    // to focus ref element
    // adding "?." to not throw an error when a ref is not implemented atm 
    toFocusRef?.current?.focus();
  }

  return (
    <button className={className} onClick={onClick} data-testid={`${testId}`}>
      <p>{title}</p>
      <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
        <path d="m14 18-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45 14 6l6 6Z" />
      </svg>
    </button>
  );
}

export default SkipToNextPageContent;
