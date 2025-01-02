---
Source:
  - https://leetcode.com/problems/longest-palindromic-substring
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 3.14.55 AM.png]]
- Want to return the longest palindromic substring of a string.
	- Can have multiple answers
- [[Palindromes|palindrome]]
	- Writing in reverse order is the exact same string
- For any given substring, to check if it's a palindrome, it will take linear time complexity
- Brute force approach is $n^3$ 
	- We have total $n^2$ substrings to check and it takes $n$ to check a substring giving $O(n^3)$ for a time complexity
- Need to do a linear scan for every single substring
- Can get time complexity of $O(n^2)$ when expanding characters
	- However, an edge case we're missing is a palindrome of even length
	- It's only a slight edge case which can be easily added to the solution
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        res = ""
        resLen = 0

        for i in range(len(s)):
            # odd length
            l, r = i, i
            while l >= 0 and r < len(s) and s[l] == s[r]:
                if (r - l + 1) > resLen:
                    res = s[l:r+1]
                    resLen = r - l + 1
                l -= 1
                r += 1
            
            # even length
            l, r = i, i + 1
            while l >= 0 and r < len(s) and s[l] == s[r]:
                if (r - l + 1) > resLen:
                    res = s[l:r+1]
                    resLen = r - l + 1
                l -= 1
                r += 1
        
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=XYQecbcd6_c