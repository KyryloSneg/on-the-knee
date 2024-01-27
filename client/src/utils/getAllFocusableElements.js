function getAllFocusableElements(container) {
  if (!container) return;

  let canFocus = container?.querySelectorAll(['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', '[tabindex="0"]']);
  if (canFocus) {
    // NodeList to Array
    canFocus = Array.from(canFocus);
  }

  return canFocus
}

export default getAllFocusableElements;