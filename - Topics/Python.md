---
tags:
  - in-progress
---
## Synthesis
- Everything in python is an object. 
	- Numbers, strings, lists, functions, classes, modules
- One of the reasons that `python2` is not compatible with `python3` is because
	- `print` became a function, not a statement
		- In Python2: `print "Hello"`
		- In Python3: `print("Hello")`
- #question What are generics? 
- #question what does the === sign do in python? 

- `range(1, 3)` function has 1 inclusive and 3 exclusive
```python
for i in range(1 , 3):
	print(i)

# OUTPUT
# 1
# 2
```

- Allocating array
```python
C = [0] * 5  # [0, 0, 0, 0, 0]
```
### Concepts
- [[Namespace (Python)|namespace]]
- [[Object-Oriented Programming (Python)|Object-Oriented Programming]]
- [[Composition (Python)|composition]]
- [[inheritance (python)|inheritance]]
- [[coroutines]]
- [[def (python)|def]]
- [[python program]]
- [[python script]]
- [[python module]]
- [[file object (python)|file object]]
- [[Threading (python)|threading]]
- [[recursion (python)|recursion]]
- [[initialization (python)|initialization]]
### Description
- Python doesn't have a strict concept of [[constants]]
	- Conventionally, constants represented using uppercase names to indicate their values should not change
- Python is an object-oriented programming language
### Initialization
- Refers to the process of assigning an initial value to a variable or setting up an object with default values.
#### Initializing Variables
```python
x = 10          # Integer initialization
y = 3.14        # Float initialization
name = "Alice"  # String initialization
numbers = [1, 2, 3]  # List initialization
settings = {"theme": "dark", "language": "English"}  # Dictionary initialization
```
### Data Structures
- [[List (Python)|lists]]
- [[Tuple (Python)|tuples]]
- [[Set (Python)|sets]]
- [[frozenset() (Python)|frozenset()]]
- [[dictionary (Python)|dictionaries]]
- [[string (python)|string]]
## Source [^1]
- [[syntax (python)|syntax]]
- [[comments (python)|comments]]
- [[variables (python)|variables]]
- [[data types (python)|data types]]
- [[casting (python)]]
- [[string (python)|string]]
- [[bool (python)|booleans]]
- [[operators (python)|operators]]
- [[List (Python)|list]]
- [[Tuple (Python)|tuple]]
- [[Set (Python)|sets]]
- [[dictionary (Python)|dictionary]]
- [[conditionals (python)|conditional]]
- [[while loop (python)|while loop]]
- [[for loop (python)|for loop]]
- [[function (python)|function]]
- [[lambda (python)|lambda]]
- [[Class (Python)|classes]]
- [[inheritance (python)|inheritance]]
- [[Module (Python)|modules]]
## Source [^2]
- Initially designed by [[Guido van Rossum]] in 1991.
## Source [^3]
- It is a free, open-source programming language
## Source [^4]
- [[LEGB rule]]
## Source [^5]
- `import this` prints out the zen of python
## Source[^6]
- A scripting language incorporating features from C, Modula 3, and Icon.
## Source[^7]
- Python is a free, open source, multi-purpose programming language that is commonly used for rapid application development (RAD). Python is an extremely versatile programming language that can be used for small tasks, such as creating bots, or larger tasks, such as developing complex code for technical applications. Pythonʻs code can implement both machine learning and data mining, in addition to web page development. Pythonʻs code uses the English language and an easy-to-learn syntax, which makes it an appealing programming language for beginning programmers.
## Source[^8]
### Formatting
```python
X = "san-foundry"
print("%56s" % X)
```
- The formatting option `%56s` aligns the string to the right within a field of width 56. Since `san-foundry` is 11 characters long, it is preceded by 56-11 = 45 blank spaces.
## References
[^1]: https://www.w3schools.com/python/python_exercises.asp
[^2]: https://www.geeksforgeeks.org/history-of-python/
[^3]: https://support.datacamp.com/hc/en-us/articles/360038816113-Is-Python-free#:~:text=Yes.,for%20free%20at%20python.org
[^4]: https://www.nielit.gov.in/gorakhpur/sites/default/files/Gorakhpur/ALevel_1_Python_26May_SS.pdf
[^5]: https://peps.python.org/pep-0020/
[^6]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^7]: [[(Home Page) Glossary by Capterra]]
[^8]: [[(Home Page) Python MCQ by Sanfoundry]]