/**
 * Created by burak on 24-Feb-18.
 */
import TweetDao from './tweetDao';

class DaoFactory {
    constructor(elasticsearch) {
        this._elasticsearch = elasticsearch;
    }

    getTweetDao(indexName) {
        return new TweetDao(this._elasticsearch, indexName);
    }
}

export default DaoFactory;