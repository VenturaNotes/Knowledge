---
Source:
  - https://leetcode.com/problems/minimum-window-substring/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-16 at 7.00.16 PM.png]]
- Return minimum window in string `s` which will contain all characters in `t`.
	- If no such window exists, return an empty string
	- There will always be one unique minimum window in `s`
- Before we needed to check the condition of all 3 values in the window each time, now we just need to check the condition for one.
	- Only need one operation now for comparing integers of total and then comparing integers of what we just added
	- So for each character we add, just need to do O(1) operation
- Solved the problem with time complexity of $O(n)$. When added or removed character, just did two operations. It's a linear time algorithm
```python
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if t == "": return ""

        countT, window = {}, {}

        for c in t:
            countT[c] = 1 + countT.get(c, 0)

        have, need = 0, len(countT)
        res, resLen = [-1, -1], float("infinity")
        l = 0
        for r in range(len(s)):
            c = s[r]
            window[c] = 1 + window.get(c, 0)

            if c in countT and window[c] == countT[c]:
                have += 1
            
            while have == need:
                # update our result
                if (r - l + 1) < resLen:
                    res = [l, r]
                    resLen = (r - l + 1)
                # pop from the left of our window
                window[s[l]] -= 1
                if s[l] in countT and window[s[l]] < countT[s[l]]:
                    have -= 1
                l += 1
        l, r = res
        return s[l:r+1] if resLen != float("infinity") else ""
```
## References

[^1]: https://www.youtube.com/watch?v=jSto0O4AJbM