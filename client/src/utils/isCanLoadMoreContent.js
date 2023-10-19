// totalCount = 100; _limit = 60
// we have 2 pages. if we navigate to second one we'll load 40 devices (for example)
// we can't load first page, so 100 - 40 = 60; unloaded devices on the first page is equal to 60
// finally, 60 === 60. canLoad =  false;
 
function isCanLoadMoreContent(totalCount, loadedContentAmount, skippedContentAmount) {
  let canLoad = true;
  const unloadedContentAmount = totalCount - loadedContentAmount;
  
  if (unloadedContentAmount === skippedContentAmount) {
    canLoad = false;
  }

  return canLoad;
}

export default isCanLoadMoreContent;