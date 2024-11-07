---
Source:
  - zotero://open-pdf/library/items/ZBLAQ5P3?page=2&annotation=6FG7URNR
Length: "475"
tags:
  - status/incomplete
  - type/textbook
Year: 2024-04-29
---
## Contributors
### Author
- [[Alexey Soshin]]
	- [[Software architect]] who has worked in industry for over 18 years
	- Author of Pragmatic system design video course

### Reviewers
- [[Lee Turner]]
	- [[Software engineer]] with 20 years experience
		- Large scale software implementations
	- Software engineer at WireMock
	- “experience using Kotlin as a backend developer building microservices in the financial and developer tooling sectors.” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=5&annotation=REBVWT8J))
		- #question what kind of sector is this? 
	- Founder of Brighton Kotlin meetup group
	- Tends to have never-ending side projects
	- [Website](https://leeturner.me/about/)
- [[Matthias Schenk]]
	- Passionate software engineer (more than 10 years experience)
		- developing in Java and Kotlin
		- Mainly in Spring ecosystem
			- #question what is spring
	- Writes “writing idiomatic and clean code” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=5&annotation=63AYX5VT))
		- #question what does idiomatic mean?
	- Now writes a blog 
	- Bought original kotlin book
- Discord is available
## Preface
- Can elevate kotlin skills with classical and modern design patterns, [[coroutines]], and [[microservices]]
	- #question is design patterns a thing?
- “[[design patterns]] empower developers to write superior, more efficient, and maintainable code by diminishing the time spent devising solutions for common problems from the ground up.” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=20&annotation=9DCCCRVW))
- “[[Kotlin]] is a versatile programming language that embraces multiple programming paradigms and was crafted by [[JetBrains]]” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=20&annotation=ACRDQKZD))
	- “renowned for creating widely-used integrated development environments, including [[IntelliJ IDEA]].” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=20&annotation=6SM8MJEQ))
- “This updated edition focuses on the advancements in Kotlin up to Kotlin 2.0.” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=20&annotation=2KJ5MZGG))
	- #question what is the current edition of Kotlin?
- Kotlin features discussed
	- [[context receivers]]
	- Libraries including [[Arrow]]

## Section 1: Classical Patterns
### (1) Chapter 1: Getting Started with Kotlin
- Introduces basic syntax of Kotlin
- “clear understanding of the fundamental concepts and idioms.” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=21&annotation=LVEG7KDX))
#### (1.1) Technical requirements
#### (1.2) Basic language syntax and features
##### (1.2.1) Multi-paradigm language
#### (1.3) Understanding Kotlin code structure
##### (1.3.1) Naming conventions
##### (1.3.2) Packages 
##### (1.3.3) Comments
##### (1.3.4) Hello Kotlin
##### (1.3.5) No wrapping class
##### (1.3.6) No arguments
##### (1.3.7) No static modifier
##### (1.3.8) A less verbose print function
##### (1.3.9) No semicolons
#### (1.4) Understanding types
##### (1.4.1) Basic types
##### (1.4.2) Type inference
##### (1.4.3) Values
##### (1.4.4) Comparison and equality
##### (1.4.5) Declaring functions
##### (1.4.6) Null safety
#### (1.5) Reviewing Kotlin data structures
##### (1.5.1) Lists
##### (1.5.2) Sets
##### (1.5.3) Maps
##### (1.5.4) Mutability
##### (1.5.5) Alternative implementations for collections
##### (1.5.6) Arrays
#### (1.6) Control Flow
##### (1.6.1) The if expression
##### (1.6.2) The when expression
#### (1.7) Working with text
##### (1.7.1) String interpolation
#### (1.8) Loops
##### (1.8.1) The for-each loop
##### (1.8.2) The for loop
##### (1.8.3) The while loop
#### (1.9) Classes and inheritance
##### (1.9.1) Classes
##### (1.9.2)Properties
##### (1.9.3)Custom setters and getters
##### (1.9.4)Interfaces
##### (1.9.5)Abstract classes
##### (1.9.6)Visibility modifiers
#### (1.10) Inheritance
##### (1.10.1) Data classes
##### (1.10.2) Kotlin data classes versus Java records
#### (1.11) Extension functions
#### (1.12) Introduction to design patterns
##### (1.12.1) What are design patterns
##### (1.12.2) Design patterns in real life
##### (1.12.3) Design process
##### (1.12.4) Using design patterns in Kotlin
#### (1.13) Bringing it all together
##### (1.13.1) Exercise
###### (1.13.1.1) Example
###### (1.13.1.2) Challenge
#### (1.14) Summary
#### (1.15) Questions
### (2) Chapter 2: Working with Creational Patterns
- “classical creational patterns that are already embedded in the Kotlin language” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=21&annotation=FNTLB883))
	- #question what are creational patterns?
