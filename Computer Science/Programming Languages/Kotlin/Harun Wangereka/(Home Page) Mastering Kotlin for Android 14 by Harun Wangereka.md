---
Source:
  - zotero://open-pdf/library/items/IVDMLGC3?page=2&annotation=EUEAE46B
Length: "370"
tags:
  - status/incomplete
  - type/textbook
Reviewed: false
---
## Contributors
- Will learn how to build powerful Android apps from scratch using Jetpack libraries and [[Jetpack Compose]]
### Author
- [[Harun Wangereka]]
	- Thanks wife, mother, family, friends colleagues
	- Thanks [[Android254]] and [[Kotlin Kenya]] communities
	- Seems like Packt also worked hard on this book
	- Description
		- Android engineer
		- Google Developer Expert for Android
	- Currently working at [[Apollo Agriculture]]
		- “make financing accessible to small-scale farmers.” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=5&annotation=NH3N6HVQ))
			- #question what is meant by financing?
		- “Agent's App and Agro-Dealers App.” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=5&annotation=CP4M8BDN))

### About the Reviewers
- [[Dmitrii Ivashchenko]]
	- Expert software engineer with over a decade of experience in mobile development and backend systems
		- #question what exactly is a backend system?
	- “became the lead of a mobile game development team at a major international company” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=6&annotation=88IVQYU7))
	- “active member of the [[International Game Developers Association]] and the [[Academy of Interactive Arts & Sciences]], Dmitrii has authored articles for [[Medium]] and [[HackerNoon]]” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=6&annotation=BB6ZBVXS))
- [[Peter Gichia]]
	- software engineer focused on native Android development
	- Currently working as a freelance Android engineer and entrepreneur on the side
	- Enjoys solving problems for clients through “code or business strategy.” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=6&annotation=7US38ER5))
		- #question what kind of solutions can you find through business strategy?
	- “published a text-based course on building scalable applications with MVVM architecture and is working on publishing another one about clean architecture in collaboration with a leading Edutech company.” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=6&annotation=6H6RXRQ7))
	- Enjoys expanding knowledge through podcasts and books

## Preface
- “[[Kotlin]] is a programming language created by [[JetBrains]] that runs on the [[Java Virtual Machine]] (JVM).” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=14&annotation=P4XWXP97))
	- “designed to address issues such as verbosity, [[null pointer exception|null pointer exceptions]], [[concurrency]] challenges, and the lack of functional support found in Java.” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=14&annotation=CERSMF6B))
		- #question what is functional support in this case?
	- “compatible with existing Java code and libraries” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=14&annotation=Q89L6R23))
	- “[[Google]] recognized Kotlin as a primary language for building Android apps” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=14&annotation=GPSC8EQW))
- “book adopts an industry-focused approach, preparing you for the role of an Android developer in any company.” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=14&annotation=FV4GSHQ2))
	- “best practices recommended by Google's Android team” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=14&annotation=PWT4T9WP))
- Topics
	- [[Material Design 3]]
	- “structuring apps in the [[MVVM]] architecture.” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=14&annotation=L7EYKKS3))
		- #question is MVVM architecture a thing?
- Features
	- [[dependency injection]]
	- Jetpack libraries including
		- [[Room]] for local data persistence
			- #question what is local data persistence?
- “identifying code issues using tools such as [[Ktlint]] and [[Detekt]]” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=14&annotation=FQ58UG8Q))
- “guides you through the publication process on [[Google Play Store]]” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=14&annotation=QW4HHHN8))
- “Automation of consecutive releases through [[GitHub Actions]] and the distribution of test builds using Firebase App Distribution are also explored.” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=14&annotation=XF4Y8QQ4))
	- #question what is firebase app distribution?
- “crash reporting tools, tips for boosting user engagement, and insights on securing your app.” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=14&annotation=TANEZMLM))
- #question What are pertinent topics?
	- Guides us to prepare for role as [[Android developer]]

