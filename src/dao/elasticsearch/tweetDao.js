import chalk from 'chalk';

class TweetDao {
    // connectionClient is an elasticsearch client
    constructor(client, indexName) {
        this._client = client;
        this._indexName = indexName;
        this._client.indices.exists({ index: (this._indexName) }).
            then(function(indexExists) {
                console.log(indexExists);
                if (!indexExists) {
                    client.indices.create({
                        index: indexName
                    }).
                    then(function(resp) {
                        console.log(resp);
                    }, function(err) {
                        throw err;
                    })
                }
            }, function(err) {
                throw err;
        });
    }

    put(tweet) {
        var client = this._client;
        var indexName = this._indexName;
        // returns a promise
        return client.index({
            index: indexName,
            type: "tweet",
            body: tweet
        }).then(function(resp) {
            return resp;
        }, function(err) {
            console.log(chalk.red(err.message));
            throw err;
        })
    }

    search(word) {
        var client = this._client;
        var indexName = this._indexName;
        return client.search({
            index: indexName,
            size: 100,
            body: {
                query: {
                    match: {
                        text: word
                    }
                }
            }
        }).then(function(result) {
            return result;
        }, function(err) {
            return err;
        });
    }
}

export default TweetDao;

