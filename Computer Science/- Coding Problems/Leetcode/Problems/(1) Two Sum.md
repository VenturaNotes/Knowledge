---
Source:
  - https://leetcode.com/problems/two-sum/
Reviewed: false
Approaches: "1"
---
## Synthesis
- You could use a brute force solution of time complexity $O(n^2)$ where you traverse the entire array twice to check if two of the values in the array sum to the target
	- ![[Screenshot 2025-04-23 at 11.20.01 PM.png]]
		- This uses an inefficient algorithm that runs through the same calculations twice (where 3+2 and 2+ 3 are done).
- One-pass solution is when you iterate through the list and check if there exists a value in the hashmap to add which will equal the target. Otherwise, just insert into hashmap. Time and memory complexity is O(n)
### Hash Map (One Pass) Solution
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Create Dictionary
        prevMap = {} 
        # index, value
        for i, n in enumerate(nums):
            diff = target - n
            if diff in prevMap:
                return [prevMap[diff], i]
            prevMap[n] = i
```
- ![[Screenshot 2025-04-24 at 1.55.54 AM.png]]
	- Steps shown here
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

## Source[^2]
### Problem
- Problem
	- Given an array `nums`, find two indices (`i` and `j`) within the array that sum up to the `target` value.
- Conditions
	- Return the smaller index first
	- `i` $\ne$ `j`
	- There will always be a solution
### (1) Brute Force
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
```
- Time Complexity: $O(n^2)$
- Space Complexity: $O(1)$
- #comment 
	- Looping through the array `nums` with the [[in (python)|in]] keyword.
	- Using the [[range() (Python)|range()]] keyword so that we get the index of the array rather than the value itself
		- Remember to use the length of `nums`
	- Creating a [[Nested Loops|nested loop]] to index elements with a second pointer. `j` always staying 1 step ahead of `i` ensuring all possible calculations without repeats, guaranteeing $i == j$ and that smaller index will be returned first
	- No issue with `range(i+1,...)` because an out of bounds error will not occur even if out of bounds
### (2) Sorting
#comment Comments made by me and ChatGPT
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Saves index, element
        A = []
        for i, num in enumerate(nums):
            A.append([num, i])

		# Sort list in ascending order
        A.sort()

		# Two-Pointer Technique (i = beginning, j = end)
        i, j = 0, len(nums) - 1

		# Iterate until left pointer >= right pointer
        while i < j:
	        # Calculate sum of pointers
            cur = A[i][0] + A[j][0]

			# If sum is equal, return minimum value
            if cur == target:
                return [min(A[i][1], A[j][1]), 
                        max(A[i][1], A[j][1])]
            elif cur < target:
                i += 1 # Increasing left pointer to get greater value
            else:
                j -= 1 # Increasing right pointer to get greater value
```
- Time Complexity: $O(nlogn)$
	- #comment $O(nlogn)$ for sorting and $O(n)$ for two-pointer traversal
		- Probably closer to $O(\frac {n}{2})$ for two-pointer traversal since 
- Space Complexity: $O(n)$
	- #comment To store values in helper list `A`
- #comment Summary
	- (1) Store index and value pairs within list
	- (2) Sort this array
	- (3) Use two-pointer technique (pointers start at ends of array)
		- Calculate sum and check if equal
		- Return lowest index or 
			- if sum < target: increase left pointer
			- if sum > target: increase right pointer
#### #comment Partial Explanation
- Using [[two pointer technique|two-pointer approach]] after sorting input with indices
```python
A = []
for i, num in enumerate(nums):
    A.append([num, i])
```
- Creates a list containing pairs `[number, original index]` to keep track of indices
	- So `nums = [3, 1, 4, 2]` becomes `[[3, 0], [1, 1], [4, 2], [2, 3]]`
- A.[[sort() (python)|sort()]]
	- This method sorts
- `i` starts at beginning of list and `j` starts at end of list

### (3) Hash Map (Two Pass)
#comment comments made by me and ChatGPT
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # creating dictionary
        indices = {}  # val -> index

		# Creating key, value pairs where
		# key is the element and value is the index
		# i is the index and n is the element
        for i, n in enumerate(nums):
            indices[n] = i

		# Iterates through nums by index and element
        for i, n in enumerate(nums):
            diff = target - n
            # The 'if diff in indices' is done in O(1) time
            if diff in indices and indices[diff] != i:
                return [i, indices[diff]]
```
- Time Complexity: $O(n)$
	- #comment Explanation
		- $O(n)$ to populate dictionary
		- $O(n)$ to check complement
		- so $O(n)$ total
