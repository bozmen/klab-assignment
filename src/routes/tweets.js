/**
 * Created by burak on 25-Feb-18.
 */
import EsDaoFactory from '../dao/elasticsearch/daoFactory';
import elasticsearch from 'elasticsearch';

var express = require('express');
var router = express.Router();

// setup an elasticsearch connection
const elasticsearchClient = new elasticsearch.Client({
    host: process.env.ELASTICDB_URL,
    log: 'trace'
});

const esDaoFactory = new EsDaoFactory(elasticsearchClient);
const tweetDao = esDaoFactory.getTweetDao('tweet');


/* GET searches the given parameter and returns the last n tweets */
router.get('/', function(req, res, next) {
    var keyword = req.query.q.trim();
    if (keyword.length > 0) {
        tweetDao.search(keyword).then(function (results) {
            res.json(results);
        }, function (err) {
            res.json(err);
        });
    } else {
        var error = new Error('Bad Request');
        error.status = 400;
        error.message = "Please enter a value.";
        res.json(error);
    }
});

export default router;

