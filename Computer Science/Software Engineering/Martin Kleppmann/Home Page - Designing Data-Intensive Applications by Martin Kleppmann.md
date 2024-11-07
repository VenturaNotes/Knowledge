---
Source:
  - zotero://open-pdf/library/items/3TRY8FAV?page=1&annotation=2U852PR7
Length: "613"
tags:
  - type/textbook
  - status/incomplete
---
## Preface
- The big ideas behind reliable, scalable, and maintainable systems
- [[Data]] is at the center of many challenges in [[system design]] today
	- Difficult issues need to be figured out such as [[scalability]], [[consistency]], [[reliability]], [[efficiency]], and [[maintainability]]
- We have many tools
	- [[relational database|relational databases]]
	- [[NoSQL datastores]]
	- [[stream processors]]
	- [[batch processors]]
	- [[message brokers]]
- Will learn how to navigate the trade-offs around
	- [[consistency]]
	- [[scalability]]
	- [[fault tolerance]]
	- [[complexity]]
- Will learn to understand the [[distributed systems]] research upon which modern databases are built
- [[Martin Kleppmann]]
	- Researcher in distributed systems at the [[University of Cambridge]], UK. Previously a software engineer and entrepreneur at [[LinkedIn]] and [[Rapportive]]
	- He's an open source contributor, conference speaker, and blogger
- Published by O'Reilly Media, Inc.,
### Reviews
- [[Jay Kreps]]
	- Creator of [[Apache Kafka]] and CEO of [[Confluent]]
- Kevin Scott
	- [[Chief Technology Officer]] at [[Microsoft]]
