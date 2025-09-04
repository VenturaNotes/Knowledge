---
Source:
  - zotero://open-pdf/library/items/8MRQ3H5S?page=2&annotation=8F62Z9BZ
Length: "269"
tags:
  - type/textbook
  - status/incomplete
Reviewed: false
---

- “System design interview questions are the most difficult to tackle among all the technical interviews” ([pdf](zotero://open-pdf/library/items/8MRQ3H5S?page=4&annotation=67WST6LI))
	- #question What other kinds of technical interviews are there?
- “[[high-level architecture]]” ([pdf](zotero://open-pdf/library/items/8MRQ3H5S?page=4&annotation=KPFQDASR))
- “system requirements, constraints and bottlenecks should be well understood to shape the direction of both the interviewer and interviewee.” ([pdf](zotero://open-pdf/library/items/8MRQ3H5S?page=4&annotation=6SYLB8MC))
- “solid knowledge in building a scalable system.” ([pdf](zotero://open-pdf/library/items/8MRQ3H5S?page=4&annotation=878CXH8Y))
## (1) Scale From Zero To Millions Of Users
- Will build a system supporting a single user up to millions of users
### (1.1) Single Server Setup
- “everything is running on a single server.” ([pdf](zotero://open-pdf/library/items/8MRQ3H5S?page=6&annotation=XKSMY6NA))
	- Includes web app, database, [[cache]], etc.
		- #question What is cache?
![[Screenshot 2024-06-26 at 1.32.53 PM.png]]
- Parts
	- User 
		- Directs `www.mysite.com` and `api.mysite.com` to Web server. However, it only sends `api.mysite.com` to the DNS
			- #question Is this just specific to the mobile app or web browser?
			- #question What is the difference between `www.mysite.com` and `api.mysite.com`?
		- Components
			- [[Web browser]]
			- [[Mobile app]]
	- [[Web Server]]
		- #question What is the hardware like for a web server? 
		- #question How much might a web server cost?
	- [[DNS]]
		- #question I would like to see some examples of this in action
	- Investigate
		- #question What is [[request flow]]
		- #question What is [[traffic source]]
- [[Request flow]] Steps
	- ![[Screenshot 2024-06-30 at 1.57.04 PM.png]]
	- (1) Users access websites through domain names such as api.mysite.com. Usually, The [[DNS|Domain Name System]] is a paid service provided by 3rd parties and not hosted by our servers
		- #question Would it be possible for a DNS to be hosted by our servers?
	- (2) [[IP addresses|Internet protocol address]] returned to browser or mobile app. An Example is 15.125.23.214
		- #question What do each of the numbers mean?
	- (3) When IP address obtained, Hypertext Transfer Protocol (HTTP) \[1] requests are sent directly to web server
		- #question What does the \[1] mean?
		- #question is the web server what people actually access? 
			- #question If so, why do people need to access the DNS first before the Web Server. Why can't we just access the web server directly?
	- (4) Web server returns HTML pages or JSON response for rendering
		- #question is there a difference between HTML pages and JSON response? Like would JSON not return a page or is it just lines of code? Is JSON a markup language similar to HTML? Is HTML a markup language?
- [[Traffic source]]
	- Traffic to web server comes from two sources
		- web application
			- Uses a combination of [[server-side languages]] (Java, Python, etc.) to handle [[business logic]], storage, etc., and [[client-side languages]] (HTML and JavaScript) for presentation
				- #question what is business logic? 
		- mobile application
			- HTTP protocol is the communication protocol between the mobile app and the web server
			- “JavaScript Object Notation ([[JSON]]) is commonly used [[Application Programming Interface|API]] response format to transfer data due to its simplicity.” ([pdf](zotero://open-pdf/library/items/8MRQ3H5S?page=7&annotation=KPNX3ATQ))
				- #question What exactly is API?
- API response in JSON format below
- `GET/users/12 - Retrieve user object for id = 12`
```JSON
{
	"id": 12,
	"firstName": "John",
	"lastName": "Smith",
	"address":{
		"streetAddress": "21 2nd Street",
		"city": "New York",
		"state": "NY",
		"postalCode": 10021
	},
	"phoneNumbers":[
		"212 555-1234",
		"646 555-4567"
	]
}
```
- #question I don't really understand the point of `GET/users/12` above. Is this something in SQL? Like how would it work? Is it a command? 
### (1.2) Database
- By growing user base
	- #question is user base a specific term?
- Get multiple servers
	- One for web/mobile traffic ([[web tier]])
	- One for database [[data tier]]
	- Separating these servers allows them to be scaled independently
![[Screenshot 2024-07-03 at 5.25.15 PM.png]]
- Difference from previous Images
	- The web server reads/writes/updates to database and the data is then returned from the database to the web server
		- [[Web server]]
		- [[Database]]
### (1.3) Which databases to use?
- [[relational database]]
	- More traditional
	- Also called relational database management system (RDBMS) or SQL database
	- Popular ones:
		- [[MySQL]]
		- [[Oracle database]]
		- [[PostgreSQL]]
	- “represent and store data in tables and rows” ([pdf](zotero://open-pdf/library/items/8MRQ3H5S?page=8&annotation=JB375STF))
	- “can perform [[join operations]] using SQL across different database tables.” ([pdf](zotero://open-pdf/library/items/8MRQ3H5S?page=8&annotation=DGQCF2U2))
	- Considered best option (been around for 40 years)
		- Worked well historically
- [[Non-relational database]] ^888b0e
	- also called NoSQL database
	- Popular ones:
		- [[CouchDB]]
		- [[Neo4j]]
		- [[Cassandra]]
		- [[HBase]]
		- [[Amazon DynamoDB]]
	- These databases grouped into four categories
		- key-value stores
		- graph stores
		- column stores
		- document stores
	- Join operations generally not supported
	- Right choice if
		- Application requires super-low latency
		- Data are unstructured or no relational data
		- Just need to [[serialize]] or deserialize data ([[JSON]], [[XML]], [[YAML]], etc.)
			- #question how can you serialize data?
		- Storing massive amounts of data
### (1.4) Vertical scaling vs horizontal scaling 
- [[Vertical scaling]] referred to as ("scale up") “means the process of adding more power ([[Central Processing Unit|CPU]], [[RAM]], etc.) to your servers.” ([pdf](zotero://open-pdf/library/items/8MRQ3H5S?page=9&annotation=4VGSJCRG))
	- Advantages
		- Great option when traffic low
		- Simplicity 
	- Simplicity is main advantage
	- Limitations
- [[Horizontal Scaling]] referred to as ("scale-out") “allows you to scale by adding more servers into your pool of resources.” ([pdf](zotero://open-pdf/library/items/8MRQ3H5S?page=9&annotation=DMPQRFEE))

### (1.5) Load balancer
### (1.6) Database replication
### (1.7) Cache
### (1.8) Cache tier
### (1.9) Considerations for using cache
### (1.10) Content delivery network (CDN)
### (1.11) Considerations of using a CDN
### (1.12) Stateless web tier
### (1.13) Stateful architecture
### (1.14) Stateless architecture
### (1.15) Data centers
### (1.16) Message queue
### (1.17) Logging, metrics, automation
### (1.18) Adding message queues and different tools
### (1.19) Database scaling
### (1.20) Vertical Scaling
### (1.21) Horizontal Scaling
### (1.22) Millions of users and beyond

## (2) Back-Of-The-Envelope Estimation
### (2.1) Power of two
### (2.2) Latency numbers every programmer should know
### (2.3) Availability numbers
### (2.4) Example: Estimate Twitter QPS and storage requirements
### (2.5) Tips
## (3) A Framework for system design interviews
### (3.1) A 4-step process for effective system design interview
### (3.2) Step 1 - Understand the problem and establish design scope
### (3.3) Step 2 - Propose high-level design and get buy-in
### (3.4) Step 3 - Design deep dive
### (3.5) Step 4 - Wrap up
### (3.6) Time allocation on each step
## (4) Design a rate limiter
### (4.1) Step 1 - Understand the problem and establish design scope
### (4.2) Step 2- Propose high-level design and get buy-in
#### (4.2.1) Where to put the rate limiter?
#### (4.2.2) Algorithms for rate limiting
##### (4.2.2.1) Token bucket algorithm
##### (4.2.2.2) Leaking bucket algorithm
##### (4.2.2.3) Fixed window counter algorithm
##### (4.2.2.4) Sliding window log algorithm
##### (4.2.2.5) Sliding window counter algorithm
#### (4.2.3) High-level architecture
### (4.3) Step 3 - Design deep dive
#### (4.3.1) Rate limiting rules
#### (4.3.2) Exceeding the rate limit
#### (4.3.3) Rate limiter headers
#### (4.3.4) Detailed Design
#### (4.3.5) Rate limiter in a distributed environment
#### (4.3.6) Race condition
#### (4.3.7) Synchronization issue
#### (4.3.8) Performance optimization
#### (4.3.9) Monitoring
### (4.4) Step 4 - Wrap up
## (5) Design consistent hashing
### (5.1) The rehashing problem
### (5.2) Consistent hashing
### (5.3) Hash space and hash ring
### (5.4) Hash servers
### (5.5) Hash keys
### (5.6) Server lookup
### (5.7) Add a server
### (5.8) Remove a Server
### (5.9) Two issues in the basic approach
### (5.10) Virtual nodes
### (5.11) Find affected keys
### (5.12) Wrap up
## (6) Design a key-value store
### (6.1) Understand the problem and establish design scope
### (6.2) Single server key-value store
### (6.3) Distributed key-value store
### (6.4) CAP theorem
### (6.5) Ideal situation
### (6.6) Real-world distributed systems
### (6.7) System components
### (6.8) Data partition
### (6.9) Data replication
### (6.10) Consistency
### (6.11) Consistency models
### (6.12) Inconsistency resolution: versioning
### (6.13) Handling failures
### (6.14) Failure detection
### (6.15) Handling temporary failures
### (6.16) Handling permanent failures
### (6.17) Handling data center outage
### (6.18) System architecture diagram
### (6.19) Write path
### (6.20) Read path
### (6.21) Summary
## (7) Design a unique ID generator in distributed systems
### (7.1) Step 1 - Understand the problem and establish design scope
### (7.2) Propose high-level design and get buy-in
#### (7.2.1) Multi-master replication
#### (7.2.2) UUID
#### (7.2.3) Ticket Server
#### (7.2.4) Twitter snowflake approach
### (7.3) Step 3 - Design deep dive
#### (7.3.1) Timestamp
#### (7.3.2) Sequence number
### (7.4) - Wrap up
## (8) Design a URL shortener
### (8.1) Step 1 - Understand the problem and establish design scope
#### (8.1.1) Back of envelope estimation
### (8.2) Step 2 - Propose high-level design and get buy-in
#### (8.2.1) API Endpoints
#### (8.2.2) URL redirecting
#### (8.2.3) URL shortening
### (8.3) Step 3 - Design deep dive
#### (8.3.1) Data model
#### (8.3.2) Hash function
#### (8.3.3) Hash value length
#### (8.3.4) Hash + collision resolution
#### (8.3.5) Base 62 conversion
#### (8.3.6) Comparison of the two approaches
#### (8.3.7) URL shortening deep dive
#### (8.3.8) URL redirecting deep dive
### (8.4) Step 4 - Wrap up
## (9) Design a web crawler
### (9.1) Step 1 - Understand the problem and establish design scope
#### (9.1.1) Back of the envelope estimation
### (9.2) Step 2 - Propose high-level design and get buy-in
#### (9.2.1) Seed URLs
#### (9.2.2) URL Frontier
#### (9.2.3) HTML Downloader
#### (9.2.4) DNS Resolver
#### (9.2.5) Content Parser
#### (9.2.6) Content Seen?
#### (9.2.7) Content Storage
#### (9.2.8) URL Extractor
#### (9.2.9) URL Filter
#### (9.2.10) URL Seen?
#### (9.2.11) URL Storage
#### (9.2.12) Web crawler workflow
### (9.3) Step 3 - Design deep dive
#### (9.3.1) DFS vs BFS
#### (9.3.2) URL Frontier
#### (9.3.3) Politeness
#### (9.3.4) Priority
#### (9.3.5) Freshness
#### (9.3.6) Storage for URL Frontier
#### (9.3.7) HTML Downloader
#### (9.3.8) Robots.txt
#### (9.3.9) Performance optimization
#### (9.3.10) 1. Distributed crawl
#### (9.3.11) 2. Cache DNS Resolver
#### (9.3.12) 3. Locality
#### (9.3.13) 4. Short timeout
#### (9.3.14) Robustness
#### (9.3.15) Extensibility
#### (9.3.16) Detect and avoid problematic content
#### (9.3.17) 1. Redundant content
#### (9.3.18) 2. Spider traps
#### (9.3.19) Data noise
### (9.4) Step 4 - Wrap up
## (10) Design a notification system
### (10.1) Step 1 - Understand the problem and establish design scope
### (10.2) Step 2 - Propose high-level design and get buy-in
#### (10.2.1) Different types of notifications
#### (10.2.2) iOS push notification
#### (10.2.3) Android push notification
#### (10.2.4) SMS message
#### (10.2.5) Email
#### (10.2.6) Contact info gathering flow
#### (10.2.7) Notification sending/receiving flow
#### (10.2.8) High-level design
#### (10.2.9) High-level design (improved)
### (10.3) Step 3 - design deep dive
#### (10.3.1) Reliability
#### (10.3.2) How to prevent data loss?
#### (10.3.3) Will recipients receive a notification exactly once?
#### (10.3.4) Additional components and considerations
#### (10.3.5) Notification template
#### (10.3.6) Notification setting
#### (10.3.7) Rate limiting
#### (10.3.8) Retry mechanism
#### (10.3.9) Security in push notifications
#### (10.3.10) Monitor queued notifications
#### (10.3.11) Events tracking
#### (10.3.12) Updated design
### (10.4) Step 4 - Wrap up
## (11) Design a news feed system
### (11.1) Step 1 - Understand the problem and establish design scope
### (11.2) Step 2 - Propose high-level design and get buy-in
#### (11.2.1) Newsfeed APIs
#### (11.2.2) Feed publishing API
#### (11.2.3) Newsfeed retrieval API
#### (11.2.4) Feed publishing
#### (11.2.5) Newsfeed building
### (11.3) Step 3 - Design deep dive
#### (11.3.1) Feed publishing deep dive
#### (11.3.2) Web servers
#### (11.3.3) Fanout service
#### (11.3.4) Fanout on write
#### (11.3.5) Fanout on read
#### (11.3.6) Newsfeed retrieval deep dive
#### (11.3.7) Cache architecture
### (11.4) Step 4 - Wrap up
## (12) Design a chat system
### (12.1) Step 1 - Understand the problem and establish a design scope
### (12.2) Step 2 - Propose high-level design and get buy-in
#### (12.2.1) Polling
#### (12.2.2) Long polling
#### (12.2.3) WebSocket
#### (12.2.4) High-level design
#### (12.2.5) Stateless services
#### (12.2.6) Stateful Service
#### (12.2.7) Third-party integration
#### (12.2.8) Scalability
#### (12.2.9) Storage
#### (12.2.10) Data models
#### (12.2.11) Message table for 1 on 1 chat
#### (12.2.12) Message table for group chat
### (12.3) Step 3 - Design deep dive
#### (12.3.1) Service discovery
#### (12.3.2) Message flows
#### (12.3.3) 1 on 1 chat flow
#### (12.3.4) Message synchronization across multiple devices
#### (12.3.5) Small group chat flow
#### (12.3.6) Online presence
#### (12.3.7) User login
#### (12.3.8) User logout
#### (12.3.9) User disconnection
#### (12.3.10) Online status fanout
### (12.4) Step 4 - Wrap up
## (13) Design a search autocomplete system
### (13.1) Step 1 - Understand the problem and establish design scope
#### (13.1.1) Requirements
#### (13.1.2) Back of the envelope estimation
### (13.2) Step 2 - Propose high-level design and get buy-in
#### (13.2.1) Data gathering service
#### (13.2.2) Query service
### (13.3) Step 3 - Design deep dive
#### (13.3.1) Trie data structure
#### (13.3.2) Limit the max length of a prefix
#### (13.3.3) Cache top search queries at each node
#### (13.3.4) Data gathering service
#### (13.3.5) Aggregated data
#### (13.3.6) Query service
#### (13.3.7) Trie Operations
#### (13.3.8) Create
#### (13.3.9) Update
#### (13.3.10) Delete
#### (13.3.11) Scale the storage
### (13.4) Step 4 - Wrap up
## (14) Design YouTube
### (14.1) Step 1 - Understand the problem and establish design scope
#### (14.1.1) Back of the envelope estimation
### (14.2) Step 2 - Propose high-level design and get buy-in
#### (14.2.1) Video uploading flow
#### (14.2.2) Flow a: upload the actual video
#### (14.2.3) Flow b: update the metadata
#### (14.2.4) Video streaming flow
### (14.3) Step 3 - Design deep dive
#### (14.3.1) Video transcoding
#### (14.3.2) Directed acyclic graph (DAG) model
#### (14.3.3) Video transcoding architecture
#### (14.3.4) Preprocessor
#### (14.3.5) DAG scheduler
#### (14.3.6) Resource manager
#### (14.3.7) Task workers
#### (14.3.8) Temporary storage
#### (14.3.9) Encoded video
#### (14.3.10) System optimizations
#### (14.3.11) Speed optimization: parallelize video uploading
#### (14.3.12) Speed optimization: place upload centers close to users
#### (14.3.13) Speed optimization: parallelism everywhere
#### (14.3.14) Speed optimization: pre-signed upload URL
#### (14.3.15) Safety optimization: protect your videos
#### (14.3.16) Cost-saving optimization
#### (14.3.17) Error handling
### (14.4) Step 4 - Wrap Up
## (15) Design Google Drive
### (15.1) Step 1 - Understand the problem and establish design scope
#### (15.1.1) Back of the envelope estimation
### (15.2) Step 2 - Propose high-level design and get buy-in
#### (15.2.1) APIs
#### (15.2.2) 1. Upload a file to Google Drive
#### (15.2.3) 2. Download a file from Google Drive
#### (15.2.4) 3. Get file revisions
#### (15.2.5) Move away from single server
#### (15.2.6) Sync conflicts
#### (15.2.7) High-level design
### (15.3) Step 3 - Design deep dive
#### (15.3.1) Block servers
#### (15.3.2) High consistency requirement
#### (15.3.3) Metadata database
#### (15.3.4) Upload flow
#### (15.3.5) Download flow
#### (15.3.6) Notification service
#### (15.3.7) Save storage space
#### (15.3.8) Failure handling

### (15.4) Step 4 - Wrap Up

## (16) The Learning Continues
### (16.1) Real-world systems


## Review
### Terms
```dataviewjs
// Get the current file content
let fileContent = await dv.io.load(dv.current().file.path);

// Extract links using a regular expression
let links = fileContent.match(/\[\[([^\]]+)\]\]/g);

// Initialize a Set to store unique filtered links
let filteredLinks = new Set();

if (links) {
    // Filter out links with the #studied tag
    for (let link of links) {
        let linkName = link.slice(2, -2); // Remove the [[ and ]] from the link
        let page = dv.page(linkName);
        if (page && (!page.tags || !page.tags.includes("studied"))) {
            filteredLinks.add(link);
        }
    }
}

// Display the count of filtered links
dv.header(5, `Link Count: ${filteredLinks.size}`);

// Display the links or show "No Links Found"
if (filteredLinks.size > 0) {
    dv.list(Array.from(filteredLinks));
} else {
    dv.paragraph("- NO LINKS FOUND");
}
```

