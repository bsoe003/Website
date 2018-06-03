/* tslint:disable:no-any */

// Source: https://davidwalsh.name/function-debounce
const debounce = function(
  callback: Function,
  wait: number = 0,
  immediate?: boolean
): Function {
  let timeout: any;
  return function(this: any, ...args: any[]) {
    const context = this;
    const later = function() {
      timeout = undefined;
      if (!immediate) {
        callback.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      callback.apply(context, args);
    }
  };
};

export default debounce;