- Space Complexity: $O(n)$
	- #comment Dictionary required $O(n)$ space to store all elements in the array
- #comment Summary
	- (1) Create dictionary
	- (2) Enumerate list to store as key value pairs in dictionary
	- (3) Enumerate list to find complement
		- For example, lets say the target is 10 and the value `n` is `6`
			- So `diff = 10 - 6 = 4`
		- Then we check if `4` in the dictionary and not equal to `i`
			- If true, we return the loop's `i` first and then the index from `indices`
			- The loop's `i` will always be first because we are starting from index 0 so there can't be a number greater as we're checking the first ones first. 

#### #comment Partial Explanation
- Solution uses a [[HashMap (python)|hash map]] ([[dictionary (Python)|dictionary]] in python) to efficiently find the complement of the current number in array
- Given `nums = [2, 7, 11, 15]`
	- First enumeration gives `indices = {2: 0, 7: 1, 11: 2, 15: 3}`

### (4) Hash Map (One Pass)
#comment Comments made by me and ChatGPT
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Dictionary
        prevMap = {}  # val -> index

		# iterate through nums
        for i, n in enumerate(nums):
	        # Check for complement
            diff = target - n
            # If complement in dictionary
            if diff in prevMap:
	            # return dictioanry first, then loop index
	            # (first iteration will never work here)
                return [prevMap[diff], i]
			# Add element to dictionary
            prevMap[n] = i
```
- Time Complexity: $O(n)$
	- #comment Explanation
		- Only loop over `nums` once, so $O(n)$
		- Dictionary operations (lookup and insertion) are $O(1)$ on average
- Space Complexity: $O(n)$ 
	- #comment Dictionary requires $O(n)$ space to store all elements in worst case
- #comment Summary
	- (1) Create dictionary
	- (2) Enumerate through `nums` by checking complement, seeing if it's in dictionary (if so return), and if not, add element to dictionary
		- No need to check if index duplicate as only iterating through list once.
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

### Approach 1: Brute Force [^3]
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

### Approach 2: Two-pass Hash Table [^4]
- There is no "two pass" hash table. It just means their "two pass" hash table is really "a hash table used twice for the solution" [^5]
	- This doesn't mean either that the last for loop only loops twice. Given an example problem such as `[1, 2, 3, 4, 5, 6, 7]` with `target = 13`, it loops 6 times. 
	- It seems like 2 pass just means we iterate once through the list to add the key-value pairs and we iterate a second time to find the complement within the hash map. $O(2n)$ 
- [[Hash Table]]: Best way to maintain a mapping of each element in the array to its index.
	- Reduces lookup time from $O(n)$ to $O(1)$
		- Trading space for speed
	- Supports fast lookup in near constant time. 
		- If a collision occurred, a lookup could degenerate to O(n)
		- However, it should be amortized $O(1)$ as long as hash function chosen carefully
			- Amortized time is the way to express the time complexity when an algorithm has the very bad time complexity only once in a while besides the time complexity that happens most of time. [^6]
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
- The -> in the function above marks the return function annotation. [^7]
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
### Approach 3: One-pass Hash Table [^8]
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
[^2]: https://neetcode.io/solutions/two-sum
[^3]: https://leetcode.com/problems/two-sum/editorial/
[^4]: https://leetcode.com/problems/two-sum/solutions/127810/two-sum/
[^5]: https://stackoverflow.com/questions/65085114/what-is-2-pass-and-1-pass-hash-table#:~:text=Since%20their%20%22better%20solution%22%20stores,this%20answer%20to%20receive%20notifications
[^6]: https://medium.com/@satorusasozaki/amortized-time-in-the-time-complexity-of-an-algorithm-6dd9a5d38045
[^7]: https://stackoverflow.com/questions/14379753/what-does-mean-in-python-function-definitions
[^8]: https://leetcode.com/problems/two-sum/solutions/127810/two-sum/