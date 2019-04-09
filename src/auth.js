import m from 'mithril';
import axios from 'axios';
import ClientOAuth2 from 'client-oauth2';
import { Snackbar } from 'polythene-mithril';
// eslint-disable-next-line import/extensions
import { apiUrl, ownUrl, oAuthID } from 'networkConfig';
import * as localStorage from './localStorage';
import config from './resourceConfig.json';

// Object which stores the current login-state
const APISession = {
  authenticated: false,
  token: '',
  userID: null,
  rights: {
    users: [],
    joboffers: [],
    studydocuments: [],
  },
};

const amivapi = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
  validateStatus: () => true,
});

// OAuth Handler
const oauth = new ClientOAuth2({
  clientId: oAuthID,
  authorizationUri: `${apiUrl}/oauth`,
  redirectUri: `${ownUrl}/oauthcallback`,
});

function resetSession() {
  APISession.authenticated = false;
  APISession.token = '';
  localStorage.remove('token');
  window.location.replace(oauth.token.getUri());
}

function checkToken(token) {
  // check if a token is still valid
  return new Promise((resolve, reject) => {
    amivapi.get(`sessions/${token}`, {
      headers: { 'Content-Type': 'application/json', Authorization: token },
    }).then((response) => {
      if (response.status === 200) resolve(response.data);
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
      // let's see if we have a stored token
      const token = localStorage.get('token');
      console.log(`found this token: ${token}`);
      if (token !== '') {
        // check of token is valid
        checkToken(token).then((session) => {
          APISession.token = token;
          APISession.authenticated = true;
          APISession.userID = session.user;
          console.log(APISession);
          amivapi.get('/', {
            headers: { 'Content-Type': 'application/json', Authorization: token },
          }).then((response) => {
            const rights = {};
            response.data._links.child.forEach(({ href, methods }) => {
              rights[href] = methods;
            });
            APISession.rights = rights;
            resolve();
          });
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: APISession.token,
        },
        validateStatus: () => true,
      });
      resolve(authenticatedSession);
    }).catch(resetSession);
  });
}

export function deleteSession() {
  return new Promise((resolve, reject) => {
    getSession().then((api) => {
      api.get(`sessions/${APISession.token}`).then((response) => {
        if (response.status === 200) {
          api.delete(
            `sessions/${response.data._id}`,
            { headers: { 'If-Match': response.data._etag } },
          ).then((deleteResponse) => {
            if (deleteResponse.status === 204) {
              resetSession();
              resolve(deleteResponse.data);
            } else reject();
          }).catch(reject);
        } else reject();
      }).catch(reject);
    });
  });
}

export function getCurrentUser() {
  return APISession.userID;
}

export function getUserRights() {
  return APISession.rights;
}

export class ResourceHandler {
  /* Handler to get and manipulate resource items
   *
   * resource: String of the resource to accessm e,g, 'events'
   * searchKeys: keys in the resource item on which to perform search, i.e.
   *   when search is set, any of these keys may match the search pattern
   *   E.g. for an event, this may be ['title_de', 'title_en', 'location']
   */
  constructor(resource, searchKeys = false) {
    this.resource = resource;
    this.rights = [];
    // special case for users
    if (resource === 'users') this.searchKeys = ['firstname', 'lastname', 'nethz'];
    else this.searchKeys = searchKeys || config[resource].searchKeys;
    this.noPatchKeys = [
      '_etag', '_id', '_created', '_links', '_updated',
      ...(config[resource].notPatchableKeys || [])];
    checkAuthenticated().then(() => {
      // again special case for users
      if (resource === 'users' && APISession.isUserAdmin) {
        this.searchKeys = searchKeys || config[resource].searchKeys;
      }
    });
  }

  /*
   * query is a dictionary of different queries
   * Additional to anything specified from eve
   * (http://python-eve.org/features.html#filtering)
   * we support the key `search`, which is translated into a `where` filter
   */
  buildQuerystring(query) {
    const queryKeys = Object.keys(query);

    if (queryKeys.length === 0) return '';

    const fullQuery = {};

    if ('search' in query && query.search && query.search.length > 0 && this.searchKeys) {
      // translate search into where, we just look if any field contains search
      // The search-string may match any of the keys in the object specified in the
      // constructor
      let searchQuery;
      if (query.search.split(' ').length > 1) {
        searchQuery = {
          $and: query.search.split(' ').map(searchPhrase => ({
            $or: this.searchKeys.map((key) => {
              const fieldQuery = {};
              fieldQuery[key] = {
                $regex: `${searchPhrase}`,
                $options: 'i',
              };
              return fieldQuery;
            }),
          })),
        };
      } else {
        searchQuery = {
          $or: this.searchKeys.map((key) => {
            const fieldQuery = {};
            fieldQuery[key] = {
              $regex: `${query.search}`,
              $options: 'i',
            };
            return fieldQuery;
          }),
        };
      }


      // if there exists already a where-filter, AND them together
      if ('where' in query) {
        fullQuery.where = JSON.stringify({ $and: [searchQuery, query.where] });
      } else {
        fullQuery.where = JSON.stringify(searchQuery);
      }
    } else if ('where' in query) {
      fullQuery.where = JSON.stringify(query.where);
    }

    // add all other keys
    queryKeys.filter(key => (key !== 'where' && key !== 'search'))
      .forEach((key) => { fullQuery[key] = JSON.stringify(query[key]); });

    // now we can acutally build the query string
    return `?${m.buildQueryString(fullQuery)}`;
  }

  networkError(e) {
    console.log(e);
    Snackbar.show({ title: 'Network error, try again.', style: { color: 'red' } });
  }

  // in future, we may communicate based on the data available
  // therefore, require data already here
  // eslint-disable-next-line no-unused-vars
  error422(data) {
    Snackbar.show({ title: 'Errors in object, please fix.' });
  }

  successful(title) {
    Snackbar.show({ title, style: { color: 'green' } });
  }

  get(query) {
    return new Promise((resolve, reject) => {
      getSession().then((api) => {
        let url = this.resource;
        if (Object.keys(query).length > 0) url += this.buildQuerystring(query);
        api.get(url).then((response) => {
          if (response.status >= 400) {
            Snackbar.show({ title: response.data, style: { color: 'red' } });
            if (response.status === 401) resetSession();
            reject();
          } else {
            this.rights = response.data._links.self.methods;
            resolve(response.data);
          }
        }).catch((e) => {
          this.networkError(e);
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
            embedded: JSON.stringify(embedded),
          })}`;
        }
        api.get(url).then((response) => {
          if (response.status === 404) {
            m.route.set('/404');
          } else if (response.status >= 400) {
            Snackbar.show({ title: response.data, style: { color: 'red' } });
            if (response.status === 401) resetSession();
            reject();
          } else {
            resolve(response.data);
          }
        }).catch((e) => {
          this.networkError(e);
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
            this.successful('Creation successful.');
            resolve({});
          } else if (response.status === 422) {
            this.error422(response.data);
            reject(response.data);
          } else if (response.status >= 400) {
            Snackbar.show({ title: response.data, style: { color: 'red' } });
            if (response.status === 401) resetSession();
            reject();
          } else {
            resolve(response.data);
          }
        }).catch((e) => {
          this.networkError(e);
          reject(e);
        });
      });
    });
  }

  patch(item) {
    const isFormData = item instanceof FormData;
    let patchInfo = {};
    if (isFormData) patchInfo = { id: item.get('_id'), etag: item.get('_etag') };
    else patchInfo = { id: item._id, etag: item._etag };

    return new Promise((resolve, reject) => {
      getSession().then((api) => {
        let submitData = item;
        if (!isFormData) submitData = Object.assign({}, item);
        // not all fields in the item can be patched. We filter out the fields
        // we are allowed to send
        this.noPatchKeys.forEach((key) => {
          if (isFormData) submitData.delete(key);
          else delete submitData[key];
        });
        api.patch(`${this.resource}/${patchInfo.id}`, submitData, {
          headers: { 'If-Match': patchInfo.etag },
        }).then((response) => {
          if (response.status === 422) {
            this.error422(response.data);
            reject(response.data);
          } else if (response.status >= 400) {
            Snackbar.show({ title: response.data, style: { color: 'red' } });
            if (response.status === 401) resetSession();
            reject();
          } else {
            this.successful('Change successful.');
            resolve(response.data);
          }
        }).catch((e) => {
          this.networkError(e);
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
            Snackbar.show({ title: response.data, style: { color: 'red' } });
            if (response.status === 401) resetSession();
            reject();
          } else {
            this.successful('Delete successful.');
            resolve();
          }
        }).catch((e) => {
          this.networkError(e);
          reject(e);
        });
      });
    });
  }
}

export class OauthRedirect {
  view() {
    oauth.token.getToken(m.route.get()).then((auth) => {
      localStorage.set('token', auth.accessToken);
      checkAuthenticated().then(() => {
        // checkAuthenticated will check whetehr the token is valid
        // and store all relevant session info for easy access
        m.route.set('/');
      }).catch(resetSession);
    });
    return 'redirecting...';
  }
}
