const admin = require('firebase-admin');
const uuid = require('uuid/v4');
const firebaseConfig = require('../../config/firebase');

const firebase = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig.server.serviceAccount),
  databaseURL: firebaseConfig.server.databaseURL,
});

const DOMAIN = 'index.wip';
const COOKIE_NAME = 'index_tkn';
const LIFESPAN = parseInt(30 * 24 * 60 * 60, 10);

let activeSession;

const getUserSession = (req, res, next) =>
  firebase
    .auth()
    .verifyIdToken(req.cookies[COOKIE_NAME])
    .then(user => {
      activeSession = uuid();
      res.json({ user, csrfToken: activeSession });
    });

const login = (req, res) => {
  res.cookie(COOKIE_NAME, req.body.token, {
    maxAge: LIFESPAN,
    httpOnly: true,
    domain: DOMAIN,
  });
  res.end();
};

const logout = (req, res) => {
  res.cookie(COOKIE_NAME, req.body.token, {
    maxAge: -1,
    httpOnly: true,
    domain: DOMAIN,
  });
  res.end();
};

const authMiddleware = fn => (req, res, next) =>
  firebase
    .auth()
    .verifyIdToken(req.cookies[COOKIE_NAME])
    .then(() => {
      if (req.body.sessionToken !== activeSession)
        throw new Error('Invalid session');
      return;
    })
    .then(() => fn(req, res, next))
    .catch(error => res.json({ error }));

const asyncMiddleware = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const guardMiddleware = fn => authMiddleware(asyncMiddleware(fn));

module.exports = {
  asyncMiddleware,
  authMiddleware,
  getUserSession,
  firebase,
  guardMiddleware,
  login,
  logout,
};
