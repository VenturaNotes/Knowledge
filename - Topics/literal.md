---
aliases:
  - literals
---
## Synthesis
- Fixed values that are directly represented in the code
## Source [^1]
### Definitions
- Literals are fixed values that are directly represented in the code
- Actual data values assigned to variables or used in expressions
- A literal is a fixed value that is written directly in code
	- 42
	- "Hello"
	- `[1, 2, 3]`
- A literal is a hard-coded value and [[immutable]] in the source code. 
	- The source code is what I, the programmer, write in my Python script
	- #question is this the same as a static variable or something different? 
### Chart

| Type                                | Definition                                                                                                | Example                                                   |
| :---------------------------------- | :-------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| [[string literal\|string literals]] | Text enclosed in quotes<br><br>Supports single quotes<br>Supports double quotes<br>Supports Triple quotes | 'Hello, World!'<br>"Python is fun!"<br>"""Multi-string""" |
| Boolean Literals                    | `True` and `False` values                                                                                 | True<br>False                                             |
| None Literal                        | Absence of value or null value                                                                            | None                                                      |
| List Literals                       | Collection of items enclosed in <br>square brackets                                                       | `[1, 2, 3, 4]`                                            |
| Tuple Literals                      | Collection of items enclosed<br>in parentheses                                                            | `(1, 2, 3, 4)`                                            |
| Dictionary Literals                 | Collection of key-value pairs<br>enclosed in curly braces                                                 | {"name": "Alice", "age": 30}                              |
| Set Literals                        | Unordered collections of<br>unique items enclosed in curly braces                                         | `{1, 2, 3, 4}`                                            |
| Complex Number Literals             | Numbers with a real and an<br>imaginary part                                                              | `3 + 4j`<br>                                              |
| Numeric Literals                    | Represents numbers<br><br>Integer Literals<br>Floating-point Literals<br>Complex number literals          | `42, -5`<br>`3.14, -0.001`<br>`3 + 4j, -5j`               |
## Source[^2]
- Best practice of using literals is to avoid hard-coding literals into your code
	- It's best to use descriptive variable names for literals

## Source[^3]
- A word or symbol in a program that stands for itself rather than as a name for something else, i.e. an object whose value is determined by its denotation. Numbers are literals; if other symbols are used as literals it is necessary to use some form of quoting mechanism to distinguish them from variables.
## References

[^1]: ChatGPT
[^2]: Gemini Pro
[^3]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]