## Part 1: Building Your App
### (1) Getting Started with Kotlin Android Development
- Covers how to migrate from Java to Kotlin
#### (1.1) Technical requirements
#### (1.2) Introduction to Kotlin
#### (1.3) Kotlin syntax, types, functions and classes
##### (1.3.1) Creating a Kotlin Project
##### (1.3.2) Creating functions
##### (1.3.3) Creating classes
#### (1.4) Migrating from Java to Kotlin
#### (1.5) Kotlin features for Android developers
#### (1.6) Summary
### (2) Creating Your First Android App
- Familiarizes you with [[Android Studio]] which is an [[integrated development environments|integrated development environment]] which we will use to develop Android apps
#### (2.1) Technical requirements
#### (2.2) Android Studio overview
#### (2.3) Creating your Android app
##### (2.3.1) Exploring the new project
#### (2.4) Android Studio tips and tricks
##### (2.4.1) Some useful shortcuts
#### (2.5) Summary
### (3) Jetpack Compose Layout Basics
- [[Jetpack compose]] is a declarative way of creating user interfaces for apps
#### (3.1) Technical requirements
#### (3.2) Introduction to Jetpack Compose
##### (3.2.1) Declarative versus imperative UIs
##### (3.2.2) Composable functions
##### (3.2.3) Previews
##### (3.2.4) Modifiers
#### (3.3) Jetpack Compose layouts
##### (3.3.1) Column
##### (3.3.2) Row
##### (3.3.3) Box
##### (3.3.4) Lists
#### (3.4) Summary
### (4) Design with Material Design 3
- Shows [[Material Design 3|Material 3]]
#### (4.1) Technical requirements
#### (4.2) Material Design 3 and its features
##### (4.2.1) Material components
#### (4.3) Using Material design in our apps
##### (4.3.1) Adding Material Design 3 color schemes
#### (4.4) Designing UIs for large screens and foldables
#### (4.5) Using WindowSizeClass
#### (4.6) Making our app accessible
#### (4.7) Summary
## Part 2: Using Advanced Features
### (5) Architect Your App
- Dives into [[MVVM architecture]]
- Advanced architecture features
	- [[dependency injection]]
	- [[Kotlin Gradle DSL]]
	- version catalog to define dependencies
		- #question what is a version catalog in android studio?
#### (5.1) Technical Requirements
#### (5.2) Introduction to app architecture
#### (5.3) Deep Diving into MVVM
##### (5.3.1) How LazyColumn works
##### (5.3.2) Benefits of LazyColumn
##### (5.3.3) Creating a composable
#### (5.4) Jetpack libraries
#### (5.5) Dependency injection
#### (5.6) Migrating to Kotlin Gradle DSL and using version catalogs
##### (5.6.1) Migrating our app to Kotlin Gradle DSL
##### (5.6.2) Using a versions catalog
#### (5.7) Summary

### (6) Network Calls with Kotlin Coroutines
- Shows how to perform network calls with a networking library, [[Retrofit]]
	- Shows how to consume [[Application Programming Interface|Application Programming Interfaces]] using this library
		- #question what is meant by "consume"? Seems like a weird word
- Covers how to take advantage of Kotlin coroutines to perform [[asynchronous network requests]]
	- #question I think Kotlin has its own type of coroutines? 
#### (6.1) Technical requirements
#### (6.2) Setting up Retrofit
#### (6.3) Introduction to Kotlin coroutines
##### (6.3.1) Coroutine basics
#### (6.4) Using Kotlin coroutines for network calls
#### (6.5) Summary
### (7) Navigating within Your App
- Using Jetpack Compose Navigation library to navigate to different Jetpack Compose screens
- “how to pass arguments as we navigate to screens” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=15&annotation=FE2KVCYE))
- “how to handle navigation on large screens and foldables.” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=15&annotation=GW62PNVG))
	- #question what are foldables?
#### (7.1) Technical requirements
#### (7.2) Jetpack Navigation overview
#### (7.3) Navigating to Compose destinations
#### (7.4) Passing arguments to destinations
#### (7.5) Navigation in foldables and large screens
##### (7.5.1) Creating and using the resizable emulator
#### (7.6) Summary
### (8) Persisting Data Locally and Doing Background Work
- “save data to a local database, [[Room]], which is part of the Jetpack libraries.” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=15&annotation=DU6D8X7K))
- “long-running operations using [[WorkManager]] and some of the best practices.” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=15&annotation=T3XE42U8))
	- #question what is considered a long-running operation?
