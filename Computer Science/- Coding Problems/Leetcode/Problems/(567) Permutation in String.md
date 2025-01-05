---
Source:
  - https://leetcode.com/problems/permutation-in-string/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-16 at 6.37.08 PM.png]]
- Solution $O(26*n)$ and $O(n)$ 
- Will return true if a string `s2` contains a permutation of `s1`
- Same thing as looking for an [[anagram]]
- If absolutely comparing exact characters, time complexity is $O(n*m)$ which is bad. Instead, will use a [[hashmap]] which will give solution of $O(26*n)$
	- Edge cases: All characters will be limited to `a-z`
- Best solution will be $O(n)$ 
	- Real time complexity is $O(26) + O(n)$ which simplifies to $O(n)$ 
- Whenever we get to 26 matches, we stop the algorithm and return true 
```python
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        # Would be impossible to find a substring in s1
        # if it's greater than the s2 string
        if len(s1) > len(s2): return False

        s1Count, s2Count = [0] * 26, [0] * 26
        for i in range(len(s1)):
            s1Count[ord(s1[i]) - ord('a')] += 1
            s2Count[ord(s2[i]) - ord('a')] += 1
        
        matches = 0
        for i in range(26):
            matches += (1 if s1Count[i] == s2Count[i] else 0) 
        
        l = 0
        for r in range(len(s1), len(s2)):
            if matches == 26: return True

            index = ord(s2[r]) - ord('a')
            s2Count[index] += 1
            if s1Count[index] == s2Count[index]:
                matches += 1
            elif s1Count[index] + 1 == s2Count[index]:
                matches -=1
            
            index = ord(s2[l]) - ord('a')
            s2Count[index] -= 1
            if s1Count[index] == s2Count[index]:
                matches += 1
            elif s1Count[index] - 1 == s2Count[index]:
                matches -= 1
            l+= 1
        return matches == 26
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        s1 = sorted(s1)

        for i in range(len(s2)):
            for j in range(i, len(s2)):
                subStr = s2[i : j + 1]
                subStr = sorted(subStr)
                if subStr == s1:
                    return True
        return False
```
Time Complexity: $O(n^3logn)$
Space Complexity: $O(n)$

### (2) Hash Table
```python
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        count1 = {}
        for c in s1:
            count1[c] = 1 + count1.get(c, 0)
        
        need = len(count1)
        for i in range(len(s2)):
            count2, cur = {}, 0
            for j in range(i, len(s2)):
                count2[s2[j]] = 1 + count2.get(s2[j], 0)
                if count1.get(s2[j], 0) < count2[s2[j]]:
                    break
                if count1.get(s2[j], 0) == count2[s2[j]]:
                    cur += 1
                if cur == need:
                    return True
        return False
```
Time Complexity: $O(n*m)$
Space Complexity: $O(1)$
- Where $n$ is the length of the string1 and $m$ is the length of string2

### (3) Sliding Window
```python
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        if len(s1) > len(s2):
            return False
        
        s1Count, s2Count = [0] * 26, [0] * 26
        for i in range(len(s1)):
            s1Count[ord(s1[i]) - ord('a')] += 1
            s2Count[ord(s2[i]) - ord('a')] += 1
        
        matches = 0
        for i in range(26):
            matches += (1 if s1Count[i] == s2Count[i] else 0)
        
        l = 0
        for r in range(len(s1), len(s2)):
            if matches == 26:
                return True
            
            index = ord(s2[r]) - ord('a')
            s2Count[index] += 1
            if s1Count[index] == s2Count[index]:
                matches += 1
            elif s1Count[index] + 1 == s2Count[index]:
                matches -= 1

            index = ord(s2[l]) - ord('a')
            s2Count[index] -= 1
            if s1Count[index] == s2Count[index]:
                matches += 1
            elif s1Count[index] - 1 == s2Count[index]:
                matches -= 1
            l += 1
        return matches == 26
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=UbyhOgBN834
[^2]: https://neetcode.io/solutions/permutation-in-string