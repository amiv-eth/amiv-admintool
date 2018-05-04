import m from 'mithril';
import axios from 'axios';
import ClientOAuth2 from 'client-oauth2';
import { apiUrl, ownUrl, oAuthID } from 'networkConfig';
import * as localStorage from './localStorage';
import config from './resourceConfig.json';

// Object which stores the current login-state
const APISession = {
  authenticated: false,
  token: '',
};

console.log(apiUrl);

// OAuth Handler
const oauth = new ClientOAuth2({
  clientId: oAuthID,
  authorizationUri: `${apiUrl}/oauth`,
  redirectUri: `${ownUrl}/oauthcallback`,
});

export function resetSession() {
  APISession.authenticated = false;
  APISession.token = '';
  localStorage.remove('token');
  window.location.replace(oauth.token.getUri());
}

const amivapi = axios.create({
  baseURL: apiUrl,
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
        baseURL: apiUrl,
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

export class ResourceHandler {
  constructor(resource, searchKeys = false) {
    this.resource = resource;
    this.searchKeys = searchKeys || config[resource].searchKeys;
    this.noPatchKeys = [
      '_etag', '_id', '_created', '_links', '_updated',
      ...(config[resource].notPatchableKeys || [])];
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
          if (response.code === 201) {
            resolve({});
          } else if (response.status === 422) {
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

  patch(item, formData = false) {
    return new Promise((resolve, reject) => {
      getSession().then((api) => {
        // not all fields in the item can be patched. We filter out the fields
        // we are allowed to send
        let submitData;
        if (formData) {
          submitData = new FormData();
          Object.keys(item).forEach((key) => {
            if (!this.noPatchKeys.includes(key)) {
              submitData.append(key, item[key]);
            }
          });
        } else {
          submitData = Object.assign({}, item);
          this.noPatchKeys.forEach((key) => { delete submitData[key]; });
        }

        api.patch(`${this.resource}/${item._id}`, submitData, {
          headers: { 'If-Match': item._etag },
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

export class OauthRedirect {
  view() {
    oauth.token.getToken(m.route.get()).then((response) => {
      APISession.authenticated = true;
      APISession.token = response.accessToken;
      localStorage.set('token', response.accessToken);
      m.route.set('/users');
    });
    return 'redirecting...';
  }
}
