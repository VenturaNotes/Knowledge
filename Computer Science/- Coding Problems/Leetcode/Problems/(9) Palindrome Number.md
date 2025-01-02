---
Source:
  - https://leetcode.com/problems/palindrome-number
Reviewed: false
---
### My Solution
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0:
            return False
        list1 = []
        while x > 0:
            list1.append(x%10)
            x = math.floor(x/10)
        for i in range(int(len(list1)/2)):
            if list1[i] != list1[-i-1]:
                return False
        return True
```
- Any number less than 0 will not be a palindrome because of the negative sign
- While loop slices integer into a reversed list
- for loop checks the first index and the last index of the list to see if they're equal. If they are, the 2 pointers move inwards until they reach the center. If they are equal throughout, the function will return true. Otherwise false


### [Approach 1: One Line](https://leetcode.com/problems/palindrome-number/solutions/2996838/python-one-line-solution-with-explanation/)
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        return str(x)==str(x)[::-1]
```
- This turns the integer into a string and compares it with the integer turned into a string but reversed. If they're equal, return true. If they're not equal, return false
- Original solution was ```return True if str(x)==str(x)[::-1] else False``` but the True and False were redundant. The above is simplest version of solution
### [Approach 2: Revert half of the number (Official)](https://leetcode.com/problems/palindrome-number/solutions/127661/palindrome-number/)
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0 or (x % 10 == 0 and x != 0):
            return False
        revertedNumber = 0
        while x > revertedNumber:
            revertedNumber = revertedNumber * 10 + x % 10
            x = x//10
        return x == revertedNumber or x == revertedNumber//10
```
- Problems to consider
	- Converting number to string would require non-constant space
	- A reversed number larger than accepted would cause an integer overflow problem
	- Flip the last half of the number
	- All negative numbers are not palindromes
- First if statement checks if number is less than 0 or has a trailing 0 without starting with 0
- First while loop reverses the integer and places it into a different variable until it's equal or greater than x. 
- Returns true if they're equal (takes into account for even and odd # of digits)
- Complexity Analysis
	- Time Complexity: $O(log_{10}(10))$
		- We divided the input by 10 for every iteration
	- Space Complexity: $O(1)$

