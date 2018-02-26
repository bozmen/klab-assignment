import TweetDao from './tweetDao';

class DaoFactory {
    constructor(mongoose) {
        this.elasticsearch = mongoose;
    }

    getTweetDao() {
        return new TweetDao(this.elasticsearch);
    }
}

export default DaoFactory;