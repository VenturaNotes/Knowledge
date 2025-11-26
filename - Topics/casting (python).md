---
aliases:
  - casting
---
## Synthesis
- Casting methods
	- [[float() (Python)|float()]]
	- [[int() (Python)|int()]]
	- [[complex() (Python)|complex()]]
	- [[str() (Python)|str()]]
### Convert integer 

```python
my_int = 3456
my_list = []

for digit_char in str(my_int):
	my_list.append(int(digit_char))

# Output: [3, 4, 5, 6]
```

## Source [^1]
```python
# convert int to float
x = 5
x = float(x)

#convert float to integer
x = 5.5
x = int(x)

#convert int to complex
x = 5
x = complex(x) #(3.0j)
```
## References

[^1]: https://www.w3schools.com/python/exercise.asp?filename=exercise_numbers1