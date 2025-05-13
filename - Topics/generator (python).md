---
aliases:
  - generator
  - generators
---
## Synthesis
- 
## Source [^1]
- A use would be through generator expression
```python
squares_gen = (x**2 for x in range(5))
print(list(squares_gen)) #Output: [0, 1, 4, 9, 16]
```
- Steps for above
	- Do `x**2` on each item `x` in `range(5)`
	- The `squares_gen` is considered a generator object created by the generator expression
	- Could directly the generator expression into a list comprehension using brackets
		- `squares = [x**2 for x in range(5)]`

### Generator iterator or iterable
- A generator is both
	- Iterator because it implements `__next__()`
	- Iterable because it implements `__iter__()` and returns itself
	- #question can you give examples of both where the generator is being used here?

### Description
- A special type of [[iterator (python)|iterator]] that allows you to iterate over a sequence of values lazily
	- This means it generates values on the fly as you need them rather than storing the entire sequence in memory at once
	- Generators defined using generator functions or generator expressions

#### Generator Function
- [[generator function (python)|generator function]]
- Defined similarly to a function but uses `yield` to yield a value rather than return
	- #question How does [[yield (python)|yield]] work?
- When a generator function is called, it returns a generator object without executing the function
	- #question What does this mean? 
- When [[next() (Python)|next()]] is called on the generator object, the function executes until it reaches the `yield` statement, yielding the value. The state of function is saved, and execution resumes from where it left off the next time `next()` is called
	- #question How does [[next() (Python)|next()]] work? 

##### Example
```python
def simple_generator():
    yield 1
    yield 2
    yield 3

gen = simple_generator()
print(next(gen))  # Output: 1
print(next(gen))  # Output: 2
print(next(gen))  # Output: 3
# Calling next again will raise StopIteration exception
```
#question I want a useful generator function example. The one above does not seem to be that useful
#question What are the most popular exceptions in python? One of them seems to be [[StopIteration (python)|StopIteration]]

#### Generator Expressions
- [[Generator expression (python)|generator expressions]] are similar to [[List comprehension (Python)|list comprehension]] but it creates a generator instead of a list. Syntax similar but uses `()` instead of `[]`

##### Format
```python
(expression for item in iterable if condition)
```
- Could be read as: Do the `expression` for the `item` in the `iterable` if the `condition` is satisfied
##### Example 1
```python
squares = (x * x for x in range(10) if x % 2 == 0)

# Can loop through each item as shown below
for square in squares:
    print(square)  # Output: 0, 4, 16, 36, 64

#Alternative method (exhausted)
print(next(squares))
print(next(squares))
print(next(squares))
print(next(squares))
print(next(squares))
```
###### Breakdown
- Parts
	- expression: `x*x`
		- Calculation applied to each item `x` that meets the condition. For each even number, the generator will yield the square of `x`
	- item: `x`
		- Represents each element taken from the iterable
	- iterable: `range(10)`
		- This generates numbers from 0 to 9. This is the sequence of numbers which will be processed by the generator expression
		- #question What is an [[iterable (python)|iterable]]?
	- condition: `x % 2 == 0`
		- Filter that applies to each item `x` in iterable
- General Explanation
	- An element is first retrieved from the `iterable` range(10). This will become the `item` (x) taken from the iterable. Then the `condition` is checked against x. If satisfied, the `expression` is evaluated and yielded by the generator. Otherwise, the items are skipped until a condition is satisfied or a [[StopIteration (python)|StopIteration]] occurs
		- Order: Iterable, item, condition, expression
##### Example 2
```python
gen_expr = (x * x for x in range(10))

print(next(gen_expr))  # Output: 0
print(next(gen_expr))  # Output: 1
print(next(gen_expr))  # Output: 4
# This will break on the 11th `next(gen_expr)`
```

##### Differences between Generators and Lists
- Generators are more memory efficient because they do not store all values in memory
- Generators only produce items one at a time when required which reduces computation and memory usage
- Generators can only be iterated over once. 

#### Generator Applications
##### Reading Large File
```python
def read_file(file_path):
    with open(file_path, 'r') as file:
        for line in file:
            yield line

file_gen = read_file('large_file.txt')
for line in file_gen:
    print(line)
```
- This opens a file and reads it line by line. It returns each line through "yield"
- It is then stored in `file_gen` and printed out to console
##### Generating Infinite sequence 
```python
def infinite_sequence():
    num = 0
    while True:
        yield num
        num += 1

gen = infinite_sequence()
print(next(gen)) #output: 0
print(next(gen)) #output: 1
```
- This is an infinite sequence that prints out the value of `num`
- During the first time the `infinite_sequence()` runs, it exists the loop at `yield num` which would return the value `0`. When the second time `next(gen)` is ran, `num += 1` is computed and then since `while True` continues, `yield num` is ran again to `yield num` where `num = 1` now and the output is `1`

### Lazy Evaluation Benefits
- Memory Efficient
	- Since values generated one at a time and not stored in memory all at once, generators much more memory efficient, especially for large datasets
- Performance
	- Can lead to performance improvements by not doing unnecessary computations upfront. Values only generated when needed.
- Infinite Sequences:
	- Can represent infinite sequences as they compute each value on demand. Could generate an infinite sequence of [[Fibonacci numbers]] or an endless stream of data
## Source[^2]
### Difference between Generator Functions and Generator Expressions

| Generator Expressions                                                      | Generator Functions                                                                                                                            |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| More concise and easier to read                                            | More flexible and powerful                                                                                                                     |
| Defined using parantheses                                                  | Defined using `def` keyword                                                                                                                    |
| Can only be used to create generator object                                | Can be used to a create a generator object or a regular function #question how can we use generator functions to create generator expressions? |
| More efficient as they don't require creation of <br>a new function object | More flexible as they can be used to create generators that have states                                                                        |
| Only stores state of variables used in expression                          |                                                                                                                                                |

#### Examples[^1]
Generator Function
```python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

#Calling the generator function does not execute it
gen = countdown(5)

# Using the generator function
for number in countdown(5):
    print(number)

```
- Defined similar to a normal function but uses the `yield` keyword to return values one at a time, pausing the function's state between each yield and resuming it when the next value is requested
- Defined using the `def` keyword
- Maintains state between each `yield`
- Called like a regular function but returns a generator object
- Evaluated lazily

Generator Expression
```python
# Generator expression for creating a countdown
countdown_gen = (n for n in range(5, 0, -1))

# Using the generator expression
for number in countdown_gen:
    print(number)
```
- Compact way to create a generator
- Resembles list comprehensions but uses square brackets instead of parenthesis
- Evaluates lazily

##### Similarities
- They both use [[Lazy Evaluation]]
## References

[^1]: ChatGPT
[^2]: Gemini Pro