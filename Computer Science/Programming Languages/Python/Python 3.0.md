- A programming language that's object oriented and interpreted

- Definitions:
	- Pythonic: Exploiting the features of the Python language to produce code that is clear, concise and maintainable. [^1]
	- Classes: Allows us to logically group our data and functions in a way that's easy to reuse and also easy to build upon if need-be. A blueprint for creating instances
	- Method: A function associated with a class

Print to console
```python
print("Hello World")
```

Strings [^2] [^3] [^4]
```python
# Dealing with quotes for strings
message = "Bobby's world" # Use double quotes for single quote
message = 'Bobby\'s world' # Escape single quote with a backslash

#Conventional variable naming
my_message = 'Hello World' # Best used with underscore

# Multiline string
message = """I can write
as much as I want and
it will still work :)""" 

# Checks length
x = len("Hello World") # Would print 11

# Getting character from String
message = 'Hello World'
print(message[10]) # prints d
print(message[11]) # returns IndexError

# Getting range of characters from String (Slicing)
message = 'Hello World'
print(message[0:5]) # Hello
print(message[:5]) # Hello
print(message[6:]) # World

# Rerverse
sample_url = 'http://coreyms.com'
print (sample_url[::-1]) # moc.smyeroc//:ptth

# Methods
message = 'Hello World'
print(message.lower()) # hello world (lowercase the string)
print(message.upper()) # HELLO WORLD (uppercase the string)
print(message.count('Hello')) # 1 (there is 1 occurrence)
print(message.count('l')) # 3 (there are 3 occurrences)
print(message.find('World')) # 6 (Found at 6th index)
print(message.find('Universe')) # -1 (Not found)

# Replace
message = 'Hello World'
message = message.replace('World', 'Universe')
print(message) # Hello Universe

# Concatenation
greeting = 'Hello'
name = 'Michael'
message = greeting + ', ' + name + '. Welcome!'
print(message) # Hello, Michael. Welcome!

# Formatted String
greeting = 'Hello'
name = 'Michael'
message = '{}, {}. Welcome!'.format(greeting,name) # Great for placeholders. Much easier than keeping track of all the concatenations
print(message) # Hello, Michael. Welcome!

# Numbered placeholders
tag = 'h1'
text = 'This is a headline'
sentence = '<{0}>{1}</{0}>'.format(tag,text)
print(sentence) # <h1>This is a headline</h1> (Great for repeating placeholders)

```

Lists [^3]
```python

# Reference
my_list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
#          0, 1, 2, 3, 4, 5, 6, 7, 8, 9
#        -10,-9,-8,-7,-6,-5,-4,-3,-2,-1 

# Getting element from list
print (my_list[5]) # 5
print (my_list[-1]) # 9
print (my_list[-10]) # 0

# Get range of elements from list (colon in array)
# list[start:end:step] (end index never inclusive even in reverse)
print(my_list[0:6]) # [0, 1, 2, 3, 4, 5]
print(my_list[-7:-2]) # [3, 4, 5, 6, 7]
print(my_list[1:-2]) # [1, 2, 3, 4, 5, 6, 7]
print(my_list[:3]) # [0, 1, 2] (index NOT included)
print(my_list[3:]) # [3, 4, 5, 6, 7, 8, 9] (index included)
print(my_list[:-1]) # [0, 1, 2, 3, 4, 5, 6, 7, 8]
print(my_list[:]) # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] (copy of entire list)

# Using steps
print(my_list[2:-1:2]) # [2, 4, 6, 8] (skips every other element)
print(my_list[-1:2:-1]) # [9, 8, 7, 6, 5, 4, 3]

# Reverse the list
print(my_list[::-1])

```

Assigns multiple values at once
```python
i = j = k = 0
```

Floor division
```python
x = 7//2 # Returns 3 as an integer
```

Check if item in array (membership test)
```python
x = [1,2,3,4]
if 3 in x:
    print("TRUE")
# Prints: True
# More performant to do membership tests on sets rather than lists. It's O(n) to check value in list and O(1) to check value in set.
```

Comments
```python

# Use hashtag for single line comment

'''
Use 3 quotation marks
for multiple line comments
'''
```


Sets [^5]
```python
# Creating a set
s1 = set([1,2,3,4,5])
s2 = {1, 2, 3, 4, 5}

# Creating an empty set
s1 = set()
# Do not use s1 = {} b/c it will create an empty dictionary

# Adding one element to set
s1.add(6)

# Adding more than one element to set
s1 = {1, 2, 3, 4, 5}
s2 = {7,8,9}
s1.update([6,7,8], s2) # Duplicate values will be removed

# Remove Values
s1 = {1, 2, 3, 4, 5}
s1.remove(5) # Will get a KeyError if value DNE in set
s1.discard(5) # Will NOT get a KeyError if value DNE in set

# Example sets:
s1 = {1, 2, 3}
s2 = {2, 3, 4}
s3 = {3, 4, 5}

s4 = s1.intersection(s2) # Finds intersection of both sets {2, 3}
s4 = s1.intersection(s2, s3) # Includes a 3rd set
s4 = s1.difference(s2) # Returns values in s1 but not in s2 {1}
s4 = s1.difference(s2, s3) # Includes a 3rd set
s4 = s1.symmetric_difference(s2) # Returns difference in both sets {1,4}

# Cast list to set to remove duplicates and cast set to list again
l1 = [1,2,3,1,2,3]
l2 = list(set(l1))
```

Dictionary [^4]
```python

#################################
# Placeholders for dictionary

# {} creates an empty dictionary

# Variation 1
person = {'name': 'Jenn', 'age': 23}
sentence = 'My name is {0} and I am {1} years old.'.format(person['name'], person['age'])
print(sentence) # My name is Jenn and I am 23 years old.

# Variation 2
person = {'name': 'Jenn', 'age': 23}
sentence = 'My name is {0[name]} and I am {0[age]} years old.'.format(person)
print(sentence) # My name is Jenn and I am 23 years old.

#Variation 3
l = ['Jenn', 23]
sentence = 'My name is {0[0]} and I am {0[1]} years old.'.format(l)
print(sentence) # My name is Jenn and I am 23 years old.

#################################

```

Classes [^6]
```python
class Employee:
	pass # Let's python know to skip for now
```

## References

[^1]: https://stackoverflow.com/questions/25011078/what-does-pythonic-mean#:~:text=exploiting%20the%20features%20of%20the%20python%20language%20to%20produce%20code%20that%20is%20clear%2C%20concise%20and%20maintainable.
[^2]: https://www.youtube.com/watch?v=k9TUPpGqYTo&feature=youtu.be
[^3]: https://www.youtube.com/watch?v=ajrtAuDg3yw
[^4]: https://www.youtube.com/watch?v=vTX3IwquFkc
[^5]: https://www.youtube.com/watch?v=r3R3h5ly_8g
[^6]: https://www.youtube.com/watch?v=ZDa-Z5JzLYM
