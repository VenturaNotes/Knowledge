---
aliases:
  - string
---
## Synthesis
### Characteristics
- Immutable
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
- Strings are [[immutable]] meaning their values cannot be changed after they're created
	- This means you cannot modify a character at a specific index.
		- #comment For example, with the string "hello", you can't interchange "h" and "e" without creating a new string
- When a string is modified, a new string object is created instead of altering the original one
## References

[^1]: https://www.w3schools.com/python/exercise.asp?filename=exercise_strings1
[^2]: https://stackoverflow.com/questions/8270092/remove-all-whitespace-in-a-string
[^3]: Google's Search Labs | AI Overview