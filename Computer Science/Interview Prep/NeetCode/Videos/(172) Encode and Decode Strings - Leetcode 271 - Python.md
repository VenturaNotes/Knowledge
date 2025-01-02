---
Source:
  - https://www.youtube.com/watch?v=B1k_sxOSgv8
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-09 at 4.15.12 AM.png]]
- Intro
	- Could use LintCode to get access to premium problems on Leetcode
	- Need to create a delimiter between each word
		- Cannot just assume to use `#` symbol because it could be within the word. A good solution would be to count how many characters are in each element of the array before encoding.
			- However, they don't want us to store any kind of state variable. This encode and decode must be stateless.
			- Could do integer followed by a pound sign in front of word.
				- The overall time complexity of encode and decode is O(n) where n is going to be the total number of characters given to us in the list of words
	- Goal of this problem is to encode a list of strings to a string and then decode it back to the original list of strings.
```python
class Solution:
	"""
	@param: strs: a list of strings
	@return: encodes a list of strings to a single string
	"""
	def encode(self, strs):
		res = ""
		# The delimiter is the pound sign
		for s in strs:
			res += str(len(s)) + "#" + s
		return res

	"""
	@param: str: A string
	@return: dcodes a single string to a list of strings
	"""
	def decode(self, str):
		# i tells us position we're at in string
		res, i = [], 0
		while i < len(str):
			j = i
			while str[j] != "#":
				j+=1
			# starting at index i but not including index j
			length = int(str[i:j])
			res.append(str[j + 1 : j + 1 + length])
			i = j + 1 + length
		return res
		
```
- Dry run using Example `["neet","code"]
	- String is encoded to look like `"4#neet4#code`
	- While `i = 0` < `12`
		- Set `j = 0` and keep incrementing until index of `str = #`
		- When `j = 1`, `length = 4` since value of `str[i=0] = 4`
		- Appending `2 to 6` meaning `neet` is taken
		- Now `i` starts at 6
	- Second iteration
		- `i = 6 < 12`
		- set `j = 6` and increases until `#` symbol meaning `j = 7` now
		- `length = 4` again
		- Appending `8: 12` meaning gives `code`
		- `i = 7+1+4 = 12`
	- While loop exists and returns `res`!
## References

[^1]: https://youtu.be/B1k_sxOSgv8?si=Ve2y0NklpNMV0l_I