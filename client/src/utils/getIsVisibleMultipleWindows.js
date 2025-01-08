function getIsVisibleMultipleWindows() {
  const allWindows = document.querySelectorAll(".window:not(.display-none)");
  return allWindows.length >= 2;
}

export default getIsVisibleMultipleWindows;