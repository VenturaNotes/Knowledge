---
Source:
  - https://leetcode.com/problems/remove-element/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        while val in nums:
            nums.remove(val)
        return len(nums)
```
- I know space complexity: $O(1)$ 
- #question What is the time complexity? 
	- Is it $O(n)$ because you might need to remove all elements in the list but at least you can access each value in $O(1)$ time because it's stored as a hash value?
- Some people suggest that using the `remove` method beats the purpose of the exercise[^1]
### Alternative Solution[^2]
```python
class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        index = 0
        for i in range(len(nums)):
            if nums[i] != val:
                nums[index] = nums[i]
                index += 1
        return index
```

## Source [^3]
- 
## References

[^1]: https://leetcode.com/problems/remove-element/solutions/12584/6-line-python-solution-48-ms/comments/514928/
[^2]: https://leetcode.com/problems/remove-element/solutions/3670940/best-100-c-java-python-beginner-friendly/?envType=study-plan-v2&envId=top-interview-150
[^3]: [(27) Remove Element](https://www.youtube.com/watch?v=Pcd1ii9P9ZI)