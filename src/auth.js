import axios from 'axios';
import * as localStorage from './localStorage';

// Object which stores the current login-state
const APISession = {
  authenticated: false,
  token: '',
};

const amivapi = axios.create({
  baseURL: 'https://amiv-api.ethz.ch/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

function checkToken(token) {
  // check if a token is still valid
  return new Promise((resolve, reject) => {
    amivapi.get('users', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then((response) => {
      console.log(response.data);
      if (response.status === 200) resolve();
      else reject();
    }).catch(reject);
  });
}

export function checkAuthenticated() {
  // return a promise that resolves always, with a bool that shows whether
  // the user is authenticated
  return new Promise((resolve, reject) => {
    if (APISession.authenticated) resolve(true);
    else {
      console.log('looking for token');
      // let's see if we have a stored token
      const token = localStorage.get('token');
      console.log(`found this token: ${token}`);
      if (token !== '') {
        // check of token is valid
        checkToken(token).then(() => {
          APISession.token = token;
          APISession.authenticated = true;
          resolve(true);
        }).catch(() => {
          resolve(false);
        });
      } else resolve(false);
    }
  });
}

export function getSession() {
  // Promise resolves with authenticated axios-session or fails
  return new Promise((resolve, reject) => {
    checkAuthenticated().then((authenticated) => {
      if (authenticated) {
        const authenticatedSession = axios.create({
          baseURL: 'https://amiv-api.ethz.ch/',
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            Authorization: APISession.token,
          },
        });
        resolve(authenticatedSession);
      } else reject();
    }).catch(reject);
  });
}

export function login(username, password) {
  return new Promise((resolve, reject) => {
    amivapi.post('sessions', { username, password })
      .then((response) => {
        if (response.status === 201) {
          APISession.token = response.data.token;
          APISession.authenticated = true;
          localStorage.set('token', response.data.token);
          resolve();
        }
        reject();
      }).catch(reject);
  });
}
