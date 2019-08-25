// Get something stored at key from local storage
export function get(key) {
  const longStorage = window.sessionStorage.getItem(`glob-${key}`);
  if (!longStorage || longStorage === '') {
    // If longStorage is empty, look in short storage
    return window.localStorage.getItem(`glob-${key}`);
  }
  return longStorage;
}

/**
 * Remove variable in localStorage
 * @param {string} cname
 */
export function remove(key) {
  if (window.sessionStorage.getItem(`glob-${key}`)) {
    window.sessionStorage.removeItem(`glob-${key}`);
  }
  if (window.localStorage.getItem(`glob-${key}`)) {
    window.localStorage.removeItem(`glob-${key}`);
  }
}

/**
 * Save and get into localStorage
 * @constructor
 * @param {string} key
 * @param {string} value
 */
export function set(key, value, shortSession = false) {
  if (shortSession) {
    window.sessionStorage.setItem(`glob-${key}`, value);
  } else {
    window.localStorage.setItem(`glob-${key}`, value);
  }
}
