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
## References

[^1]: https://www.youtube.com/watch?v=FZe0UqISmUw