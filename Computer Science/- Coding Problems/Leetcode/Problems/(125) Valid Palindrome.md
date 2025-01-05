---
Source:
  - https://leetcode.com/problems/valid-palindrome/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-14 at 7.42.34 PM.png]]
	- Right Image shows second solution
- Two different ways to solve this (both important in interview setting)
- Part of the Blind 75 questions
- Problem
	- Determine if string is a [[Palindromes|palindrome]]. Only considering alphanumeric characters in the list and ignoring cases (meaning upper and lower cases)
		- Alphanumeric characters means A-Z, a-z, and 0-9
	- A string is a palindrome when it reads the same way when reversed
	- Remove spaces, special characters, and convert to lowercase 
- Syntax for reversing a string
	- `newStr == newStr[::-1]`

### Solution 1
```python
class Solution:
	def isPalindrome(self, s: str) -> bool:
		newStr = ""

		for c in s:
			if c.isalnum():
				newStr += c.lower()
		return newStr == newStr[::-1]
```
- Interviewer may not want you to use alphanumeric function
- Used extra memory by building new string and reversing string
### Solution 2
- Can solve this problem with constant extra memory O(1). Will use [[pointers]] for this
	- Left and right pointer
	- Shift pointers
	- Pointers either meet at same character or pass each other
- Will use [[ASCII]] values to determine if a character is [[alphanumerical]]
	- Letters 97 to 122 in ASCII are contiguous which represents "a" to "z"
	- Will make an alphanumerical character detecting function 
- The solution is a linear time algorithm O(n) as we need to iterate through string but memory complexity is O(1)
- In python, if you want to call another function inside of an object, you have to use the self keyword
```python
class Solution:
	def isPalindrome(self, s: str) -> bool:
		l, r = 0, len(s) - 1

		while l < r:
			while l < r and not self.alphaNum(s[l]):
				l += 1
			while r > l and not self.alphaNum(s[r]):
				r-=1
			if s[l].lower() != s[r].lower():
				return False
			l, r = l + 1, r - 1
		return True

	def alphaNum(self, c):
		return (ord('A') <= ord(c) <= ord('Z') or
				ord('a') <= ord(c) <= ord('z') or
				ord('0') <= ord(c) <= ord('9'))
```
- C@ic
	- Step 1
		- L = c
		- R = c
		- = so next number
	- Step 2
		- L  = @
		- R = i
		- Will skip so now L = i
		- We compare and they're equal
		- Then add +1 to both so R = @ and L = c
		- Won't continue so over then. 
## Source[^2]
### (1) Reverse String
```python
class Solution:
    def isPalindrome(self, s: str) -> bool:
        newStr = ''
        for c in s:
            if c.isalnum():
                newStr += c.lower()
        return newStr == newStr[::-1]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (2) Two Pointers
```python
class Solution:
    def isPalindrome(self, s: str) -> bool:
        l, r = 0, len(s) - 1

        while l < r:
            while l < r and not self.alphaNum(s[l]):
                l += 1
            while r > l and not self.alphaNum(s[r]):
                r -= 1
            if s[l].lower() != s[r].lower():
                return False
            l, r = l + 1, r - 1
        return True
    
    def alphaNum(self, c):
        return (ord('A') <= ord(c) <= ord('Z') or 
                ord('a') <= ord(c) <= ord('z') or 
                ord('0') <= ord(c) <= ord('9'))
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=jJXJ16kPFWg
[^2]: https://neetcode.io/solutions/valid-palindrome