#### (8.1) Technical requirements
#### (8.2) Saving and reading data from a local database
#### (8.3) Handling updates and migrations in the Room database
#### (8.4) Using WorkManager to schedule background tasks
#### (8.5) Testing your workers
#### (8.6) Summary
### (9) Runtime Permissions
- “how to request runtime permissions” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=15&annotation=3WQAQG7W))
#### (9.1) Technical requirements
#### (9.2) Understanding runtime permissions
#### (9.3) Requesting permissions at runtime
#### (9.4) Summary
## Part 3: Code Analysis and Tests
### (10) Debugging Your App
- Discusses debugging tips and tricks
- [[LeakCanary]]
	- detect leaks
- [[Chucker]]
	- Inspect network requests/responses fired by apps
- [[App Inspection]]
	- inspect Room database, network requests and background tasks using above
#### (10.1) Technical requirements
#### (10.2) General debugging tips and tricks
##### (10.2.1) Logcat
##### (10.2.2) Stack traces
##### (10.2.3) Breakpoints
#### (10.3) Detecting memory leaks with LeakCanary
#### (10.4) Inspecting network requests with Chucker
#### (10.5) Using App Inspection
#### (10.6) Summary
### (11) Enhancing Code Quality
- “how to use plugins such as Ktlint and Detekt to format, lint, and detect [[code smells]] early.” ([pdf](zotero://open-pdf/library/items/IVDMLGC3?page=15&annotation=ANQ7IGQX))
	- #question what are code smells?
#### (11.1) Technical requirements
#### (11.2) Mastering Kotlin style and best practices
##### (11.2.1) Coding conventions
##### (11.2.2) Null safety
##### (11.2.3) Data classes
##### (11.2.4) Extensions functions
##### (11.2.5) Type inference
##### (11.2.6) Collections
##### (11.2.7) Sealed classes and interfaces
##### (11.2.8) Formatting
##### (11.2.9) Functional programming
##### (11.2.10) Coroutines
##### (11.2.11) The When statements
##### (11.2.12) Classes and functions
#### (11.3) Using Ktlint for static analysis
#### (11.4) Detecting code smells with detekt
##### (11.4.1) setting up detekt
##### (11.4.2) Customizing detekt
#### (11.5) Summary
### (12) Testing Your App
#### (12.1) Technical requirements
#### (12.2) Importance of testing
#### (12.3) Testing the network and database layers
##### (12.3.1) Testing the network layer
##### (12.3.2) Testing the database layer
#### (12.4) Testing our ViewModels
#### (12.5) Adding UI tests to our composables
#### (12.6) Summary
## Part 4: Publishing Your App
### (13) Publishing Your App
#### (13.1) Technical requirements
#### (13.2) Preparing our app for release
##### (13.2.1) Add analytics to your app
##### (13.2.2) Add crash reporting to your app
##### (13.2.3) Turn off logging and debugging
##### (13.2.4) Internationalize and localize your app
##### (13.2.5) Improve error messages
##### (13.2.6) Test your app on different devices
##### (13.2.7) Provide proper feedback channels
##### (13.2.8) Reduce the size of your app
##### (13.2.9) Use the Android App Bundle
##### (13.2.10) Enable minification and obfuscation
#### (13.3) Releasing our app to the Google Play Store
##### (13.3.1) Creating our first release
#### (13.4) An overview of Google Play Store policies
#### (13.5) Summary
### (14) Continuous Integration and Continuous Deployment
#### (14.1) Technical requirements
#### (14.2) Setting up GitHub Actions
##### (14.2.1) Benefits of CI/CD
##### (14.2.2) How CI/CD works
##### (14.2.3) Setting up GitHub Actions
#### (14.3) Running lint checks and tests on GitHub Actions
#### (14.4) Deploying to Play Store using GitHub Actions
#### (14.5) Summary
### (15) Improving Your App
#### (15.1) Technical requirements
#### (15.2) Using Firebase Crashlytics to detect crashes
##### (15.2.1) Setting up Google Analytics
#### (15.3) Improving app engagement with Firebase Messaging
#### (15.4) Securing your app
#### (15.5) Summary
### (16) Index
### (17) Other Books You May Enjoy

