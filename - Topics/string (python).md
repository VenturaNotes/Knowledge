---
aliases:
  - string
  - strings
---
## Synthesis

### Add / Append / Concatenation
```python
test = "hello"
test2 = " world"
test += test2
print(test) 

# Output: hello world
```
### Methods

#### String to List
```python

```
#### .replace()
```python
x = "Hello World"
x.replace('H','J')
print(x) # Jello World
```
#### .count()
- This can count the number of occurrences for a character in a string
```python
my_string = "hello world"
char_to_find = "o"
count = my_string.count(char_to_find)
print(f"The character '{char_to_find}' appears {count} times.") 
# Output: The character 'o' appears 2 times.
```
#### .partition()
- The `.partition()` method in Python is used to split a string into three parts based on the first occurrence of a specified separator.
#### .lstrip()
- Removes leading whitespace from a string
- `   hello.lstrip()` $\to$ `hello`
#### .isalnum()
- Checks if all characters in the text are alphanumeric 
```python
txt = "Company12"
x = txt.isalnum() # True
```
#### .lower()
- Takes a character and makes it lowercase 
```python
txt = "HELLO WORLD"
txt = txt.lower() #txt is now "hello world"
```
#### len('string')
```python
print(len('hello'))
# Output: 5
```
- Checking string length is constant-time operation $O(1)$
#### .join()
- #question Does it only accept a list type?
```python
print("".join(reversed(['1','2','3','4'])))

# Output: 4321
```
- #question Does this only work if the elements are string instances?
	- #comment It doesn't seem to work if you use `[1,2,3,4]`
#### .isdigit()
```python
"123".isdigit()  # True
"12a".isdigit()  # False
"".isdigit()     # False
```
- Method in Python that checks if all characters in a string are digits and if the string is not empty
#### .split()
- Seems to turn a string into a list my removing whitespaces
```python
my_string = "This is a sample string with multiple words."
word_list = my_string.split()
print(word_list)

# Output: ['This', 'is', 'a', 'sample', 'string', 'with', 'multiple', 'words.']
```
### Characteristics
- Immutable
### Concatenation
```python
test = "the"
new_string = test + "n"
print(new_string) # Output: "then"
```
- There is no `append()` method here
### Description
- Strings are [[immutable]] meaning their values cannot be changed after they're created
	- This means you cannot modify a character at a specific index.
		- #comment For example, with the string "hello", you can't interchange "h" and "e" without creating a new string
- When a string is modified, a new string object is created instead of altering the original one
### Organize
The `.partition()` method in Python is used to split a string into three parts based on the first occurrence of a specified separator.
- Format
	- `string.partition(separator)`
	- Returns a tuple of 3 elements
		- Part before separator
		- Separator
		- Part after separator
- If separator not found
	- `(original_string, '', '')`
## Source [^1]

| x value                | Intention                          | Command              | Output      |
| ---------------------- | ---------------------------------- | -------------------- | ----------- |
| "Hello World"          | Length                             | `len(x)`             | 11          |
| "Hello World"          | First Character                    | `x[0]`               | H           |
| "Hello World"          | Characters from index 2 to 4       | `x[2:5]`             | llo         |
| "  Extra  "            | Remove leading/trailing whitespace | `x.strip()`          | Extra       |
| "Hello World"          | Uppercase                          | `x.upper()`          | HELLO WORLD |
| "Hello World"          | Lowercase                          | `x.lower()`          | hello world |
| "Hello World"          | Replace character H with J         | `x.replace('H','J')` | Jello World |
| 36<br>a = "age is {}." | Add placeholder for age parameter  | `a.format(x)`        | age is 36   |

## Source[^2]
- Removing all spaces from a string
	- `sentence = sentence.replace(' ', '')`
	- #comment
		- Example
			- `myString = "5 1 6 2 8 3 4 10 9 7"`
			- `print(myString.replace(' ', ''))`
			- `Output: 51628341097`
				- Not useful though in separating numbers if they are greater than 1 digit (such as the number 10)
## Source[^3]
- The join function combines the elements of a list into a string
```python
li = ['a','b','c','d']
print("".join(li))
```
- The output is `abcd`
	- The "" depicts a null string
		- #question is there a difference between a null string and an empty string?

## Source[^4]
- `'Hello, World!'.partition(', ')`
	- Result is `('Hello', ', ', 'World!')`
- Removing leading whitespaces from a string
	- `string.lstrip()`
## Source[^5]
- Checks if all characters in the text are alphanumeric
```python
txt = "Company12"

x = txt.isalnum()

print(x)
```
## References

[^1]: https://www.w3schools.com/python/exercise.asp?filename=exercise_strings1
[^2]: https://stackoverflow.com/questions/8270092/remove-all-whitespace-in-a-string
[^3]: https://www.geeksforgeeks.org/quizzes/functions-python-gq/
[^4]: [[(Home Page) 500+ Python Interview Questions and Answers by applyre]]
[^5]: https://www.w3schools.com/python/ref_string_isalnum.asp #synthesized
