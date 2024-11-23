---
aliases:
  - set
  - sets
---
## Synthesis
- Empty set initialization: `my_variable = set()`
	- Avoid `my_variable = {}` as that creates a [[dictionary (Python)|dictionary]]
### Questions
- #question what is [[auxiliary space (python)|auxiliary space]]
## Source [^1]
```python
#Check if an element is present in set
fruits = {"apple", "banana", "cherry"}
if "apple" in fruits:
  print("Yes, apple is a fruit!")

#Add element to set
fruits = {"apple", "banana", "cherry"} 
fruits.add("orange")

#Add multiple items to set
fruits = {"apple", "banana", "cherry"}
more_fruits = ["orange", "mango", "grapes"]
fruits.update(more_fruits)

#Remove item from set
fruits = {"apple", "banana", "cherry"} 
fruits.remove("banana")

#Discard item from set
fruits = {"apple", "banana", "cherry"}
fruits.discard("banana")
```

## Source [^2]
- `remove()` method will raise an error if the specified item does not exist. The `discard()` method will not
## Source [^3]
### Set Methods

#### remove()
- Removes single element from set, and updates set
- Does not return any value
- If element does not exist, KeyError exception is thrown
```python
languages = {'Python', 'Java', 'English'}
languages.remove('English')
print(languages) # Output: {'Python', 'Java'}
```

#### add()
- Adds a unique element to a set
- Can add tuples to set
- Return type is `None`
```python
prime_numbers = {2, 3, 5, 7}

# add 11 to prime_numbers
prime_numbers.add(11)

print(prime_numbers)

# Output: {2, 3, 5, 7, 11}
```
#### copy()
- Returns copy of set
- Different from using assignment operator which would cause both variables to reference the same set object. If one is changed, the other is as well [^4]
```python
numbers = {1, 2, 3, 4}

# copies the items of numbers to new_numbers
new_numbers = numbers.copy()

new_numbers.add(5)

print(numbers)
print(new_numbers)

# Output:
# {1, 2, 3, 4}
# {1, 2, 3, 4, 5}

# If new_numbers = numbers was used

# Output:
# {1, 2, 3, 4, 5}
# {1, 2, 3, 4, 5}

```
#### clear()
- Removes all elements from a set. 
```python
numbers = {1, 2, 3, 4}
numbers.clear()
print(numbers) #set()
```

#### difference()
- #question Would like to continue this [website](https://www.programiz.com/python-programming/methods/set/clear)

#### difference_update()

#### discard()
#### intersection()

#### intersection_update()
#### isdisjoint()

#### issubset()

#### pop()

#### symmetric_difference()
#### symmetric_difference_update()
#### union()
#### update()

## Source [^4]
### Removing Multiple Elements at Once
#### Looping Remove() Method
```python
my_set = {1, 2, 3, 4, 5}
elements_to_remove = {2, 4}

for elem in elements_to_remove:
    my_set.remove(elem)

print(my_set)  # Output: {1, 3, 5}

```
- The remove() method removes a specified element (unable to remove multiple elements at once)
- Raises a [[KeyError (Python)|KeyError]] if the element is not found
#### difference_update Method
```python
my_set = {1, 2, 3, 4, 5}
elements_to_remove = {2, 4}

my_set.difference_update(elements_to_remove)

print(my_set)  # Output: {1, 3, 5}
```
- Able to remove multiple elements without a for loop.
- Does not raise an error if element not found

#### Looping Discard() Method
```python
my_set = {1, 2, 3, 4, 5}
elements_to_remove = {2, 4}

for elem in elements_to_remove:
    my_set.discard(elem)

print(my_set)  # Output: {1, 3, 5}

```
- Removes a specified element if present 
- Does not raise an error if element not found

### Initializing Sets

#### Using Curly Braces or the `set()` Constructor
```python
# Curly braces with comma-separate values
my_set = {1, 2, 3}

#Transforming tuple to set
my_set = set((1, 2, 3))

#Transforming string to set (each unique character becomes element)
my_set = set("abc") # {'a', 'b', 'c'}

# Copying another set (which would not modify original)
original_set = {1, 2, 3}
my_set = set(original_set)
my_set.add(6)
print(my_set)       #Output: {1, 2, 3, 6}
print(original_set) #Output: {1, 2, 3}
```
#question is `set()` considered a constructor or just a method/function? 
#### Set Comprehension
- Use [[set comprehension (python)|set comprehension]]
```python
my_set = {x for x in range(5)}
print(my_set)  # Output: {0, 1, 2, 3, 4}

# With a condition
my_set = {x for x in range(10) if x % 2 == 0}
print(my_set)  # Output: {0, 2, 4, 6, 8}
```
#question I would like to understand set comprehension a little better

#### Empty Set
- Use the `set()` constructor for this. `{}` will create a [[dictionary (Python)|dictionary]] instead of a set
```python
my_set = set()
```

#### Use 'dict.fromkeys()'
- Can create a dictionary and convert its keys to a set
```python
# Using dict.fromkeys() to initialize a set
my_set = set(dict.fromkeys([1, 2, 3]))
print(my_set)  # Output: {1, 2, 3}
```
#question Why would this be considered important?

#### Unpacking
- Could use [[unpacking (python)|unpacking]]. Unpack elements from an iterable directly into a set
```python
# Unpacking a list into a set
my_list = [1, 2, 3]
my_set = {*my_list}
print(my_set)  # Output: {1, 2, 3}

# Unpacking a tuple into a set
my_tuple = (1, 2, 3)
my_set = {*my_tuple}
print(my_set)  # Output: {1, 2, 3}
```
#question I don't understand what the `*` is doing. It seems confusing
#question I want to understand how unpacking actually works
#question Modify the code as well.

### Using the get Method

## References

[^1]: https://www.w3schools.com/python/exercise.asp?filename=exercise_tuples4
[^2]: https://www.w3schools.com/python/ref_set_discard.asp#:~:text=The%20discard()%20method%20removes,discard()%20method%20will%20not.
[^3]: https://www.programiz.com/python-programming/methods/set/remove
[^4]: ChatGPT