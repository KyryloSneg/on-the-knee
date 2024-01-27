function getIsVisibleMultipleWindows() {
  const allWindows = document.querySelectorAll(".window");
  return allWindows.length >= 2;
}

export default getIsVisibleMultipleWindows;