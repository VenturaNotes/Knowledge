---
Source:
  - https://leetcode.com/problems/two-sum/
---
## Synthesis
- You could use a brute force solution of time complexity $O(n^2)$ where you traverse the entire array twice to check if two of the values in the array sum to the target
- One-pass solution is when you iterate through the array and check if there exists a value in the hashmap to add which will equal the target. Otherwise, just insert into hashmap. Time and memory complexity is O(n)
## Source [^1]
- Brute force solution is $O(n^2)$
	- Example: Given 2153
		- First you'd check if any numbers following 2 would add up to target
		- Then you'd check if any numbers following 1 would add up to target
		- Continue until indices found or searched through entire array
- [[One-pass solution]]
	- Create a hashmap of every value of input array. Then we could instantly check if a value exists
		- Given the [[array (python)|array]] `[2, 7, 11, 15]` and target 15
			- If we have the number 2, we know 15 - 2 is 13. Then we just want to look for "13" in hashmap
	- ![[Screenshot 2024-05-28 at 3.23.16 PM.png]]
		- Could keep hashmap initially empty and then could iterate through array in one-pass
			- Starting at index 0 of array, we check if there is a number 
	- Complexity
		- Time: O(n)
			- Only iterating through array once
			- Adding value to hashmap is a constant time operation
			- Checking if value exists in hashmap is a constant time operation
		- Memory: O(n)
			- Might need to add every value to hashmap from array

```python
class Solution(object):
    def twoSum(self, nums, target):
        prevMap = {} #val : index

        for i, n in enumerate(nums):
            diff = target - n
            if diff in prevMap:
                return [prevMap[diff], i]
            prevMap[n] = i
```
- Guarantees a solution to return
- [[enumerate() (Python)|enumerate]]
## Others
### My Solution
Brute Force Solution
Produces: Time Limit Exceeded
Approach 1: Brute Force

<mark style="background: #FF5582A6;">My Brute Force Method:  Time Limit Exceeded</mark>
``` python
class Solution(object):
    def twoSum(self, nums, target):
        
        count1 = -1
        count2 = -1
        
        for i in nums:
            count1+=1
            for j in nums:
                count2+=1
                if count1 != count2 and i + j == target:
                    return [count1,count2]
            count2 = -1
```

### Approach 1: Brute Force [^2]
Algorithm
```java
class Solution(object):
    def twoSum(self, nums, target):
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[j] == target - nums[i]:
                    return [i, j]
```
- Time Complexity: $O(n^2)$
- Space Complexity: $O(1)$
	- New memory is not allocated
- Loop through each element $x$ and find if there is another value that equals to $target-x$. The reason this does not result in a "Time Limit Exceeded" error is because the range your continuing from is (i+j).

### Approach 2: Two-pass Hash Table [^3]
- There is no "two pass" hash table. It just means their "two pass" hash table is really "a hash table used twice for the solution" [^4]
	- This doesn't mean either that the last for loop only loops twice. Given an example problem such as `[1, 2, 3, 4, 5, 6, 7]` with `target = 13`, it loops 6 times. 
	- It seems like 2 pass just means we iterate once through the list to add the key-value pairs and we iterate a second time to find the complement within the hash map. $O(2n)$ 
- [[Hash Table]]: Best way to maintain a mapping of each element in the array to its index.
	- Reduces lookup time from $O(n)$ to $O(1)$
		- Trading space for speed
	- Supports fast lookup in near constant time. 
		- If a collision occurred, a lookup could degenerate to O(n)
		- However, it should be amortized $O(1)$ as long as hash function chosen carefully
			- Amortized time is the way to express the time complexity when an algorithm has the very bad time complexity only once in a while besides the time complexity that happens most of time. [^5]
		- It is amortized $O(1)$ because each number in the array is unique so the space being placed in the HashMap is always available (no collisions will occur)
- Algorithm in Python
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hashmap = {}
        #Iterates once through the list 
        for i in range(len(nums)):
            hashmap[nums[i]] = i
        #Iterates again to retrieve the complement
        for i in range(len(nums)):
            complement = target - nums[i]
            if complement in hashmap and hashmap[complement] != i:
		        #The answer can be returned in any order so it doesn't
			        # matter what is returned first
                return [i, hashmap[complement]] 
```
- The -> in the function above marks the return function annotation. [^6]
- In order to test the code above
```python
test = Solution()
myList = [3,2,4]
print(test.twoSum(myList,6))
```
- When doing `if complement in hashmap`, python creates a hash map from the dictionary so that it has O(1) lookup time.
- Complexity Analysis
	- Time Complexity: $O(n)$ 
	- Space Complexity: $O(n)$ 

### Approach 3: One-pass Hash Table [^7]
- We only need to traverse the list once by inserting elements into the hash table and checking if the current element's compliment already exists
- Python Solution
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hashmap = {}
        for i in range(len(nums)):
            complement = target - nums[i]
            if complement in hashmap:
                return [i, hashmap[complement]]
            hashmap[nums[i]] = i
```
- Complexity Analysis
	- Time Complexity:$O(n)$
	- Space Complexity: $O(n)$ 
## References

[^1]: https://www.youtube.com/watch?v=KLlXCFG5TnA
[^2]: https://leetcode.com/problems/two-sum/editorial/
[^3]: https://leetcode.com/problems/two-sum/solutions/127810/two-sum/
[^4]: https://stackoverflow.com/questions/65085114/what-is-2-pass-and-1-pass-hash-table#:~:text=Since%20their%20%22better%20solution%22%20stores,this%20answer%20to%20receive%20notifications
[^5]: https://medium.com/@satorusasozaki/amortized-time-in-the-time-complexity-of-an-algorithm-6dd9a5d38045
[^6]: https://stackoverflow.com/questions/14379753/what-does-mean-in-python-function-definitions
[^7]: https://leetcode.com/problems/two-sum/solutions/127810/two-sum/