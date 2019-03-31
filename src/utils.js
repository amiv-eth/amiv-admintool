// as taken from underscore:
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
  let timeout;
  return function outer(...args) {
    const context = this;
    function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export function dateFormatter(datestring, time = true) {
  // converts an API datestring into the standard format 01.01.1990, 10:21
  if (!datestring) return '';
  const date = new Date(datestring);
  if (!time) return date.toLocaleDateString('de-DE');
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
