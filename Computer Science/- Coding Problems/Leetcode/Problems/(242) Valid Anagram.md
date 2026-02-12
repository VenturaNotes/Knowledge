---
Source:
  - https://leetcode.com/problems/valid-anagram/
Reviewed: false
Approaches: "1"
---
## Synthesis
- This is an arrays & hashing type problem
- To find if two strings are an anagram
	- Solution with space and time complexity: O(s + t)
		- If the string lengths are not equal, return False
		- Otherwise, create a hashmap of both strings to count character occurrence. Then check if the hashmaps are equal or not (could iterate though them as well)
	- Solution with space complexity O(1)
		- Sort both strings
			- Best sorting algorithms have time complexity of O(nlogn)
		- Check if they're equal
### Hash Table Solution
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        #Compares Length of both strings
        if len(s) != len(t):
            return False

		#Creates a dictionary
        countS, countT = {}, {}

		#Loops through each element in string
        for i in range(len(s)):
	        #Retrieves the value from the key and adds 1
            countS[s[i]] = 1 + countS.get(s[i], 0)
            countT[t[i]] = 1 + countT.get(t[i], 0)

		# Checks if dictionaries the same
        return countS == countT
```
## Source[^1]
- [[Anagram]]: A word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once
## Source [^2]
- ![[(242) Valid Anagram 2026-02-11 02.16.09.excalidraw]]
- [[HashMap (python)|hashmap]]
	- This is an arrays and hashing type problem
- Problem: We want to return `true` if two strings are an anagram of each other and false otherwise.
- [[Anagram]]
	- "rat" and "car" not anagrams because even though they contain the same number of characters, "rat" has a "t" while "car" has a "c"
### First Approach
- Want to count the occurrences of each character in both strings
	- Could use an [[array]] or a [[HashMap (python)|hashmap]]
		- hash map
			- Will have 2 hash maps (one for each string)
			- [[Key value]] in hash map is going to be the character in String S
				- The [[key]] is going to be the character
				- The [[value]] is going to be the count
			- Once we built the hash maps, we can then go through the keys and compare that the counts for each character are the exact same.
				- Just going to iterate through the keys of one of them (and make sure value of each key is the same)
				- If we make sure that each string is the same length, then we just need to iterate through one of the hash maps when comparing it to the other hash map
			- Time Complexity (S + T)
				- Need to iterate through both strings
			- Memory Complexity (S + T)
				- Hash maps of size S + T
			- Downside of solution is that we'll need some extra memory
			- `countS[s[i]] = 1 + countS.get(s[i], 0)`
				- This code adds `1` to character count. If it does not exist, it starts with `0` and adds the `1` to equal 1.
			- The second solution we'll see will solve this memory problem

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
- Complexity (s and t are length string)
	- Time Complexity: O(s + t)
	- Space Complexity: O (s + t)
		- Because we build a hashmap of this size
- #comment Below is an improvement. You could replace the first block of code with the second block
```python
# Old
for c in countS:
	if countS[c] != countT.get(c, 0):
		return False
		
# New
if countS != countT:
	return False
# This is because both hashmaps should be identical
```

- The code below is basically the code written previously but sort of cheating (but does seem to perform better on LeetCode which isn't exactly the best metric to use)
```python
from collections import Counter

