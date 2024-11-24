---
Source:
  - https://leetcode.com/problems/palindromic-substrings/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 3.21.47 AM.png]]
- A [[substring]] is a contiguous sequence of characters within the string.
- Brute force solution is $O(n^3)$ and optimized solution is $O(n^2)$ 
- Finding the time complexity for even numbers is $O(n^2)$ 
- Find the time complexity for odd numbers is $O(n^2)$ 
- Adding the two together will still give an overall time complexity of $O(n^2)$
```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        res = 0

        for i in range(len(s)):
            l = r = i
            while l >= 0 and r < len(s) and s[l] == s[r]:
                res += 1
                l-= 1
                r += 1
            
            l = i
            r = i + 1
            while l >= 0 and r < len(s) and s[l] == s[r]:
                res += 1
                l-=1
                r += 1
        return res
```
- And now condensed into a single function
```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        res = 0

        for i in range(len(s)):
            res += self.countPali(s, i, i)
            res += self.countPali(s, i, i+1)
        return res
    
    def countPali(self, s, l, r):
        res = 0
        while l >= 0 and r < len(s) and s[l] == s[r]:
            res += 1
            l -= 1
            r += 1
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=4RACzI5-du8