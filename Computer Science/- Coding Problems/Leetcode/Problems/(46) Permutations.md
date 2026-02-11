---
Source:
  - https://leetcode.com/problems/permutations/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 9.03.33 PM.png]]
- Return all [[Permutation|permutations]] of an array of distinct integers
- Can draw a [[decision tree]]
- Use idea of subproblems to solve it
- Will still use recursion but not branch anywhere
```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        if len(nums) == 0:
            return [[]]
        perms = self.permute(nums[1:])
        res = []
        for p in perms:
            for i in range(len(p) + 1):
                p_copy = p.copy()
                p_copy.insert(i, nums[0])
                res.append(p_copy)

        return res
```
- Overall time complexity is $n! * n^2$ although the dominating factor of this [[time complexity]] is $O(n!)$
	- When inserting n elements into each permutation, we'll have $n^2$ 
	- If we have have to find permutations for 3 elements, it will be $3*2*1 = 6$ 
		- This is just a math equation called $n!$ 
- Space complexity if not counting output which is $n*n!$ because each permutation is going to be of length `n` and we'll have $n!$ of them
	- If just counting extra space, it will be still $n!*n$ because we have multiple copies of it
- It's possible to solve this problem without recursion
	- Pretty much as efficient in terms of Big O
```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        perms = [[]]
        for n in nums:
            new_perms = []
            for p in perms:
                for i in range(len(p) + 1):
                    p_copy = p.copy()
                    p_copy.insert(i, n)
                    new_perms.append(p_copy)
            perms = new_perms
        return perms
```
## Source[^2]
### (1) Recursion
```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        if len(nums) == 0:
            return [[]]
        
        perms = self.permute(nums[1:])
        res = []
        for p in perms:
            for i in range(len(p) + 1):
                p_copy = p.copy()
                p_copy.insert(i, nums[0])
                res.append(p_copy)
        return res
```
Time Complexity: $O(n!*n^2)$
Space Complexity: $O(n!*n)$ for the output list

### (2) Iteration
```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        perms = [[]]
        for num in nums:
            new_perms = []
            for p in perms:
                for i in range(len(p) + 1):
                    p_copy = p.copy()
                    p_copy.insert(i, num)
                    new_perms.append(p_copy)
            perms = new_perms
        return perms
```
Time Complexity: $O(n!*n^2)$
Space Complexity: $O(n!*n)$ for the output list

### (3) Backtracking
```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        self.res = []
        self.backtrack([], nums, [False] * len(nums))
        return self.res

    def backtrack(self, perm: List[int], nums: List[int], pick: List[bool]):
        if len(perm) == len(nums):
            self.res.append(perm[:])
            return
        for i in range(len(nums)):
            if not pick[i]:
                perm.append(nums[i])
                pick[i] = True
                self.backtrack(perm, nums, pick)
                perm.pop()
                pick[i] = False
```
Time Complexity: $O(n!*n)$
Space Complexity: $O(n!*n)$ for the output list

### (4) Backtracking (Bit Mask)
```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        self.res = []
        self.backtrack([], nums, 0)
        return self.res

    def backtrack(self, perm: List[int], nums: List[int], mask: int):
        if len(perm) == len(nums):
            self.res.append(perm[:])
            return
        for i in range(len(nums)):
            if not (mask & (1 << i)):
                perm.append(nums[i])
                self.backtrack(perm, nums, mask | (1 << i))
                perm.pop()
```
Time Complexity: $O(n!*n)$
Space Complexity: $O(n!*n)$ for the output list

### (5) Backtracking (Optimal)
```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        self.res = []
        self.backtrack(nums, 0)
        return self.res

    def backtrack(self, nums: List[int], idx: int):
        if idx == len(nums):
            self.res.append(nums[:])
            return
        for i in range(idx, len(nums)):
            nums[idx], nums[i] = nums[i], nums[idx]
            self.backtrack(nums, idx + 1)
            nums[idx], nums[i] = nums[i], nums[idx]
```
Time Complexity: $O(n!*n)$
Space Complexity: $O(n!*n)$ for the output list
## Source[^3]
- 
## References

[^1]: [Permutations - Leetcode 46 - Python](https://www.youtube.com/watch?v=FZe0UqISmUw)
[^2]: https://neetcode.io/solutions/permutations
[^3]: [Backtracking: Permutations - Leetcode 46 - Python](https://www.youtube.com/watch?v=s7AvT7cGdSo)