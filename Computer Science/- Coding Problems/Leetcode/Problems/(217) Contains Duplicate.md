[Source](https://leetcode.com/problems/contains-duplicate/)
## Approach #1
Brute Force Solution (Time Limit Exceeded Error)
```python
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
    
        count = 0
        count2 = 0
        for i in nums:
            for j in nums:
                if (i == j and count != count2):
                    return True
                count2+=1
            count+= 1
            count2 = 0
        return False

```
Time: $O(n^2)$
Space: $O(1)$

## Approach #2
Sorting Array and then comparing every adjacent element in list:
```python
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:  
        def merge_sort(arr):
            if len(arr) > 1:
                left_arr = arr[:len(arr)//2]
                right_arr = arr[len(arr)//2:]
                
                merge_sort(left_arr)
                merge_sort(right_arr)
                
                i = j = k = 0
                
                while i < len(left_arr) and j < len(right_arr):
                    if left_arr[i] < right_arr[j]:
                        arr[k] = left_arr[i]
                        i+=1
                    else:
                        arr[k] = right_arr[j]
                        j+=1
                    k += 1
                        
                while i < len(left_arr):
                    arr[k] = left_arr[i]
                    i+=1
                    k+=1
                
                while j < len(right_arr):
                    arr[k] = right_arr[j]
                    j+=1
                    k+=1
        
        merge_sort(nums)
        for i in range(len(nums)):
            if i < len(nums) - 1:
                if nums[i] == nums[i+1]:
                    return True
        return False
```
Time: $O(nlogn)$
Space: $O(1)$ (not including auxiliary space for sorting which is $O(n)$)

## Approach #3
Using a [[HashSet]] to solve problem

### Solution #1
- Video reference [^1]
```python
hashset = set()

for n in nums:
	if n in hashset:
		return True
	hashset.add(n)
return False

```
Time: $O(n)$
Space: $O(n)$

### Solution #2 (Shortest Solution)
```python
return len(nums) != len(set(nums))
```

## Source [^2]
### Brute Force
```python
class Solution:
    def hasDuplicate(self, nums: List[int]) -> bool:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] == nums[j]:
                    return True
        return False
```
- Time Complexity: $O(n^2)$
- Space Complexity: $O(1)$
- Explanation
	- Let's say `nums = [1, 2, 3, 3]`. Then `range(len(nums))` will take the length of `nums` which equals 4 and then will iterate from 0 inclusively and 4 exclusively.
		- Great way of getting the index of a number within the array
	- `for j in range(i + 1, len(nums)):`
		- j can always be in front of `i` to reduce comparisons with each element before it
#### Print Example
```python
def hasDuplicate(nums) -> bool:
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
            print("i = "+ str(i) + ", j = "+str(j) + ", nums[i] = "+str(nums[i]) + ", nums[j] = " +str(nums[j]))
    return False

nums = [1, 2, 3, 3]
print(hasDuplicate(nums))
```
Explanation:
```
i = 0, j = 1, nums[i] = 1, nums[j] = 2
i = 0, j = 2, nums[i] = 1, nums[j] = 3
i = 0, j = 3, nums[i] = 1, nums[j] = 3
i = 1, j = 2, nums[i] = 2, nums[j] = 3
i = 1, j = 3, nums[i] = 2, nums[j] = 3
True
```

### Sorting
```python
class Solution:
    def hasDuplicate(self, nums: List[int]) -> bool:
        nums.sort()
        for i in range(1, len(nums)):
            if nums[i] == nums[i - 1]:
                return True
        return False
```
- Time Complexity: $O(nlogn)$
	- #comment [[Merge sort]] is $O(nlogn)$ 
- Space Complexity: $O(1) \text{ or } O(n)$ depending on sorting algorithm
	- #comment this might be because the sorting algorithm may make a temporary copy of the list? 
- #comment Explanation
	- Sorting the list first
	- Then we just check adjacent numbers in the list if they're equal. Possible because duplicate numbers would be guaranteed next to each other
	- A index error is avoided by doing `range(1, len(nums))`
		- If `nums = [42]`, then the range would equal `(1, 1)` which would be an empty range so the for loop is skipped. An array with a single element will always not have a duplicate
### Hash Set
```python
class Solution:
    def hasDuplicate(self, nums: List[int]) -> bool:
        seen = set()
        for num in nums:
            if num in seen:
                return True
            seen.add(num)
        return False
```
- Time Complexity: $O(n)$
- Space Complexity: $O(n)$
- #comment Explanation
	- The set data structure is implemented as a hash table[^3]
		- Checking membership in a [[set]] is considered O(1) on average
		- If there are many [[hash collisions]], lookup time can degrade to O(n) but Python has mechanisms such as [[chaining]] or [[open addressing]] 

### Hash Set Length
```python
class Solution:
    def hasDuplicate(self, nums: List[int]) -> bool:
        return len(set(nums)) < len(nums)
```
- Time Complexity: $O(n)$
- Space Complexity: $O(n)$
- #comment Explanation
	- If the length of the set of the `nums` array is less, that means there was a duplicate in the `nums` array. This is because a set only contains unique elements

## References

[^1]: https://www.youtube.com/watch?v=3OamzN90kPg
[^2]: https://neetcode.io/solutions/contains-duplicate
[^3]: ChatGPT
