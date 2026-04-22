## Synthesis

### Description
- Slicing is when you split an array into a subarray
- Syntax
	- `list[start:stop]`
		- start: Index slice begins (inclusive).
		- end: Index slice ends (exclusive)
### Example 
```python
my_list = [1, 2, 3, 4, 5]
subarray = my_list[1:4]
print(subarray) # Output: [2, 3, 4]
```
### Variations
- Given `[1, 2, 3, 4, 5]`
	- `[:3]`
		- Starts from beginning of list to 2nd index: `[1, 2, 3]`
	- `[2:]`
		- Goes to end of list: `[3, 4, 5]`
	- `[-1]`
		- Returns last element in list `[5]`
## Source [^1]
- 
## References

[^1]: 