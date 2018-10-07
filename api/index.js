import { redirect } from 'index/utils';

// helpers
////////////

const handleResponse = async res => {
  if (res.status === 401) return redirect({ pathname: '/login' });
  const json = await res.json();
  return json;
};

// auth
/////////

const login = token =>
  fetch('/api/login', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({ token }),
  }).then(() => redirect({ pathname: '/' }));

const logout = () =>
  fetch(`/api/logout`, {
    method: 'POST',
    credentials: 'include',
  }).then(() => redirect({ pathname: '/login' }));

const getUserSession = req => {
  const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
  return fetch(`${baseUrl}/api/getUserSession`, {
    method: 'POST',
    headers: new Headers(req ? req.headers : {}),
    credentials: 'include',
  });
};

// elasticsearch
//////////////////

const getElasticNode = (id, sessionToken) =>
  fetch('/api/search', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({
      sessionToken,
      id,
    }),
  }).then(handleResponse);

export default {
  login,
  logout,
  getUserSession,
  getElasticNode,
};
