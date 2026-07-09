---
tags:
  - in-progress
---
## Synthesis
### Example
```python
def recursive_function(parameters):
    # 1. Base Case: The condition under which the function stops calling itself.
    # This prevents infinite loops (RecursionError in Python).
    if check_for_base_case_condition:
        return base_case_value

    # 2. Recursive Step: Call the function again with modified parameters
    # that bring you closer to the base case.
    result = recursive_function(modified_parameters)

    # 3. Process and Return: Combine the current state with the result 
    # of the recursive call.
    return process_result(result)
```

## Source [^1]
- A method of solving problems where the solution to a problem depends on solutions to smaller instances of the same problem. In programming, a recursive function calls itself.
## Source[^2]
- The process of defining or expressing a function, procedure, language construct, or the solution to a problem in terms of itself, so producing a recursive function, a recursive subroutine, etc. See also PRIMITIVE RECURSION.
## References

[^1]: https://spdload.com/blog/software-development-glossary/
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]