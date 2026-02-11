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
## Source[^2]
### (1) Backtracking
```python
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        res = []
        digitToChar = {
            "2": "abc",
            "3": "def",
            "4": "ghi",
            "5": "jkl",
            "6": "mno",
            "7": "qprs",
            "8": "tuv",
            "9": "wxyz",
        }

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
Time Complexity: $O(n*4^n)$
Space Complexity: $O(n)$

### (2) Iteration
```python
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []

        res = [""]
        digitToChar = {
            "2": "abc",
            "3": "def",
            "4": "ghi",
            "5": "jkl",
            "6": "mno",
            "7": "qprs",
            "8": "tuv",
            "9": "wxyz",
        }

        for digit in digits:
            tmp = []
            for curStr in res:
                for c in digitToChar[digit]:
                    tmp.append(curStr + c)
            res = tmp
        return res
```
Time Complexity: $O(n*4^n)$
Space Complexity: $O(n)$
## References

[^1]: [Letter Combinations of a Phone Number - Backtracking - Leetcode 17](https://www.youtube.com/watch?v=0snEunUacZY)
[^2]: https://neetcode.io/solutions/letter-combinations-of-a-phone-number