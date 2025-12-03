---
aliases:
  - for loop
  - for loops
---
## Synthesis
### Retrieving elements
```python
fruits = ["apple", "banana", "cherry"]

for x in fruits:
	print(x)

"""
Output:

apple
banana
cherry

"""
```
### Retrieving index

### Steps 
- Lets you iterate through a set of numbers every 2 steps
```python
# Iterate from 0 to 9, taking steps of 2
for i in range(0, 10, 2):
    print(i)
```
### Limit / Start
```python
test = ["hello", "world"]

for i in test[1:]:
    print(i)
```
- Skips first index here

## Source [^1]
```python
# Given
fruits = ["apple", "banana", "cherry"]

# Loop through list
for x in fruits:
	print(x)

# Could loop through a code set 6 times
for x in range(6): #Seems like 0 is inclusive and 6 is exclusive
	print(x) # Output (on separate lines): 0 1 2 3 4 5

```
## Source[^2]
- For loops are considered a type of [[control flow (python)|control flow]] in python
- Able to iterate through a list, tuple, string, or range
## References

[^1]: https://www.w3schools.com/python/exercise.asp?filename=exercise_for_loops1
[^2]: ChatGPT