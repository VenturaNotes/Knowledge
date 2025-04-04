---
Source:
  - https://www.youtube.com/watch?v=coJNGQFJ5kM
Reviewed: false
---
- ![[Screenshot 2024-09-24 at 4.17.36 AM.png]]
	- Will start talking about existing databases and actually apply some of the knowledge that we've learned in the last few videos 
	- Will talk about the pitfalls of [[relational database|relational databases]]. Many people will use the term [[SQL]] and [[NoSQL]] and he doesn't like doing that because not all relational databases use SQL. [[NoSQL]] is a super broad term. Prefers to use the term [[Non-relational database|non-relational databases]] but even within this, there are [[graph databases]], key value stores, wide column databases and other options. Will just use the terms relational and non-relational for now.
		- Video will mainly be about why relational databases are not always the answer
		- In subsequent videos, will do more of a case study on some of the other options that we have to implement 
	- Pitfalls of [[relational database|relational databases]]
	- Relational Databases Background
		- Tables holding many rows of structured data (pre-defined schema)
			- This means all of the columns have been predefined on the table creation and until you alter the table or use an optional field, the schema generally stays constant which can make it hard to adapt
		- Rows of one table can have a relation to rows of another if they share a common key
			- This key is generally known as a [[foreign key]]
		- Built in query optimizer that returns results using the declarative SQL language
			- A [[declarative language]] is basically when you type in the format of the result of the query we want. Basically saying that I want to select everything from this table and provide me with this type of information
			- Query optimizer is going to say that I know the result he wants, let's do that the most efficient way possible using a combination of indexes, parallelism and other things under the hood.
				- In this way, relational databases are a little bit of a black box.
		- Popular [[relational database|RDBMS]]: [[MySQL]], [[PostgreSQL]]
	- Other implementation Details (for relational databases)
		- Use [[B-trees]]
			- Means you're writing and reading from disk
		- Support transactions with 2 phase locking for isolation
		- All reads and writes go to disk
	- Scaling a relational database
		- [[Vertical scaling]]
			- Increasing the power of the hardware running the database (traditional approach)
				- Instead of using more nodes to put the database on, they just used a more powerful machine. This lead to things like [[mainframes]]
					- Now however, everyone wants to do [[cloud computing]]. This means we have a bunch of generic computers located in data centers which we can rent out and use a certain amount of compute units if we want. So everyone wants to scale horizontally
		- [[Horizontal Scaling]]
			- Adding more computers/nodes of similar power, distributing workload
			- Means that we have to shard/partition our dataset, that is where things get hard
				- Will need to shard or partition SQL tables
			- Means we're scaling on generic hardware.
	- The Problem with Sharding
		- Imagine that I'm a bank, and I have a table called Accounts
		- Let's transfer $1000 from Putin to Trump, who are on different partitions
		- (first will talk about the problems with sharding on writes)
			- Imagine we have a [[single leader replication]] set up for each [[shard]]. We'll be [[venmo]]
		- They are on different partitions and we're going to create this transaction. It will say Trump balance increased by $1000 and Putin balance decreased by $1000
		- In order to do so, we need to make sure that the operation either succeeds on both partitions, or fails on both partitions - requires a [[distributed transaction]]! We will go into this more in a subsequent video but for now just know that this means it's a slow operation. Cross partition writes are very slow.
			- What if it happened to be the case that only one of those network requests actually reached the proper partition? Trump say gains a thousand dollars but Putin never loses his. Then me as Venmo, we lose $1000 because I just messed up my transaction. We need to make sure the operation either succeeds on both partitions or fails on both (but this is over the network.) So we're no longer just using a single computer level transaction. What we're doing is something called a distributed transaction.
				- For distributed transactions, since they have to get both of these nodes to agree on doing something, it is going to use a lot of network resources and is going to be much slower than just a single computer transaction. As a result, writing to multiple partitions at once in a transactional way can be very slow
