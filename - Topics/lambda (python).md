---
aliases:
  - lambda
---
## Synthesis
### Is Lambda always considered a function?
- A `lambda` expression creates an anonymous (unnamed) function
	- These functions are syntactically restricted to a single expression and often used for short, simple operations that are needed temporarily.

#### Characteristics
- Anonymous: Not named
- Single Expression: Only contains a single expression which is evaluated and returned
	- #question What does it look like?
- Function object: A lambda expression creates a function object, just like a function defined with `def`
	- #question In python, is there a difference between lambda and lambda expression?

#### Syntax of Lambda
```python
lamda arguments: expression
```

#### Example
```python
# A lambda function to add two numbers
add = lambda x, y: x + y

# Using the lambda function
result = add(3, 5)
print(result)  # Output: 8

```
- Use Cases
	- Short-term Use
		- When a small function needed for a short duration. Can pass to higher-order functions such as [[map() (Python)|map()]], [[filter() (Python)|filter()]], and [[sorted() (Python)|sorted()]]
		- #question Why are `map`, `filter`, and `sorted` considered to be higher-order functions? What does this mean? 
	- Inline definition: When defining a function inline without the need for a full function definition
		- #question What is meant by a function inline?

#### More Examples
```python
# map()
numbers = [1, 2, 3, 4]
squares = map(lambda x: x**2, numbers)
print(list(squares))  # Output: [1, 4, 9, 16]

# filter()
numbers = [1, 2, 3, 4, 5, 6]
even_numbers = filter(lambda x: x % 2 == 0, numbers)
print(list(even_numbers))  # Output: [2, 4, 6]


# sorted() and a key function
names = ['Alice', 'Bob', 'Charlie']
sorted_names = sorted(names, key=lambda name: len(name))
print(sorted_names)  # Output: ['Bob', 'Alice', 'Charlie']

```
#question What is a key function?
#question How does the map function work?
#question How does the filter function work?
#question How does the sorted() function work? 

##### Limitations
- Readability
	- Can make code less readable if overused or contains complex expressions
- Debugging
	- Since lambda functions are anonymous, it can be harder to debug them compared to named functions
- Single expression
	- Lambda functions limited to a single expression. Can't contain multiple statements or complex logic
## Source [^1]
```python
# Create a lambda function that takes one paramater (a) and returns it
x = lambda a : a
print(x(3)) #Output: 3
```
#question I need some more definitions and examples of lambda. Don't fully understand it or why it's named that way.
#question Is lambda always considered a function? 
## References

[^1]: https://www.w3schools.com/python/exercise.asp?filename=exercise_lambda1