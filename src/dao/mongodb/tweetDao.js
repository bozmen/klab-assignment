/**
 * Created by burak on 24-Feb-18.
 */

import Tweet from '../../models/Tweet';

class TweetDao {
    // connectionClient is an mongodb client
    constructor(mongoose) {
        this.elasticsearch = mongoose;
        const tweetSchema = mongoose.Schema(Tweet);
        this._model = mongoose.model('Tweet', tweetSchema);
    }

    // returns a promise
    save(tweet) {
        const Tweet = this._model;
        var newTweet = new Tweet(tweet);
        return newTweet.save();
    }
}

export default TweetDao;