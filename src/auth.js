import axios from 'axios';
import * as localStorage from './localStorage';
import config from './config.json';

const m = require('mithril');

// Object which stores the current login-state
const APISession = {
  authenticated: false,
  token: '',
};

export function resetSession() {
  APISession.authenticated = false;
  APISession.token = '';
  m.route.set('/login');
}

const amivapi = axios.create({
  baseURL: config.apiUrl,
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
  return new Promise((resolve) => {
    if (APISession.authenticated) resolve();
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
          resolve();
        }).catch(resetSession);
      } else resetSession();
    }
  });
}

export function getSession() {
  // Promise resolves with authenticated axios-session or fails
  return new Promise((resolve) => {
    checkAuthenticated().then(() => {
      const authenticatedSession = axios.create({
        baseURL: config.apiUrl,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: APISession.token,
        },
      });
      resolve(authenticatedSession);
    }).catch(resetSession);
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

export class ResourceHandler {
  constructor(resource, searchKeys = false) {
    this.resource = resource;
    this.searchKeys = searchKeys || config[resource].searchKeys;
    this.patchKeys = config[resource].patchableKeys;

    checkAuthenticated();
  }

  // definitions of query parameters in addition to API go here
  buildQuerystring(query) {
    const queryKeys = Object.keys(query);

    if (queryKeys.length === 0) return '';

    const fullQuery = {};

    if ('search' in query && query.search.length > 0) {
      // translate search into where, we just look if any field contains search
      const searchQuery = {
        $or: this.searchKeys.map((key) => {
          const fieldQuery = {};
          fieldQuery[key] = query.search;
          return fieldQuery;
        }),
      };

      // if there exists already a where-filter, AND them together
      if ('where' in query) {
        fullQuery.where = JSON.stringify({ $and: [searchQuery, query.where] });
      } else {
        fullQuery.where = JSON.stringify(searchQuery);
      }
    } else if (query.where) {
      fullQuery.where = JSON.stringify(query.where);
    }

    // add all other keys
    queryKeys.filter(key => (key !== 'where' && key !== 'search'))
      .forEach((key) => { fullQuery[key] = JSON.stringify(query[key]); });

    // now we can acutally build the query string
    return `?${m.buildQueryString(fullQuery)}`;
  }

  get(query) {
    return new Promise((resolve, reject) => {
      getSession().then((api) => {
        let url = this.resource;
        if (Object.keys(query).length > 0) url += this.buildQuerystring(query);
        api.get(url).then((response) => {
          if (response.status >= 400) {
            resetSession();
            reject();
          } else {
            resolve(response.data);
          }
        }).catch((e) => {
          console.log(e);
          reject(e);
        });
      });
    });
  }

  getItem(id, embedded = {}) {
    return new Promise((resolve, reject) => {
      getSession().then((api) => {
        let url = `${this.resource}/${id}`;
        // in case embedded is specified, append to url
        if (Object.keys(embedded).length > 0) {
          url += `?${m.buildQueryString({
            embedded: JSON.stringify(this.embedded),
          })}`;
        }
        api.get(url).then((response) => {
          if (response.status >= 400) {
            resetSession();
            reject();
          } else {
            resolve(response.data);
          }
        }).catch((e) => {
          console.log(e);
          reject(e);
        });
      });
    });
  }

  post(item) {
    return new Promise((resolve, reject) => {
      getSession().then((api) => {
        api.post(this.resource, item).then((response) => {
          if (response.status === 422) {
            reject(response.data);
          } else if (response.status >= 400) {
            resetSession();
            reject();
          } else {
            resolve(response.data);
          }
        }).catch((e) => {
          console.log(e);
          reject(e);
        });
      });
    });
  }

  patch(item) {
    return new Promise((resolve, reject) => {
      getSession().then((api) => {
        // not all fields in the item can be patched. We filter out the fields
        // we are allowed to send
        const submitData = {};
        this.patchFields.forEach((key) => { submitData[key] = this.data[key]; });

        api.patch(`${this.resource}/${item._id}`, {
          headers: { 'If-Match': item._etag },
          data: submitData,
        }).then((response) => {
          if (response.status === 422) {
            reject(response.data);
          } else if (response.status >= 400) {
            resetSession();
            reject();
          } else {
            resolve(response.data);
          }
        }).catch((e) => {
          console.log(e);
          reject(e);
        });
      });
    });
  }

  delete(item) {
    return new Promise((resolve, reject) => {
      getSession().then((api) => {
        api.delete(`${this.resource}/${item._id}`, {
          headers: { 'If-Match': item._etag },
        }).then((response) => {
          if (response.status >= 400) {
            resetSession();
            reject();
          } else {
            resolve();
          }
        }).catch((e) => {
          console.log(e);
          reject(e);
        });
      });
    });
  }
}
