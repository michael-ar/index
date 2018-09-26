const elasticsearch = require('elasticsearch');
const config = require('../config/elasticsearch');

const client = new elasticsearch.Client({
  host: config.host,
  log: 'trace',
});

client.ping({ requestTimeout: 1000 }, error =>
  console.log(`elasticsearch cluster is ${error ? 'down' : 'healthy'}!`),
);

const addElasticDocument = async (req, res, next) => {
  const now = new Date();
  await client.create({
    index: 'nodes',
    type: 'node',
    id,
    body: {
      ...rest,
      updated_at: now.valueOf(),
      created_at: now.valueOf(),
    },
  });
};

const getElasticDocument = async (req, res, next) => {
  const { id } = req.body;
  console.log('get-doc!', id);
  const doc = await client.get({
    index: 'nodes',
    type: 'node',
    id,
  });
  console.log('get-doc-res!', doc);
  res.json(doc);
};

module.exports = {
  getElasticDocument,
};
