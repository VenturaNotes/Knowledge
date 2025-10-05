---
aliases:
  - iterable
  - iterables
---
## Synthesis
### Definition
- An iterable is anything you can loop over
### Examples
- Lists, tuples, sets, dictionaries, and strings
### Non-Examples
- The `int` object such as 1, 2, 3, etc. is not an iterable.
	- Therefore, you can't iterate a list doing `for i in len(list_name)` because it would just be an `int` object
### Description 2
- A set is iterable
## Source [^1]
- Iterables are objects that can be iterated in iterations.
- An iterable is anything that you can loop over
- An iterable is an object which can be looped over or iterated over with the help of a for loop
- The following objects are iterables
	- lists
	- tuples
	- sets
	- dictionaries
	- strings
- Another definition is that an iterable is a container that has data or values, and we perform an iteration over it to get elements one by one. (Can traverse through all the given values one by one)
- An iterable has an in-built [[dunder method]] [[__iter__() (python)|__iter__()]]
- An object is called an iterable if you can get an [[iterator (python)|iterator]] out of it.
- To check if an object is iterable, you can see if it by using the function [[dir() (Python)|dir()]]
### #comment Showing an object is iterable
Code
```python
print(dir("hello world"))
```
Output
```
['__add__', '__class__', '__contains__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__getnewargs__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__iter__', '__le__', '__len__', '__lt__', '__mod__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__rmod__', '__rmul__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'capitalize', 'casefold', 'center', 'count', 'encode', 'endswith', 'expandtabs', 'find', 'format', 'format_map', 'index', 'isalnum', 'isalpha', 'isascii', 'isdecimal', 'isdigit', 'isidentifier', 'islower', 'isnumeric', 'isprintable', 'isspace', 'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'maketrans', 'partition', 'replace', 'rfind', 'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split', 'splitlines', 'startswith', 'strip', 'swapcase', 'title', 'translate', 'upper', 'zfill']
```
- As we can see, the `__iter__` method exists meaning the string `hello world` is an iterable object
## References

[^1]: https://www.analyticsvidhya.com/blog/2021/07/everything-you-should-know-about-iterables-and-iterators-in-python-as-a-data-scientist/#:~:text=Iterable%20is%20an%20object%20which,that%20you%20can%20loop%20over.
