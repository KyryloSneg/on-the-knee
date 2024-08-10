export default function onRadioKeyDown(e, checkPrev, checkNext) {
  // we can't use e.preventDefault() before switch because we couldn't check radio with enter / space then
  switch (e.code) {
    case "ArrowUp":
      e.preventDefault();
      checkPrev();
      break;
    case "ArrowDown":
      e.preventDefault();
      checkNext();
      break;
    case "ArrowLeft":
      e.preventDefault();
      checkPrev();
      break;
    case "ArrowRight":
      e.preventDefault();
      checkNext();
      break;
    default:
      break;
  }
}