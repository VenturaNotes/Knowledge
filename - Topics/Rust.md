## Synthesis
- 
## Source [^1]
- By default, once a variable is initialized, its value can't be changed[^2]
- Test
## Source[^3]
- Logic errors in algorithms not prevented by memory safety features
- Primary mechanism to ensure memory safety is ownership and borrowing rules. This make it so we don't need a garbage collector
- Rust is a statically-typed systems programming language
	- #comment The statically-typed aspect provides strong type safety as it's checked during compilation and being a systems language offers the performance and control needed for building foundational software
		- Statically-typed language
			- Type checking occurs so types of variables are known and checked at compile-time (before program runs). So type-relate errors are caught early
				- #question What is after compile-time? Is it run-time?
		- Systems language
			- Designed for writing low-level software which interacts closely with hardware and operating system
			- Examples
				- Operating systems, device drivers, embedded systems
			- Essential for system-level development
				- Fine-grained control over memory
				- Direct hardware access
				- High performance
				- #question What levels of development are there?
- Focuses on safety, [[concurrency]], and performance
	- #comment
		- Concurrency is when different parts of the program are running at the same time. The purpose of concurrency is that it allows for multiple threads to execute in parallel or appear to do so to make program potentially faster or more responsive
			- #question What is meant by "appear to do so?" Do the threads actually not execute in parallel?
			- #question How is concurrency different from multithreading? 
		- Rust specifically makes this process safe and efficient. Believed to have fearless concurrency
			- It has unique ownership and borrowing rules so the compiler can help prevent common problems like [[data races]] at compile time than runtime
				- #question What are the ownership and borrowing rules? What makes them unique? 
			- Tools
				- Rust provides built-in tools like
					- `std::thread` for creating threads
						- #question Is this C++ notation?
					- channels for safe communication between them
						- #question What does this look like?
					- `Mutex` and `Arc<T>` both safely share data
						- #question How do they safely share data. Give an example
- Initially developed by Mozilla Research. First stable release was in 2015
	- #question Which month or specific date? Was it platform-dependent?
- A primary goal is to provide memory safety without [[garbage collection]]. 
	- Instead, it tries to use a system of ownership and borrowing
		- #question How does it use ownership and borrowing?
	- #question How can you provide memory safety?
### Benefits
- Developers might choose Rust over C or C++ as it prevents common programming errors at compile-time
	- This is possible because Rust has a strong type system and ownership model which improves software reliability and safety
	- #question Does C++ have methods to prevent these kind of errors as well?
### Key Features
- Memory safety through ownership system (not garbage collection)
## References

[^1]: [[(Home Page) Programming Rust 2nd Edition by O'Reilly]]
[^2]: [[(Home Page) Programming Rust 2nd Edition by O'Reilly#2 2 Rust functions]]
[^3]: [[(Home Page) 500+ Rust Interview Questions by Applyre]]