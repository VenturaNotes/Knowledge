---
aliases:
  - iterator
---
## Synthesis

### Non-Example
Code
```python
my_list = [1, 2]

print(next(my_list)) # Output: 1
```
Output
``` 
Traceback (most recent call last):
  File "main.py", line 3, in <module>
    print(next(my_list)) # Output: 1
TypeError: 'list' object is not an iterator
```
- By default, the `list` object is not an iterator
## Source [^1]
- An object that implements the iterator protocol, which consists of the following two methods
	- [[__iter__() (python)|__iter__()]]
		- Returns the iterator object itself. Required to allow the iterator to be used in `for` loops and other constructs that expect iterables
	- [[__next__() (python)|__next__()]]
		- Returns the next item in sequence. If no more items, raises a [[StopIteration (python)|StopIteration]] exception
### Example
Code
```python
my_list = [1, 2] # This is an iterable (list)
my_iterator = iter(my_list) # Creates an iterator from the list

print(next(my_iterator)) # Access the first element
print(next(my_iterator)) # Access the second element 
```
Output
```
1
2
```

## Source[^2]
- An iterator is an object that contains a countable number of values
	- #question What does countable number mean?
- An iterator is an object that can be iterated upon, meaning that you can traverse through all the values. 
- For python, an iterator is an object which implements the iterator protocol which consists of the methods [[__iter__() (python)|__iter__()]] and [[__next__() (python)|__next__()]]
## References

[^1]: Google's Search Labs | AI Overview
[^2]: https://www.w3schools.com/python/python_iterators.asp