- ![[Screenshot 2024-09-24 at 4.38.10 AM.png]]
	- The Problems with Sharding Continued
		- Description
			- I am on facebook messenger, and I want to load the screen that shows me all of the chats that I am in. To do so, I would run a [[join operations|join operation]]
			- To fetch all chats for user Jordan with UserID=1, we need to aggregate results from many partitions, too many network calls!
		- Continuing on with the problems of sharding, now let's look at what happens when we want to do a read. Let's imagine I'm using [[facebook messenger]] and I want to see all of the chats that I'm in. So I'm Jordan and my user ID is 1. According to this [[many-to-many]] relationship table which I'll just call user chats, I see that as user 1, I'm a member of chats with ID 1, 3, 5, and 7.
			- So you can see those two partitions below where the chats are located.
			- So the first partition holds chat IDs from 1 to 4. and the second holds chat IDs from 5 to 8.
			- As you can see, I'm going to actually query both partitions to find all of the chats I'm in and then aggregate those results. The fact that I have to make multiple network calls is again problematic. Why? This is because one of them could fail and then I would have an incomplete query or just in the more general case, the fact that I have to do multiple of these queries means that things are going to take longer. Network requests are always bad and you want to minimize them when you can
	- The relational philosophy
		- Description
			- One copy of every piece of data (reduce duplication)
				- We want to normalize data (not de-normalize it) so if we make a change to one piece of data which a bunch of other pieces of data reference, that change is now going to be propagated
			- Each table has one preset schema
				- Allows us to encode data better and makes for simplifying things into one easy to use table
			- Fetch related data via joins
				- A [[join]] in a relational database is saying we have one thing (lets say a profile like a LinkedIn profile.) And all of my job listings are going to be in a job listing table. Each job listing has a user id which shows that it corresponds to my profile because those are my experiences. Amazon $\to$ Google. It's going to have user IDs of myself on there
				- Joining is basically saying taking all of those rows with a corresponding user ID and fetch them. That's how you would continue to work into that kind of idea of reducing data duplication
			- Hide [[concurrency bugs]] and partial failures via transactions
				- via abstractions (in this case transactions)
		- We can see how this could scale poorly
	- Issues with Relational Databases at Scale
		- Description
			- Splitting related data up over partitions/different tables becomes very problematic once network delay becomes involved
				- The need for checking each partition or using distributed transactions greatly slows things down
			- The locking needed by transactions in order to enforce isolation is too slow
			- B-Trees are very slow for writing compared to some in memory buffer
		- The second sharding gets involved, all of the data splitting becomes super problematic. We have to make a bunch of network calls both on read and on writes. On writes for distributed transactions and on reads in order to basically go ahead and aggregate results from a bunch of partitions
			- Additionally to have transactions on a single node requires something like two phase locking which can be very slow. Means reads and writes can block one another
			- The b-trees that all of these relational databases use because they've been around for so long and basically that's all that existed was b-trees are very slow for writing compared to some in-memory buffer like an LSTM tree
	- Moving Away from Relational Databases
		- Description
			- The term NoSQL has arisen as a general term for any database that is not both relational and using the SQL query language
			- In reality, NoSQL databases are more stripped down that relational databases, and give the developer more opportunities to choose one that fits the needs for their application, because sometimes it is better at huge scale to abandon some of the features of relational databases in exchange for greater performance
		- There is this term [[NoSQL]]. Generally means a non-relational database. In reality, NoSQL databases are not the opposite of SQL. Just taking a database as we know it and stripping down all these features and abstractions that are part of a SQL database which is basically a black box. Once you've stripped down these features, it allows up to increase performance while only taking the features that you want
