const elasticsearch = require('elasticsearch');
const config = require('../../config/elasticsearch');

const client = new elasticsearch.Client({
  host: config.host,
  log: 'trace',
});

client.ping({ requestTimeout: 1000 }, error =>
  console.log(`elasticsearch cluster is ${error ? 'down' : 'healthy'}!`),
);

const addElasticNode = async (req, res, next) => {
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

const getElasticNode = async (req, res, next) => {
  const { id } = req.body;
  const doc = await client.get({
    index: 'nodes',
    type: 'node',
    id,
  });
  res.json(doc);
};

module.exports = {
  addElasticNode,
  getElasticNode,
};
