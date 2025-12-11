---
Source:
  - https://leetcode.com/problems/group-anagrams/description/
Reviewed: false
Attempts: 1
---
## Synthesis
- Use a hashmap to solve the problem. Pay careful attention to defaultdict and transforming `count` to a tuple. It's all about whether it's [[mutable (Python)|mutable]] or not.
### Solution
```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        # Dictionary where each key's default value is an empty list
        res = defaultdict(list)

        for s in strs:
	        # List for each letter in the alphabet
            count = [0] * 26 #a ... z

			# Keeps track of frequency of each letter in s
            for c in s:
                count[ord(c) - ord("a")] += 1
            
            res[tuple(count)].append(s)
        return list(res.values())
```
- $m$ is the number of strings and $n$ is length of the longest string
	- Time Complexity: $O(m*n)$
	- Space Complexity: $O(m)$ 
- Create a default dictionary
- Example: `["eat","tea","tan","ate","nat","bat"]`
	- When doing `for s in strs`, `s = "eat"`
	- `for c in s` will find the difference between the ordinal of `c` and the ordinal of "a" which will range between 0 ("a") and 25 ("z").
	- The `tuple(count)` is used to create an immutable version of the list `count` so it can be used as a `key` in the dictionary `res`
```python
from collections import defaultdict

res = defaultdict(list)

res["hello"].append("Hi")

print(res.values())
print(list(res.values()))

""" Output
dict_values([['Hi']]) 
[['Hi']]
"""
```
- For the last part, need to return `list`. Otherwise, will return the wrong format
### My Solution
```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        my_sorted_list = []
        my_dict = {}
    
        for i in strs: #n
            my_sorted_list.append(sorted(i)) #nlogn
        for i in range(len(my_sorted_list)): #n
            if tuple(my_sorted_list[i]) not in my_dict: #O(1)
                my_dict[tuple(my_sorted_list[i])] = []
            my_dict[tuple(my_sorted_list[i])].append(strs[i])
        return list(my_dict.values())
```
- I sort each string in alphabetical order within `strs` and add them to `my_sorted_list`. Then I have a dictionary where my `key` will represent that anagram in alphabetical order and store the original anagram strings (from `strs`) as the values. Then return the values in the end.
	- Side note: I needed to convert the `my_sorted_list[i]` to a tuple because a key value must be immutable (in which a list is not)
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
- #comment Return may be incorrect. Might need `res.values()`
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
- Group anagrams together in sublists
### (1) Sorting
#comment Comments made my ChatGPT and I 
```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        #defaultdict(list) ensures that if a key doesn't exist, will
        # initialize with an empty list
        res = defaultdict(list)

		
        for s in strs:
	        # Sorts characters of string `s` alphabetically
	        # and then sorts characters back into string
            sortedS = ''.join(sorted(s))
            # Add string to the list corresponding to key
            res[sortedS].append(s)
		# Returns grouped anagrams in a list of lists
        return list(res.values())
```
- Time Complexity: $O(m*nlogn)$
	- Sorting 
- Space Complexity: $O(m*n)$
- Where $m$ is the number of strings and $n$ is the length of the longest string
- #comment Summary
	- (1) Use [[defaultdict (python)|defaultdict]] instead of [[dictionary (Python)|dict()]] because 
		- `defaultdict` does not require you to explicitly check if a key exists before appending a value to its associated list


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
