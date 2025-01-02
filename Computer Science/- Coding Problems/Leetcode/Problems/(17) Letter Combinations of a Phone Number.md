---
Source:
  - https://leetcode.com/problems/letter-combinations-of-a-phone-number
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-22 at 12.28.31 AM.png]]
- Digits only contain `2-9`
- Return all possible combinations that the number could represent
- It's a [[backtracking]] problem again because you need to brute force solutions
- Will be shown how to do this recursively
- The time complexity for this is the number of combinations we will have
	- $O(n*4^n)$ 
```python
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        res = []
        digitToChar = {"2": "abc",
                        "3": "def",
                        "4": "ghi",
                        "5": "jkl",
                        "6": "mno",
                        "7": "qprs",
                        "8": "tuv",
                        "9": "wxyz"}
        
        def backtrack(i, curStr):
            if len(curStr) == len(digits):
                res.append(curStr)
                return
            for c in digitToChar[digits[i]]:
                backtrack(i + 1, curStr + c)
        if digits:
            backtrack(0, "")
        
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=0snEunUacZY