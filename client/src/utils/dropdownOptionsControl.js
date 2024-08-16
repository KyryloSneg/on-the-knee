export function onKeyDown(e, id, options, optionRefs) {
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();

      if (id === options.length - 1) {
        optionRefs.current[0].focus();
      } else {
        optionRefs.current[id + 1].focus();
      }
      break;
    case "ArrowRight":
      e.preventDefault();

      if (id === options.length - 1) {
        optionRefs.current[0].focus();
      } else {
        optionRefs.current[id + 1].focus();
      }
      break;
    case "ArrowUp":
      e.preventDefault();
      
      if (id === 0) {
        optionRefs.current[options.length - 1].focus();
      } else {
        optionRefs.current[id - 1].focus();
      }
      break;
    case "ArrowLeft":
      e.preventDefault();
      
      if (id === 0) {
        optionRefs.current[options.length - 1].focus();
      } else {
        optionRefs.current[id - 1].focus();
      }
      break;
    default: 
      break;  
  }
}