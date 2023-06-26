const SkipTonextPageContent = ({ title, toFocusRef }) => {

  function onClick() {
    // to focus ref element
    toFocusRef.current.focus();
  }

  return (
    <button className="skip-to-next-page-content" onClick={onClick}>
      <p>{title}</p>
      <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
        <path d="m14 18-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45 14 6l6 6Z" />
      </svg>
    </button>
  );
}

export default SkipTonextPageContent;
