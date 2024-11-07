---
aliases:
  - Exception handling
---
## Synthesis
- 
## Source [^1]
- The `try`, `except`, `else`, and `finally` blocks in python are grouped under exception handling
- Mechanism in Python to handle errors and exceptions that occur during the execution of a program. Allows the program to continue running or terminate gracefully

Code
```python 
def divide_numbers(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Error: Division by zero is not allowed.")
    else:
        print("The division was successful:", result)
    finally:
        print("Execution of the try-except-else-finally block is complete.")

# Test the function with a non-zero divisor
divide_numbers(10, 2)
# Test the function with a zero divisor
divide_numbers(10, 0)
```

Output
```
The division was successful: 5.0
Execution of the try-except-else-finally block is complete.
Error: Division by zero is not allowed.
Execution of the try-except-else-finally block is complete.
```

- Parts
	- `try`: Might raise an exception. Block of code used to test for errors
	- `except`: Runs if exception raised in `try` block. You can specify the type of exception to catch specific errors such as a [[ZeroDivisionError (python)|ZeroDivisionError]]
	- `else`: Runs if no exceptions are raised in the `try` block. Optional.
		 - #question What are some "raised" exceptions?
	 - `finally`: Runs whether there was an exception or not. Typically used for cleanup actions such as closing a file or releasing resources
## References

[^1]: ChatGPT