---
aliases:
  - StopIteration
References: 1
---
## Synthesis
### Example
Code
```python
my_list = [1]
my_iterator = iter(my_list)

print(next(my_iterator)) # Output: 1
print(next(my_iterator)) # Output: 2
```
Output
```
1
Traceback (most recent call last):
  File "main.py", line 5, in <module>
    print(next(my_iterator)) # Output: 2
StopIteration
```
- When there are no more items in the sequence, a StopIteration exception is raised
## Source [^1]
- This exception is raised to signal that an iterator has reached the end of its sequence and has no more items to produce

### Handling StopIteration exceptions
- [[for loop (python)|For loops]] automatically handle `StopIteration` exceptions, so you generally don't need to explicitly handle them
- To explicitly handle them, you can use a [[try (python)|try]]...except block when working with iterators directly

Code
```python
my_iterator = iter([1, 2, 3, 4, 5])
try:
    while True:
        item = next(my_iterator)
        print(item)
except StopIteration:
    print("End of iterator")
print("Program continuing!")
```
Output
```
1
2
3
4
5
End of iterator
Program continuing!
```
## References

[^1]: Google's Search Labs | AI Overview