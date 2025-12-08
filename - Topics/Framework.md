## Synthesis
- 
## Source [^1]
- An abstraction in which software providing generic functionality can be selectively changed by additional user-written code, thus providing application-specific software. It provides a foundation for software developers to build programs for a specific platform.
	- #comment Generic functionality within a software framework refers to the reusable, common features or services that are not specific to a particular application but are broadly applicable across many applications built on that framework.
		- These functionalities provide a foundational structure and behavior that developers can extend or customize to create application-specific software.
		- An example of generic functionality is the request routing mechanism in a web framework (e.g., Express.js, Ruby on Rails)
			- #question What is Express.js
			- #question What is Ruby on Rails? 
			- #question What does a web framework look like?
			- #question What is a request routing mechanism?
			- This mechanism provides a standardized way to map incoming HTTP requests (e.g., GET /users, POST /products) to specific code handlers within an application.
				- #question What types of HTTP requests are there?
					- #question What does GET / users do?
					- #question What does POST /products do?
				- #question What does a code handler look like? 
			- The framework provides the underlying infrastructure for parsing URLs, matching patterns, and dispatching requests, which is a generic need for almost any web application
				- #question What does this framework look like? 
					- #question How can I parse URLS?
					- #question How can I match patterns?
			-  Developers then implement their specific logic for handling `/users` or `/products` requests, building upon this generic routing functionality.
				- #question What is meant by `/users`?
				- #question What is meant by `/products`
	- #question What are some examples of frameworks?

## Source[^2]
- A template for the development of software applications or components. Frameworks provide an outline for the software's structure in the form of objects that not only themselves provide basic functionality but also integrate with each other. Developers build on this to implement their projects' specific functionality by deriving their own objects via inheritance. Frameworks thus consist of at least a comprehensive set of such objects; other facilities, such as programming languages and a runtime environment, may also be provided.
## References

[^1]: https://spdload.com/blog/software-development-glossary/
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]