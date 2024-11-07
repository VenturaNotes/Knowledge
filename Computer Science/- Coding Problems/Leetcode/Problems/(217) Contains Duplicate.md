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

## References

[^1]: https://www.youtube.com/watch?v=3OamzN90kPg