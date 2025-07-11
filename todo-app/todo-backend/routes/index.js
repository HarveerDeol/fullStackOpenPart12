const express = require('express');
const router = express.Router();
const{ getAsync, setAsync } = require('../redis')
const configs = require('../util/config')
const redis = require('../redis')

let visits = 0


/* GET index data. */
router.get('/', async (req, res) => {
  visits++
  
  res.send({
    ...configs,
    visits
  });
});



/* GET todos listing. */
router.get('/statistics', async (_, res) => {
  const current = await getAsync('added_todos');
  res.send({current});
});

module.exports = router;
