---
Source:
  - https://leetcode.com/problems/group-anagrams/description/
Reviewed: false
---
## Synthesis
- Use a hashmap to solve the problem. Pay careful attention to defaultdict and transforming `count` to a tuple. It's all about whether it's [[mutable (Python)|mutable]] or not.
## Source [^1]
- [[anagram]]
- Method 1
	- Take each string and sort them. Time complexity would be $O(m*nlogn)$ 
- Method 2
	- [[HashMap (python)|hashmap]]
	- Time complexity: $O(m*n*26)$
		- m is the total number of input strings given
		- n is the average length of string
		- 26 is length of count array

### Approach 1

#### Code
```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        res = defaultdict(list)

        for s in strs:
            count = [0] * 26 #a ... z

            for c in s:
                count[ord(c) - ord("a")] += 1
            
            res[tuple(count)].append(s)
        return res.values()
```
#### Walkthrough
- Goal 
	- Group anagrams together in a nested list
	- Example
		- Input: `strs = ["eat","tea","tan","ate","nat","bat"]`
		- Output: `[["bat"],["nat","tan"],["ate","eat","tea"]]`
- Code
	- Create hashmap `res`
	- In `strs`, loop through each string
	- Initialize `count` array to 0 with 26 slots representing lowercase alphabet "a to z" 
	- Iterate through each character in string and calculate the ordinal difference between two characters
		- For example, if a character is "a", then `ord("a") - ord("a") = 0`. The 0th index of `count` would then be added by 1 updating the `count` array to 
			- `count = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]`
	- Every identical anagram will have the same `count` array value. This will be used as the key and the string will be appended to this nested list
#### Dry Run
- Given `["eat","tea","tan","ate","nat","bat"]`
- The solution should be `[["eat","tea","ate"],["tan","nat"],["bat"]]`

#### Key Terms
- [[defaultdict (python)|defaultdict]]
- [[Tuple (Python)|Tuple]]
- [[ord() (python)|ord()]]

## Source[^2]
### (1) Sorting
```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        res = defaultdict(list)
        for s in strs:
            sortedS = ''.join(sorted(s))
            res[sortedS].append(s)
        return list(res.values())
```
Time Complexity: $O(m*nlogn)$
Space Complexity: $O(m*n)$
- Where $m$ is the number of strings and $n$ is the length of the longest string

### (2) Hash Table
```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        res = defaultdict(list)
        for s in strs:
            count = [0] * 26
            for c in s:
                count[ord(c) - ord('a')] += 1
            res[tuple(count)].append(s)
        return list(res.values())
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m)$
Where $m$ is the number of strings and $n$ is the length of the longest string

## References

[^1]: https://www.youtube.com/watch?v=vzdNOK2oB2E
[^2]: https://neetcode.io/solutions/group-anagrams