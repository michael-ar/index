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

const unsetCookie = res =>
  res.cookie(COOKIE_NAME, '', {
    maxAge: -1,
    httpOnly: true,
    domain: DOMAIN,
  });

const getUserSession = (req, res, next) =>
  req.cookies[COOKIE_NAME]
    ? firebase
        .auth()
        .verifySessionCookie(req.cookies[COOKIE_NAME])
        .then(user => {
          activeSession = uuid();
          res.json({ user, csrfToken: activeSession });
        })
    : res.status(401).send({ authError: 'Session invalid, login required' });

const login = (req, res) =>
  admin
    .auth()
    .createSessionCookie(req.body.token, { expiresIn: LIFESPAN })
    .then(sessionCookie => {
      res.cookie(COOKIE_NAME, sessionCookie, {
        maxAge: LIFESPAN,
        httpOnly: true,
        domain: DOMAIN,
      });
      res.end();
    });

const logout = (req, res) => {
  unsetCookie(res);
  res.end();
};

const authMiddleware = fn => (req, res, next) =>
  firebase
    .auth()
    .verifySessionCookie(req.cookies[COOKIE_NAME], true)
    .then(() => {
      if (req.body.sessionToken !== activeSession) {
        unsetCookie(res);
        res.status(401).send({ authError: 'Session invalid, login required' });
        throw new Error('Unauthorised');
      }
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
