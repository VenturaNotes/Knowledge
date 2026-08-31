---
aliases:
  - exclusive-or
  - xor
---
## Synthesis
- A logical operator that outputs true only when its two inputs differ (one is true and the other is false).
	- Cases
		- If you have 0 XOR 0, you get 0
		- If you have 1 XOR 1, you get 0
		- If you have 0 XOR 1, you get 1
		- If you have 1 XOR 0, you get 1
### Python
- The `^` operator represents the bitwise XOR operation in python
	- [ ] So lets say I was comparing two values like `test1 = False` and `test2 = True`. How do i return true if only one of them is true?

[1]
You can directly use the `^` operator on booleans:

```python
result = test1 ^ test2
```

Alternatively, you can use the inequality operator:

```python
result = test1 != test2
```

Both evaluate to `True` if only one of the values is `True`.
[/1]

But what should I do if I have the variables `test1` and `test2` and i need to check if only one of them holds the value `None` but not both?


### Examples
- 2 XOR 5
	- 2 in binary is 010
	- 5 in binary is 101
	- 010 XOR 101 = 111 (which is 7 in decimal)
### Finding Binary XOR
- Align the binary number by their rightmost bit and compare
- Given $2 = 010_2$ and $5 = 101_2$ 
	- The third digit of each is 0 XOR 1 = 1
	- The second digit of each is 1 XOR 0 = 1
	- The first digit of each is 0 XOR 1 = 1
	- [ ] #question Which one is the first or second digit?
- So 2 XOR 5 = $111_2$ 
## Source [^1]
- 
## References

[^1]: