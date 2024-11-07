---
aliases:
  - string
---
## Synthesis
- Check below
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
| 36<br>a = "age is {}." | Add placeholder for age parameter  | a.format(x)          | age is 36   |

## References

[^1]: https://www.w3schools.com/python/exercise.asp?filename=exercise_strings1