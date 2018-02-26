# klab-assignment

1. Setup

- Make sure you have elasticserver and MongoDB installed on your computer. Check .env file and make sure you enter the right
Twitter Developer credentials (assuming you have one).
- Then run command "concurrently --kill-others \"npm run start-api-server-dev > api.log\" \"npm run start-twitter-server-dev\" > tw.log"
- Go to 'localhost:3000' (or if you changed .env file, go to the hostname/port that you set)
- Enjoy your search on #meinunterricht!


2. Design Decisions

- I used MongoDB (primary database) and elasticsearch. Even though I had some experience with MySQL before, I wanted to complete a project with MongoDB.

- Since I am not able to get tweets older than 7 days, I assumed watching the current streaming tweets and searching amongst them would be better. Therefore,
the system watches the stream, saves the tweets to MongoDB, and after a successful persist, puts them on an elasticsearch index named "tweets". I could have done
it more modularized and parametric (having an option to which hashtag to track and putting each tweet to its corresponding hashtag named index), but I did not focus on that.

- To be honest, this was my first node.js application, and I could not give it much thought as well. I mostly focused on data persistence side
and considered ways of modularizing it. Therefore, I have DAO objects that can be produced by DAO factories, different for each data persistence
tool.

- Since it was my first application, I do not know the best practices, and I am aware it was a sloppy work. However still would like to talk about 
all the sloppiness of the project, because I know what is bad and what is good, and would like to hear your feedback about it. I had fun implementing
this, even though end product disappointed me (well, at least it is working).

- I have 2 services that runs on different ports: Search API on 3000 and Tweet Stream Watcher on 3001. I wanted to separate them in order to modularize
them. We need to scale just the one that it needs, not both.

3. Change Management

- I tried to abstract database access objects, so that in case of a DB technology change, it should be easier to use another DB. 
- Other than that, I tried every parameter/variable to be got from single source. It still has it flaws, and as I said before, I am aware of them.



