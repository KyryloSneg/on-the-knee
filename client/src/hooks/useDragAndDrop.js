import { useRef } from "react";

function useDragAndDrop(dropCb, isDragged = null, setIsDragged = null) {
  const draggedElem = useRef(null);

  function onDragEnter(e) {
    e.preventDefault();
    draggedElem.current = e.target;

    if (
      setIsDragged 
      && isDragged === false 
    ) setIsDragged(true);
  }

  function onDragLeave(e) {
    e.preventDefault();
    // e.target is equal to dragged elem only if we leaved our component
    if (setIsDragged 
      && isDragged === true
      && e.target === draggedElem.current
    ) setIsDragged(false);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function onDrop(e) {
    e.preventDefault();
    dropCb(e);
    setIsDragged(false);
  }

  return {
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop
  }

}

export default useDragAndDrop;