- ![[Screenshot 2024-09-24 at 8.03.58 AM.png]]
	- NoSQL design patterns
		- Description
			- Most importantly, objects are generally self-contained documents
				- More locality on disk for both reads and writes (good for when accessing whole document)
					- Everything related in data is going to be stored next to one another
					- For example, if looking at LinkedIn profile, instead of storing job experiences in their own table, you'd just store them in a JSON document with profile in general. So it would contain a link to profile image, profile description, and generally everything is stored together. This is good because sequential reads on disk are more efficient and as a result everything is going to be sequential and easier to read from and write to
				- Easier to shard
					- Can just split up the documents. Doesn't matter which shard they're on. Everything the document is going to need is already with it. It's self-contained
				- Schemaless
					- Good for applications like machine learning or anytime you want to dump a ton of data into a database without worrying about formatting it or putting it in a way that it needs to fit into a given table.
					- Also great for maintainability. Means data can adapt over time. In the event that you want to make changes to your data without having to add things like optional fields.
				- Data duplication (needs to be handled in application code)
					- Main pitfall of all of this.
					- Let's say I'm using a NoSQL database, and I have a document for a bunch of books in a library. In an SQL database, or a relational database, you might do is that each author would have an object or row in a table. If an author writes multiple books, each book can reference the same author via an author ID.
					- In a NoSQL database, might need to repeat that author information multiple times. If author is still alive and decides to change their name, I would need to go to every single book written by that offer and change their name which could potentially take a lot application side code which is unfortunate. 
			- Graph databases (there are NoSQL databases that are graph databases)
				- Good for many relationships, everything can be related
					- Great for many-to-many relationships which those document databases are not very sufficient for. 
					- Document databases are generally good for when data is in self-contained documents and there is not too many relations between the data
						- However, graph databases represent things like social networks really well because it allows you to put [[metadata]] with each node and link between the nodes. These are also schemaless
				- Schemaless
	- Relational Databases Conclusion
		- Very intuitive data model that is easy to understand
			- Many people have experience with them
			- People know how to do [[one-to-many]] relationships and many-to-many relationships
		- However, tend to scale poorly when sharded (and want to do horizontal scaling)
			- On writes to many shards may need distributed transactions
			- On reads to many shards involves many network calls
			- Rejoins can take a long time across multiple partitions
		- Transaction abstraction and locking is slow
			- By nature most of these relational databases use transactions is bad because two-phase locking can be very slow.
		- B-Trees are slow for writes (since they go to disk)
			- Compared to LSTM trees which go to memory
		- Set schema
			- Makes database hard to maintain in long run in the event data is evolving 
		- Generally use single leader replication
			- More simple but as a result limits your write throughput
			- For write throughput increases, you'd want to use something like "NoSQL"
		- As a result, many developers have chosen to use "NoSQL" databases, which relax some of these requirements and diverge from the data patterns of SQL, in the hopes of improving performance for their application. We will examine some of said databases in subsequent videos. 
			- NoSQL may add complexity to code, you'd still need to look at the specific requirements of your application and decide what you need and don't need.
			- For example, if you're a bank and you want to make sure that account balances are staying consistent and synchronized, you probably do need transactions and a relational database is still the way to go.
				- But for things like messenger services and social media apps, the increased write throughput and lack of need for complete consistency by NoSQL is a really good thing. 
	- Relational Databases Conclusion
		- With all this said, this doesn't mean that SQL is infeasible. For many read-heavy applications with highly related data, relational databases are a good solution. Many companies (see [[VoltDB]], [[Google Spanner]]) have even tried to improve the scalability of the relational model, which some have dubbed [[NewSQL]].
			- Since everyone is so familiar with SQL, if you can get away with using a relational database, you probably should. It's pretty simple to reason about the data
			- Many companies like that SQL interface, but want to improve the underlying technology below it.
		- There is no one size fits all database, and it is only by knowing how each one of these popular databases work that we can determine which to use for a given application. 
	- This is all why relational databases have decreased in popularity a little bit, but overall they're still super common.
	- At the end of the day, we can just understand what a relational database is and also look at some possible other options like [[Cassandra]] or [[Couchbase]] or anything along those lines and see which is best for our application
		- If you're doing a systems design interview, being able to break down why you picked a given database is really huge and as a result the next few videos will be really important 