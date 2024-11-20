[Source](https://leetcode.com/problems/valid-anagram/)

## Synthesis
- To find if two strings are an anagram
	- Solution with space and time complexity: O(s + t)
		- If the string lengths are not equal, return False
		- Otherwise, create a hashmap of both strings to count character occurrence. Then check if the hashmaps are equal or not (could iterate though them as well)
	- Solution with space complexity O(1)
		- Sort both strings
			- Best sorting algorithms have time complexity of O(nlogn)
		- Check if they're equal
## Key Terms
- [[Anagram]]: A word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once [^1]

## Source [^2]
- [[HashMap (python)|hashmap]]
### Approach 1
- Complexity (s and t are length string)
	- Time Complexity: O(s + t)
	- Space Complexity: O (s + t)
		- Because we build a hashmap of this size

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        countS, countT = {}, {}
        for i in range(len(s)):
            countS[s[i]] = 1 + countS.get(s[i], 0) #If key does not exist in hashmap, default value is 0
            countT[t[i]] = 1 + countT.get(t[i], 0)
        for c in countS:
            if countS[c] != countT.get(c, 0): #Ensures a key exists
                return False
        return True
```
- Logic
	- `count_[s[i]] = 1 + countS[s[i]]`
		- This will throw a key error since the character may not exist in hashmap yet
		- `count_[s[i]] = 1 + countS.get(s[i], 0)`
			- The second parameter will get the default value if key doesn't exist in hashmap

#### Variation
```python
# Old
for c in countS:
	if countS[c] != countT.get(c, 0): #Ensures there is some 
		return False

# New
if countS != countT:
	return False

# This is because both hashmaps should be identical
```

### Approach 2
```python
from collections import Counter

class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return Counter(s) == Counter(t)
```
- Counter is a data structure in python which is a hashmap. Basically counts things for you. Could run a counter on both strings.

### Solution with O(1) Memory
- Could set both strings to be in sorted order
	- Time complexity of sorting algorithms
		- [[Bubble sort]] (Time complexity of $n^2$ )
		- A good sorting algorithm could do it in O($nlogn$) time
		- For some reason, interviewers just assume sorting doesn't take extra space
- Then check if strings are equal

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return sorted(s) == sorted(t)
```
- Might need to write your own sorting algorithm
## Approach 1
- Could use [[Counter (Python)]] for python [^3]
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return Counter(s) == Counter(t)
```
- However, this is not exactly a valid approach since [[Anagram|anagrams]] typically don't count spaces [^1] 

## Approach 2 [^3]
- [[Time Complexity]] = $O(n)$
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        # 
        if len(s) != len(t):
            return False    

        counter = {}

        for char in s:
            counter[char] = counter.get(char, 0) + 1

        for char in t:
            if char not in counter or counter[char] == 0:
                return False
            counter[char] -= 1

        return True
```
## References
[^1]: https://icarus.cs.weber.edu/~dab/cs1410/textbook/8.Strings/progexample/anagram.html#:~:text=%22An%20anagram%20is%20a%20word,cases%20(upper%20or%20lower).
[^2]: https://www.youtube.com/watch?v=9UtInBqnCgA
[^3]: https://leetcode.com/problems/valid-anagram/solutions/4410317/video-give-me-5-minutes-4-solutions-how-we-think-about-a-solution/