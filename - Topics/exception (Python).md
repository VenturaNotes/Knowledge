---
aliases:
  - exception
---
## Synthesis
- 
## Source[^1]
- A mechanism used for handling errors and exceptional situations that occur during the execution of a program
- When an error occurs that disrupts the normal flow of code, Python raises an exception to indicate that something unexpected or erroneous has happened
- Benefits
	- Allows you to gracefully handle errors
	- Prevents program from crashing
	- Provides meaningful feedback about what when wrong
### Key Points about Exceptions
- (1) Error Conditions
	- Exceptions are raised when errors or exceptional conditions occur during program execution
		- Division by zero
		- Invalid input
		- File not found
- (2) Exception Objects
	- When an exception is raised, Python creates an exception object that contains information about the error
		- Type of exception
		- Optional error message
- (3) Exception handling
	- Handle exceptions using [[try (python)|try]], [[except (Python)|except]], [[finally (Python)|finally]], and [[else (Python)|else]]
	- Allows you to
		- catch exceptions
		- perform specific actions based on type of exception
		- clean up resources
- (4) Hierarchy of Exceptions
	- Python has a hierarchy of built-in exception classes, with the base class [[BaseException (Python)|BaseException]] at the top. Specific types of exceptions, such as [[ValueError (Python)|ValueError]], [[TypeError (Python)|TypeError]], [[IOError (Python)|IOError]], etc., inherit from this base class
## References

[^1]: ChatGPT