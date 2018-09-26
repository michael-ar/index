const admin = require('firebase-admin');
const firebaseConfig = require('../config/firebase');

const firebase = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig.server.serviceAccount),
  databaseURL: firebaseConfig.server.databaseURL,
});

const authMiddleware = fn => (req, res, next) =>
  firebase
    .auth()
    .verifyIdToken(req.body.token)
    .then(() => fn(req, res, next))
    .catch(error => res.json({ error }));

const asyncMiddleware = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const guardMiddleware = fn => authMiddleware(asyncMiddleware(fn));

module.exports = { asyncMiddleware, authMiddleware, guardMiddleware };