## Part I. Foundations of Data Systems
### (1) Reliable, Scalable, and Maintainable Applications
#### (1.1) Thinking About Data Systems
#### (1.2) Reliability
##### (1.2.1) Hardware Faults
##### (1.2.2) Software Errors
##### (1.2.3) Human Errors
##### (1.2.4) How Important is Reliability?
#### (1.3) Scalability
##### (1.3.1) Describing Load
##### (1.3.2) Describing Performance
##### (1.3.3) Approaches for Coping with Load
#### (1.4) Maintainability
##### (1.4.1) Operability: Making Life Easy for Operations
##### (1.4.2) Simplicity: Managing Complexity
##### (1.4.3) Evolvability: Making Change Easy
#### (1.5) Summary
### (2) Data Models and Query Languages
#### (2.1) Relational Model Versus Document Model
##### (2.1.1) The Birth of NoSQL
##### (2.1.2) The Object-Relational Mismatch
##### (2.1.3) Many-to-One and Many-to-Many Relationships
##### (2.1.4) Are Document Databases Repeating History?
##### (2.1.5) Relational Versus Document Databases Today
#### (2.2) Query Languages for Data
##### (2.2.1) Declarative Queries on the Web
##### (2.2.2) MapReduce Querying
#### (2.3) Graph-Like Data Models
##### (2.3.1) Property Graphs
##### (2.3.2) The Cypher Query Language
##### (2.3.3) Graph Queries in SQL
##### (2.3.4) Triple-Stores and SPARQL
##### (2.3.5) The Foundation: Datalog
#### (2.4) Summary
### (3) Storage and Retrieval
#### (3.1) Data Structures That Power Your Database
##### (3.1.1) Hash Indexes
##### (3.1.2) SSTables and LSM-Trees
##### (3.1.3) B-Trees
##### (3.1.4) Comparing B-Trees and LSM-Trees
##### (3.1.5) Other Indexing Structures
#### (3.2) Transaction Processing or Analytics?
##### (3.2.1) Data Warehousing
##### (3.2.2) Stars and Snowflakes: Schemas for Analytics
#### (3.3) Column-Oriented Storage
##### (3.3.1) Column Compression
##### (3.3.2) Sort Order in Column Storage
##### (3.3.3) Writing to Column-Oriented Storage
##### (3.3.4) Aggregation: Data Cubes and Materialized Views
#### (3.4) Summary
### (4) Encoding and Evolution
#### (4.1) Formats for Encoding Data
##### (4.1.1) Language-Specific Formats
##### (4.1.2) JSON, XML, and Binary Variants
##### (4.1.3) Thrift and Protocol Buffers
##### (4.1.4) Avro
##### (4.1.5) The Merits of Schemas
#### (4.2) Modes of Dataflow
##### (4.2.1) Dataflow Through Databases
##### (4.2.2) Dataflow Through Services: REST and RPC
##### (4.2.3) Message-Passing Dataflow
#### (4.3) Summary
## Part II. Distributed Data
### (5) Replication
#### (5.1) Leaders and Followers
##### (5.1.1) Synchronous Versus Asynchronous Replication
##### (5.1.2) Setting Up New Followers
##### (5.1.3) Handling Node Outages
##### (5.1.4) Implementation of Replication Logs
#### (5.2) Problems with Replication Lag
##### (5.2.1) Reading Your Own Writes
##### (5.2.2) Monotonic Reads
##### (5.2.3) Consistent Prefix Reads
##### (5.2.4) Solutions for Replication Lag
#### (5.3) Multi-Leader Replication
##### (5.3.1) Use Cases for Multi-Leader Replication
##### (5.3.2) Handling Write Conflicts
##### (5.3.3) Multi-Leader Replication Topologies
#### (5.4) Leaderless Replication
##### (5.4.1) Writing to the Database When a Node Is Down
##### (5.4.2) Limitations of Quorum Consistency
##### (5.4.3) Sloppy Quorums and Hinted Handoff
##### (5.4.4) Detecting Concurrent Writes
#### (5.5) Summary
### (6) Partitioning
#### (6.1) Partitioning and Replication
#### (6.2) Partitioning of Key-Value Data
##### (6.2.1) Partitioning by Key Range
##### (6.2.2) Partitioning by Hash of Key
##### (6.2.3) Skewed Workloads and Relieving Hot Spots
#### (6.3) Partitioning and Secondary Indexes
##### (6.3.1) Partitioning Secondary Indexes by Document
##### (6.3.2) Partitioning Secondary Indexes by Term
#### (6.4) Rebalancing Partitions
##### (6.4.1) Strategies for Rebalancing
##### (6.4.2) Operations: Automatic or Manual Rebalancing
#### (6.5) Request Routing
##### (6.5.1) Parallel Query Execution
#### (6.6) Summary
### (7) Transactions
#### (7.1) The Slippery Concept of a Transaction
##### (7.1.1) The Meaning of ACID
##### (7.1.2) Single-Object and Multi-Object Operations
#### (7.2) Weak Isolation Levels
##### (7.2.1) Read Committed
##### (7.2.2) Snapshot Isolation and Repeatable Read
##### (7.2.3) Preventing Lost Updates
##### (7.2.4) Write Skew and Phantoms
#### (7.3) Serializability
##### (7.3.1) Actual Serial Execution
##### (7.3.2) Two-Phase Locking (2PL)
##### (7.3.3) Serializable Snapshot Isolation (SSI)
#### (7.4) Summary
### (8) The Trouble with Distributed Systems
#### (8.1) Faults and Partial Failures
##### (8.1.1) Cloud Computing and Supercomputing
#### (8.2) Unreliable Networks
##### (8.2.1) Network Faults in Practice
##### (8.2.2) Detecting Faults
##### (8.2.3) Timeouts and Unbounded Delays
##### (8.2.4) Synchronous Versus Asynchronous Networks
#### (8.3) Unreliable Clocks
##### (8.3.1) Monotonic Versus Time-of-Day Clocks
##### (8.3.2) Clocks Synchronization and Accuracy
##### (8.3.3) Relying on Synchronized Clocks
##### (8.3.4) Process Pauses
#### (8.4) Knowledge, Truth, and Lies
##### (8.4.1) The Truth Is Defined by the Majority
##### (8.4.2) Byzantine Faults
##### (8.4.3) System Model and Reality
#### (8.5) Summary
### (9) Consistency and Consensus
#### (9.1) Consistency Guarantees
#### (9.2) Linearizability
##### (9.2.1) What Makes a System Linearizable?
##### (9.2.2) Relying on Linearizability
##### (9.2.3) Implementing Linearizable Systems
##### (9.2.4) The Cost of Linearizability
#### (9.3) Ordering Guarantees
##### (9.3.1) Ordering and Causality
##### (9.3.2) Sequence Number Ordering
##### (9.3.3) Total Order Broadcast
#### (9.4) Distributed Transactions and Consensus
##### (9.4.1) Atomic Commit and Two-Phase Commit (2PC)
##### (9.4.2) Distributed Transactions in Practice
##### (9.4.3) Fault-Tolerant Consensus
##### (9.4.4) Membership and Coordination Services
#### (9.5) Summary
## Part III. Derived Data
### (10) Batch Processing
#### (10.1) Batch Processing with Unix Tools
##### (10.1.1) Simple Log Analysis
##### (10.1.2) The Unix Philosophy
#### (10.2) MapReduce and Distributed Filesystems
##### (10.2.1) MapReduce Job Execution
##### (10.2.2) Reduce-Side Joins and Grouping
##### (10.2.3) Map-Side Joins
##### (10.2.4) The Output of Batch Workflows
##### (10.2.5) Comparing Hadoop to Distributed Databases
#### (10.3) Beyond MapReduce
##### (10.3.1) Materialization of Intermediate State
##### (10.3.2) Graphs and Iterative Processing
##### (10.3.3) High-Level APIs and Languages
#### (10.4) Summary
### (11) Stream Processing
#### (11.1) Transmitting Event Streams
##### (11.1.1) Messaging Systems
##### (11.1.2) Partitioned Logs
#### (11.2) Databases and Streams
##### (11.2.1) Keeping Systems in Sync
##### (11.2.2) Change Data Capture
##### (11.2.3) Event Sourcing
##### (11.2.4) State, Streams, and Immutability
#### (11.3) Processing Streams
##### (11.3.1) Use of Stream Processing
##### (11.3.2) Reasoning About Time
##### (11.3.3) Stream Joins
##### (11.3.4) Fault Tolerance
#### (11.4) Summary
### (12) The Future of Data Systems
#### (12.1) Data Integration
##### (12.1.1) Combining Specialized Tools by Deriving Data
##### (12.1.2) Batch and Stream Processing
#### (12.2) Unbundling Databases
##### (12.2.1) Composing Data Storage Technologies
##### (12.2.2) Designing Applications Around Dataflow
##### (12.2.3) Observing Derived State
#### (12.3) Aiming for Correctness
##### (12.3.1) The End-to-End Argument for Databases
##### (12.3.2) Enforcing Constraints
##### (12.3.3) Timeliness and Integrity
##### (12.3.4) Trust, but Verify
#### (12.4) Doing the Right Thing
##### (12.4.1) Predictive Analytics
##### (12.4.2) Privacy and Tracking
#### (12.5) Summary
