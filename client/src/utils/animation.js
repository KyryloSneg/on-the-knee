import BezierEasing from "bezier-easing";

export function animate({timing, draw, duration, delay = 0, elem, uniqueEventId = "", timeForLeftInterruptedOppositeAnim = null}) {

  // before delay
  const animationRun = new CustomEvent(uniqueEventId ? `jsAnimationRun-${uniqueEventId}` : "jsAnimationRun");
  // next event almost at the bottom of the function
  // after the animation
  const animationEnd = new CustomEvent(uniqueEventId ? `jsAnimationEnd-${uniqueEventId}` : "jsAnimationEnd");

  elem.dispatchEvent(animationRun);
  setTimeout(() => {
    const start = performance.now();

    let currentTime;
    let innerRequestId;

    let outerRequestId = requestAnimationFrame(function animate(time) {
      if (timeForLeftInterruptedOppositeAnim) {
        currentTime = (time + timeForLeftInterruptedOppositeAnim) - start;
      } else {
        currentTime = time - start;
      }

      if (currentTime > duration) {
        currentTime = duration;
      } else if (currentTime < 0) {
        currentTime = 0;
      }

      // timeFraction изменяется от 0 до 1
      let timeFraction = currentTime / duration;
      if (timeFraction > 1) timeFraction = 1;
  
      // вычисление текущего состояния анимации
      let progress = timing(timeFraction);
      draw(progress); // отрисовать её
  
      if (timeFraction < 1) {
        innerRequestId = requestAnimationFrame(animate);
      } else {
        elem.dispatchEvent(animationEnd);
      }

      onFrameEnd();
    });

    function onFrameEnd() {
      const frameEnd = new CustomEvent(
        uniqueEventId ? `jsFrameEnd-${uniqueEventId}` : "jsAnimationEnd",
        { detail: { outerRequestId, innerRequestId, currentTime } }
      );
      elem.dispatchEvent(frameEnd);
    }

    // after delay
    const animationStart = new CustomEvent(
      uniqueEventId ? `jsAnimationStart-${uniqueEventId}` : "jsAnimationStart",
      { detail: { outerRequestId, innerRequestId } });
    elem.dispatchEvent(animationStart);
  }, delay)
}

export function linear(timeFraction) {
  return timeFraction;
}

export function quad(timeFraction) {
  return Math.pow(timeFraction, 2)
}

export function easeOut(timeFraction) {
  const easing = BezierEasing(0, 0, 0.58, 1.0);
  return easing(timeFraction);
}

export function easeIn(timeFraction) {
  const easing = BezierEasing(0.42, 0, 1.0, 1.0);
  return easing(timeFraction);
}

// принимает функцию расчёта времени и возвращает преобразованный вариант
// idk why but the function below doesn't work properly with 'linear' and 'quad' timing functions
export function makeEaseOutNonLinearQuad(timing) {
  return function(timeFraction) {
    return 1 - timing(1 - timeFraction);
  }
}

// for 'linear' and 'quad' timing functions
export function makeEaseOutLinearQuad(timing) {
  return function(timeFraction) {
    return 1 - timing(timeFraction);
  }
}