class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return Counter(s) == Counter(t)
```
- Counter is a data structure in python which is a hashmap. Basically counts things for you. Could run a counter on both strings.
### Second Approach in O(1) Memory
- Could set both strings to be in sorted order
	- Time complexity of sorting algorithms
		- [[Bubble sort]] (Time complexity of $n^2$ )
		- A good sorting algorithm could do it in O($nlogn$) time
			- The space complexity for sorting algorithms can be iffy. Usually good ones have a space complexity of $O(n)$ but sometimes they don't and just run on constant extra memory $O(1)$
			- For some reason though, interviewers just assume sorting doesn't take extra space. Might be a good thing to discuss with interviewer beforehand
- So sort it and then check if strings equal

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return sorted(s) == sorted(t)
```
- Might need to write your own sorting algorithm
## Source [^3]
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
- Could use [[Counter (Python)|Counter]] class within `collections` module
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return Counter(s) == Counter(t)
```
- However, this is not exactly a valid approach since [[Anagram|anagrams]] typically don't count spaces [^1] 

## Source[^4]
Compare two strings and return true if [[Anagram|anagrams]], false otherwise
### (1) Sorting
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
            
        return sorted(s) == sorted(t)
```
- Time Complexity: $O(nlogn + mlogm)$
- Space Complexity: $O(1)$ or $O(n+m)$ depending on the sorting algorithm
- Where `n` is the length of string `s` and `m` is the length of string `t`
- #comment 
	- If both strings are not equal, return false because an anagram must have the same number of characters
		- Otherwise, use the sorted method sort them and see if the characters all match
			- It is possible to just have `return sorted(s) == sorted(t)` as the final solution

### (2) Hash Table
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False

        countS, countT = {}, {}

        for i in range(len(s)):
            countS[s[i]] = 1 + countS.get(s[i], 0)
            countT[t[i]] = 1 + countT.get(t[i], 0)
        return countS == countT
```
- Time Complexity: $O(n + m)$
- Space Complexity: $O(1)$ since we have at most 26 different characters
	- #comment So it has a space complexity of $O(26)$ but simplified is $O(1)$ 
- Where `n` is the length of string `s` and `m` is the length of string `t`
- #comment 
	- If string length not equal, they're not anagrams
	- Creating empty dictionaries
	- Looping first string (Length of `s` and `t` guaranteed to be equal due to initial check)
		- For `countS`, setting initial character of `s` as a key and setting value to the number of occurrences
			- If there were no initial occurrences, sets default value to 0 + 1 = 1
		- Same goes for `countT`
	- Returns if both dictionaries are equal making them anagrams
	- Potential reason for why time complexity is $O(n + m)$ 
		- #comment Information
			- For `if len(s) != len(t):`, the time complexity is O(1) since checking the length of two strings is a constant-time operation because Python strings store their length as [[metadata]]
			- Initializing [[dictionary (Python)|dictionaries]] is also a constant time operation 
			- The for loop runs `n` iterations where `n` is the length of `s`
				- Dictionary lookups and updates are average-case `O(1)`
			- The `return countS == CountT` has a time complexity of `O(n)` where `n` is the number of unique characters
		- So because of the for loop and dictionary comparison, the time complexity would be $O(2n)$ unsimplified but still $O(n)$ overall for worst case complexity.  

### (3) Hash Table (Optimal)
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False

        count = [0] * 26
        for i in range(len(s)):
            count[ord(s[i]) - ord('a')] += 1
            count[ord(t[i]) - ord('a')] -= 1

        for val in count:
            if val != 0:
                return False
        return True
```
- Time complexity: $O(n+m)$
- Space Complexity: $O(1)$ since we have at most 26 different characters
- Where `n` is the length of string `s` and `m` is the length of string `t`
- #comment 
	- This solution is more optimized because
		- #comment The fix-size array is more space-efficient compared to dictionaries that grow dynamically with the number of unique characters
	- Creates an array of size 26 and increments each index by 1 to represent the lowercase letters `a-z` with the [[ord() (python)|ord()]] method
		- So `z` would increment and decrement index 25 by 1
	- Then loops through `count` to check if all values are zero (which they should be since strings that are anagrams have the same character count)

## References
[^1]: https://icarus.cs.weber.edu/~dab/cs1410/textbook/8.Strings/progexample/anagram.html#:~:text=%22An%20anagram%20is%20a%20word,cases%20(upper%20or%20lower).
[^2]: [Valid Anagram - Leetcode 242 - Python](https://www.youtube.com/watch?v=9UtInBqnCgA)
[^3]: https://leetcode.com/problems/valid-anagram/solutions/4410317/video-give-me-5-minutes-4-solutions-how-we-think-about-a-solution/
[^4]: https://neetcode.io/solutions/valid-anagram
