## Synthesis
### Description in Python
- Specifically refers to calling a class to create an instance of that class

| Construct                       | Example                        | What happens                                          |
| ------------------------------- | ------------------------------ | ----------------------------------------------------- |
| Built-in clasess                | `x = list()`                   | Instantiates a list object                            |
| User-defined clasess            | `x = MyClass()`                | Instantiates your custom object                       |
| Functions returning new objects | `x = datetime.now()`           | Not a class call, but you still get a new object      |
| Factory Functions               | `x = dict.fromkeys(["a","b"])` | Creates a new dict (factory function instantiates it) |
| callables via \__call__         | `x = my_callable()`            | Whatever the callable returns becomes the instance    |
- #question What are factory functions
- #question What are callables and what is `__call__`?
- #question If a function returned an integer, is this an object and would that be considered instantiation as well?
#### Class Example
```python

```
- #question What would this look like?
## Source [^1]
- In the computer programming industry, the term instantiation is used to describe the creation (naming and placement) of an object instance in an object-oriented programming (OOP) language such as Java, Python, or C++. Objects are computer files that contain an encoded sequence of instructions that computers execute when a computer user clicks on the fileʻs icon.
## References

[^1]: [[(Home Page) Glossary by Capterra]]