---
aliases:
  - in
---
## Synthesis
### Checking Multiple Values at Once
```python
if i in {'[', '{', '('}:
	print('found')

# Above is equivalent to 

if i == '[' or i == '{' or i == '(':
    print('found')
```
- Also it's better to use `{'[', '{', '('}` since than writing out explicit comparisons
- Given the example of 1 million comparisons
	- Options
		- Using if statements would mean you'd need 1 million equality checks worst case, the CPU executes each comparison individually, and even branch prediction wouldn't help because the comparisons differ
			- #question What is branch prediction?
			- #question Is it the CPU that always does equality checks? Is the CPU not used when doing a set lookup?
		- Looking in sets means you compute hash of `i`, jump to corresponding bucket, check if key matches, and then done
			- You'd need 10,000x more collisions before you even approach the speed of 1 million comparisons
	- Summary
		- Set lookup would take on average 0.001 ms while 1 million comparisons would take about 3.0 ms
- 
## Source [^1]
### Example
- Can check if an item is in the list
```python
fruits = ["apple", "banana", "cherry"]

if "banana" in fruits:
  print("yes")
```
- This keyword has two purposes:
	- Check if a value present in a sequence (list, range, string, etc.)
		- #question Are lists considered sequences in python?
	- Used to iterate through a sequence in a `for` loop
## References

[^1]: https://www.w3schools.com/python/ref_keyword_in.asp