- “patterns focus on how and when to create objects.” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=21&annotation=DRBUNB9P))
	- Covers various patterns such as [[Singleton]] and [[Builder]]
#### (2.1) Technical requirements
#### (2.2) Singleton
#### (2.3) Factory Method
##### (2.3.1) Static Factory Method
#### (2.4) Abstract Factory
##### (2.4.1) Casts
##### (2.4.2) Subclassing
##### (2.4.3) Smart casts
##### (2.4.4) Variable shadowing
##### (2.4.5) Collection of Factory Methods
#### (2.5) Builder
##### (2.5.1) Fluent setters
##### (2.5.2) Default arguments
#### (2.6) Prototype
##### (2.6.1) Starting from a prototype
#### (2.7) Summary
#### (2.8) Questions
### (3) Chapter 3: Understanding Structural Patterns
- “classical structural design patterns that can be used to extend the functionality of objects” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=21&annotation=PHN5HGJV))
- Patterns include
	- [[Decorator]] and [[Adapter]] patterns
#### (3.1) Technical requirements
#### (3.2) Decorator
##### (3.2.1) Enhancing a class
###### (3.2.1.1) The Elvis operator
##### (3.2.2) The inheritance problem
##### (3.2.3) Operator overloading
##### (3.2.4) Caveats of the Decorator design pattern
#### (3.3) Adapter
##### (3.3.1) Adapting existing code
##### (3.3.2) Adapters in the real world
##### (3.3.3) Caveats of using adapters
#### (3.4) Bridge
##### (3.4.1) Bridging changes
##### (3.4.2) Typing aliasing
##### (3.4.3) Constants
#### (3.5) Composite
##### (3.5.1) Secondary constructors
##### (3.5.2) The varargs keyword
##### (3.5.3) Nesting composites
#### (3.6) Facade
#### (3.7) Flyweight
##### (3.7.1) Saving memory
##### (3.7.2) Caveats of the Flyweight design pattern
#### (3.8) Proxy
##### (3.8.1) Lazy delegation
#### (3.9) Summary
#### (3.10) Questions
### (4) Chapter 4: Getting Familiar with Behavioral Patterns
- “deal with how objects interact with each other.” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=21&annotation=3YDDMZDL))
	- Objects can communicate without direct knowledge of one another
	- Will learn how to iterate over complex structures easily
#### (4.1) Technical requirements
#### (4.2) Strategy
##### (4.2.1) Functions as first-class citizens
#### (4.3) Iterator
#### (4.4) State
##### (4.4.1) Fifty shades of state
##### (4.4.2) State of the nation
#### (4.5) Command
##### (4.5.1) Undoing commands
#### (4.6) Chain of Responsibility
#### (4.7) Interpreter
##### (4.7.1) A language of your own
##### (4.7.2) Call suffix
##### (4.7.3) DSL Marker
#### (4.8) Mediator
##### (4.8.1) The middleman
##### (4.8.2) Mediator caveats
#### (4.9) Memento
#### (4.10) Visitor
##### (4.10.1) Writing a crawler
#### (4.11) Template Method
#### (4.12) Observer
##### (4.12.1) Animal choir example
#### (4.13) Summary
#### (4.14) Questions
## Section 2: Reactive and Concurrent Patterns
### (5) Chapter 5: Introducing Functional Programming
- “fundamental principles of [[functional programming]] and their connection to Kotlin.” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=21&annotation=MZHLD82T))
- “data immutability and treating functions as first-class values.” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=21&annotation=HJ3NYH9E))
	- #question what is data immutability
	- #question what is meant by first-class values?
- “essential role in crafting code that is more concise, modular, and maintainable.” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=21&annotation=K8QCG3H9))
	- #question What is meant by modular?
#### (5.1) Technical requirements
#### (5.2) Reasoning behind the functional approach
#### (5.3) Immutability
##### (5.3.1) Immutable collections
##### (5.3.2) The pitfalls of a shared mutable state
##### (5.3.3) Tuples
#### (5.4) Functions as values
##### (5.4.1) Higher-order functions in the standard library
##### (5.4.2) The "it" notation
##### (5.4.3) Closures
##### (5.4.4) Pure functions
##### (5.4.5) Currying
##### (5.4.6) Memoization
#### (5.5) Using expressions instead of statements
##### (5.5.1) Pattern matching
#### (5.6) Recursion
#### (5.7) Summary
#### (5.8) Questions
### (6) Chapter 6: Threads and Coroutines
- “efficiently managing a multitude of requests in our application.” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=21&annotation=WICV8B38))
- “[[Thread|threads]] are traditionally the go-to for [[concurrency]] in contemporary applications; however, [[Kotlin]] offers coroutines as a superior, more efficient option.” ([pdf](zotero://open-pdf/library/items/ZBLAQ5P3?page=21&annotation=GUMI4ZPW))
#### (6.1) Technical requirements
#### (6.2) Looking deeper into threads
##### (6.2.1) Thread safety
##### (6.2.2) Thread synchronization mechanisms in Kotlin
##### (6.2.3) Why are threads expensive?
#### (6.3) Introducing coroutines
##### (6.3.1) Starting coroutines
#### (6.4) Jobs
#### (6.5) Coroutines under the hood
#### (6.6) Dispatchers
##### (6.6.1) Switching dispatchers
#### (6.7) Structured concurrency
##### (6.7.1) The coroutineScope builder
##### (6.7.2) Canceling a coroutine
##### (6.7.3) Setting timeouts
#### (6.8) Summary
#### (6.9) Questions
### (7) Chapter 7: Controlling the Data Flow
#### (7.1) Technical requirements
#### (7.2) Reactive principles
##### (7.2.1) The responsive principle
##### (7.2.2) The resilient principle
##### (7.2.3) The elastic principle
##### (7.2.4) The message-driven principle
#### (7.3) Higher-order functions on collections
##### (7.3.1) Mapping elements
##### (7.3.2) Filtering elements
##### (7.3.3) Finding elements
##### (7.3.4) Executing code for each element
##### (7.3.5) Summing up elements
##### (7.3.6) Getting rid of nesting
#### (7.4) Exploring concurrent data structures
#### (7.5) Sequences
#### (7.6) Channels
##### (7.6.1) Producers
##### (7.6.2) Actors
##### (7.6.3) Buffered channels
#### (7.7) Flows
##### (7.7.1) Buffering flows
##### (7.7.2) Flow exceptions and error handling
###### (7.7.2.1) Catching exceptions
###### (7.7.2.2) Handling completion
###### (7.7.2.3) Retrying
###### (7.7.2.4) Optional retrying
##### (7.7.3) Flow sharing
###### (7.7.3.1) shareIn
###### (7.7.3.2) stateIn
##### (7.7.4) Cancellation
##### (7.7.5) Flow builders
##### (7.7.6) Conflating flows
##### (7.7.8) Rate-limiting
##### (7.7.9) Combining flows
#### (7.8) Summary
#### (7.9) Questions
### (8) Chapter 8: Designing for Concurrency
#### (8.1) Technical requirements
#### (8.2) Deferred value
#### (8.3) Barrier
#### (8.4) Scheduler
#### (8.5) Pipeline
#### (8.6) Fan-out
#### (8.7) Fan-in
#### (8.8) Racing
##### (8.8.1) Unbiased Select
#### (8.9) Mutex
##### (8.9.1) Deadlocks
#### (8.10) Sidekick
#### (8.11) Summary
#### (8.12) Questions
## Section 3: Practical Application of Design Patterns
### (9) Chapter 9: Idioms and AntiPatterns
#### (9.1) Technical requirements
#### (9.2) Scope functions
##### (9.2.1) let function
##### (9.2.2) apply function
##### (9.2.3) also function
##### (9.2.4) run function
##### (9.2.5) with function
#### (9.3) Type checks and casts
#### (9.4) An alternative to the try-with-resources statement
#### (9.5) Inline functions
#### (9.6) Algebraic data types
#### (9.7) Recursive functions
#### (9.8) Reified generics
#### (9.9) Using constants efficiently
#### (9.10) Constructor overload
#### (9.11) Dealing with nulls
#### (9.12) Making asynchronicity explicit
#### (9.13) Validating input
#### (9.14) Sealed hierarchies versus enums
#### (9.15) Context receivers
#### (9.16) Summary
#### (9.17) Questions
### (10) Chapter 10: Practical Functional Programming with Arrow
#### (10.1) Technical requirements
#### (10.2) Getting started with Arrow
#### (10.3) Typed errors
##### (10.3.1) Raise
##### (10.3.2) Collecting failures
##### (10.3.3) Smart constructors
##### (10.3.4) Alternatives to Either and Raise
###### (10.3.4.1) Result
###### (10.3.4.2) Optional
###### (10.3.4.3) Ior
##### (10.3.5) Advantages of typed errors
#### (10.4) High-level concurrency
##### (10.4.1) Parallel operations
##### (10.4.2) CyclicBarrier
##### (10.4.3) Racing
##### (10.4.4) Resource
#### (10.5) Software transactional memory
#### (10.6) Resilience
##### (10.6.1) Retry and repeat
#### (10.7) Circuit Breaker
#### (10.8) Saga
#### (10.9) Immutable data
#### (10.10) Summary
#### (10.11) Questions
### (11) Chapter 11: Concurrent Microservices with Ktor
#### (11.1) Technical requirements
#### (11.2) Getting started with Ktor
#### (11.3) Routing requests
##### (11.3.1) Testing the service
##### (11.3.2) Connecting to other HTTP services
#### (11.4) Connecting to a database
#### (11.5) Configuration management in Ktor
##### (11.5.1) Defining tables with Exposed
##### (11.5.2) Creating new entities
##### (11.5.3) Making the tests consistent
##### (11.5.4) Fetching all entities
##### (11.5.5) Fetching a single entity
#### (11.6) Organizing routes in Ktor
##### (11.6.1) Deleting an entity
##### (11.6.2) Updating an entity
#### (11.7) Achieving concurrency in Ktor
#### (11.8) Summary
#### (11.9) Questions
### (12) Chapter 12: Reactive Microservices with Vert.x
#### (12.1) Technical requirements
#### (12.2) Getting started with Vert.x
#### (12.3) Routing requests
#### (12.4) Verticles
#### (12.5) Handling requests
##### (12.5.1) Subrouting the requests
#### (12.6) Testing Vert.x applications
#### (12.7) Working with databases
#### (12.8) Understanding Event Loop
#### (12.9) Communicating with Event Bus
##### (12.9.1) Sending JSON over Event Bus
#### (12.10) Summary
#### (12.11) Questions
### (13) Assessments
### (14) Other Book You May Enjoy
### (15) Index



