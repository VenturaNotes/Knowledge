---
aliases:
  - abs()
---
## Synthesis
- 
## Source [^1]
- Returns [[absolute value]] of a given number.
	- Converts negative numbers to positive and leaves positive numbers unchanged
- When evaluating a number, it can be an integer, float, or a complex number

### Examples
```python
# Integers
print(abs(-10)) #Output: 10
print(abs(10))  #Output: 10

#Floats
print(abs(-5.5)) #Output: 5.5
print(abs(5.5))  #Output: 5.5
```

- [[Complex Numbers]]
	- Absolute value is calculated as the square root of the sum of the squares of its real and imaginary parts
	- $\sqrt{a^2+b^2}$ 
```python
# Complex number needs to be followed by "j"
print(abs (3 + 4j)) #Output: 5.0
print(abs(-3 - 4j)) #Output: 5.0
```

- Expressions
```python
y = abs(-20) + 10
print(y) #Output: 30
```

- [[List comprehension (Python)|list comprehension]]

## Source[^2]
- function built into the Python interpreter

## References

[^1]: ChatGPT
[^2]: https://docs.python.org/3.12/library/functions.html