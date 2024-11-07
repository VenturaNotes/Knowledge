---
aliases:
  - list
  - lists
---
## Synthesis
- 
## Source [^1]
- Lists are not hashable since lists are [[mutable (Python)|mutable]]

- Initializing list with default values
```python
numbers = [0] * 5  # [0, 0, 0, 0, 0]
```
## Source [^2]
```python
#Retrieve second item in list
fruits = ["apple", "banana", "cherry"]
print(fruits[1])

#Change value in list
fruits = ["apple", "banana", "cherry"]
fruits[0]= "kiwi"

#Add element to end of list
fruits = ["apple", "banana", "cherry"]
fruits.append("orange")

#Add element as second item in list
fruits = ["apple", "banana", "cherry"]
fruits.insert(1,"lemon")

#Remove element from list
fruits = ["apple", "banana", "cherry"]
fruits.remove("banana")

#Print last item of list
fruits = ["apple", "banana", "cherry"]
print(fruits[-1])

#Print 3rd, 4th, and 5th item in list
fruits = ["apple", "banana", "cherry", "orange", "kiwi", "melon", "mango"]
print(fruits[2:5])

#Print number of items in list
fruits = ["apple", "banana", "cherry"]
print(len(fruits))
```

## References

[^1]: ChatGPT
[^2]: https://www.w3schools.com/python/exercise.asp?filename=exercise_lists1