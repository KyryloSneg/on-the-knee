function getTimeForLeftInterruptedAnim(isEndedAnim, animationsDuration, currentTime) {
  let timeForLeftInterruptedAnim = 0;
  if (!isEndedAnim) {
    timeForLeftInterruptedAnim = animationsDuration - currentTime;
    if (timeForLeftInterruptedAnim < 0) {
      timeForLeftInterruptedAnim = 0;
    }
  }

  return timeForLeftInterruptedAnim;
}

export default getTimeForLeftInterruptedAnim;