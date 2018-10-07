const express = require('express');
const next = require('next');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { getElasticDocument } = require('./endpoints/elasticsearch');
const {
  login,
  logout,
  getUserSession,
  firebase,
  guardMiddleware,
} = require('./endpoints/auth');

const DOMAIN = 'http://localhost:3000';
const PORT = parseInt(process.env.PORT, 10) || 3000;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server
    .use(bodyParser.json())
    .use(cookieParser())
    .use(cors({ origin: DOMAIN, credentials: true }))
    .use((req, res, next) => {
      req.firebaseServer = firebase;
      next();
    });

  server.post('/api/getUserSession', getUserSession);
  server.post('/api/logout', logout);
  server.post('/api/login', login);
  server.post('/api/search', guardMiddleware(getElasticDocument));

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
