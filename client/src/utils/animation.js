export function animate({timing, draw, duration, delay = 0, elem}) {

  // before delay
  const animationRun = new CustomEvent("jsAnimationRun");
  // after delay
  const animationStart = new CustomEvent("jsAnimationStart");
  // after the animation
  const animationEnd = new CustomEvent("jsAnimationEnd");

  elem.dispatchEvent(animationRun);

  setTimeout(() => {
    elem.dispatchEvent(animationStart);

    let start = performance.now();
  
    requestAnimationFrame(function animate(time) {
      // timeFraction изменяется от 0 до 1
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
  
      // вычисление текущего состояния анимации
      let progress = timing(timeFraction);
  
      draw(progress); // отрисовать её
  
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      } else {
        elem.dispatchEvent(animationEnd);
      }
    });
  }, delay)
}

export function linear(timeFraction) {
  return timeFraction;
}

export function quad(timeFraction) {
  return Math.pow(timeFraction, 2)
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
