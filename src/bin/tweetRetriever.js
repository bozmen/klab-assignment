import Twitter from 'twitter';
import mongoose from 'mongoose';
import elasticsearch from 'elasticsearch';
import chalk from 'chalk';

import MongoDaoFactory from '../dao/mongodb/daoFactory';
import EsDaoFactory from '../dao/elasticsearch/daoFactory';

require('dotenv').config();

// setup a mongodb connection
mongoose.connect(process.env.MONGODB_URL);

const mongoDaoFactory = new MongoDaoFactory(mongoose);
const tweetDaoMongo = mongoDaoFactory.getTweetDao();

// setup an elasticsearch connection
const elasticsearchClient = new elasticsearch.Client({
    host: process.env.ELASTICDB_URL,
    log: 'trace'
});
const esDaoFactory = new EsDaoFactory(elasticsearchClient);
const tweetDaoEs = esDaoFactory.getTweetDao('tweet');

elasticsearchClient.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});

// setup twitter connection
var twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const trackedWord = '#meinunterricht';

// This retrieves the tweets by pulling them from the stream.
const stream = twitterClient.stream('statuses/filter', { track: trackedWord });
stream.on('data', function(tweet) {
    const tweetModel = {
        text: tweet.text,
        _id: tweet.id,
        username: tweet.user.screen_name,
        date: tweet.created_at
    };
    tweetDaoMongo.
        save(tweetModel).
        then(function(tweet) {
            return tweet;
        }).
        then(function(tweet) {
            console.log(chalk.yellow("About to save the tweet: ", tweet));
            const esTweetModel = {
                text: tweet.text,
                id: tweet._id,
                username: tweet.username,
                date: tweet.date
            };
            return tweetDaoEs.put(esTweetModel);
        }).
        then(function(tweet) {
            console.log(chalk.green("Successfully saved: ", tweet));
    })
});
