---
Source:
  - https://leetcode.com/problems/first-missing-positive/
Reviewed: false
tags:
  - in-progress
---
## Synthesis
### Approach 1
```python
class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        # Gets the length of array
        n = len(nums)
        
        for i in range(n):
            while nums[i] > 0 and nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]
        
        for i, num in enumerate(nums):
            if num != i + 1:
                return i + 1
        
        return n + 1
```
- We initially find 
- Example: `[3,4,-1,1]`

## Organize
This solution uses an in-place modification of the input array `nums` to find the first missing positive integer. The core idea is to try and place each number `x` into its "correct" 0-indexed position, which would be `x - 1`.

Here's a breakdown of the solution:

### 1. The Goal
The problem asks us to find the smallest positive integer (i.e., 1, 2, 3, ...) that is not present in the given array `nums`.

### 2. In-Place Swapping (First Loop)
```python
        n = len(nums)
        # Correct slot:
        # nums[i] = i + 1
        # nums[i] - 1 = i
        # nums[nums[i] - 1] = nums[i]
        for i in range(n):
            while nums[i] > 0 and nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]
```
This is the most crucial part. The goal here is to rearrange the array such that if a number `k` (where $1 \le k \le n$) is present in `nums`, it should ideally be placed at index `k - 1`.

Let's break down the `while` loop condition:
-   `nums[i] > 0`: We are only interested in positive integers. Negative numbers and zeros are irrelevant for finding the "first missing *positive*".
-   `nums[i] <= n`: We are only interested in positive integers that *could* potentially fit into an index within the array's bounds (i.e., numbers from 1 to `n`). If `nums[i]` is greater than `n`, it cannot be placed at a valid index `nums[i] - 1` within the current array size, so we ignore it for this placement strategy.
-   `nums[nums[i] - 1] != nums[i]`: This is the condition that triggers a swap. It checks if the number `nums[i]` is *not* already in its correct position.
    -   If `nums[i]` is, say, `3`, its correct 0-indexed position is `3 - 1 = 2`.
    -   The condition `nums[2] != 3` means that the number `3` is not yet at index `2`. If it were, there's no need to swap. This also prevents infinite loops if `nums[i]` is already at `nums[nums[i]-1]` (e.g., `nums = [1, 1]`, `i=0`, `nums[0]=1`, `nums[nums[0]-1]` is `nums[0]`, so `nums[0] != nums[0]` would be false).

The swap operation `nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]` attempts to put `nums[i]` into its correct place (`nums[i] - 1`). The number that was originally at `nums[i] - 1` is moved to `nums[i]`, and the `while` loop continues to process this *new* number at `nums[i]` until it's also in its correct place or falls outside the conditions.

**Example:** `nums = [3, 4, -1, 1]`
-   `n = 4`
-   `i = 0`, `nums[0] = 3`.
    -   `3 > 0`, `3 <= 4`, `nums[3-1]` (i.e., `nums[2]`) is `-1`. `-1 != 3`. So, swap `nums[0]` and `nums[2]`.
    -   `nums` becomes `[-1, 4, 3, 1]`. `nums[0]` is now `-1`.
    -   The `while` loop condition `nums[0] > 0` is now false. Move to `i = 1`.
-   `i = 1`, `nums[1] = 4`.
    -   `4 > 0`, `4 <= 4`, `nums[4-1]` (i.e., `nums[3]`) is `1`. `1 != 4`. So, swap `nums[1]` and `nums[3]`.
    -   `nums` becomes `[-1, 1, 3, 4]`. `nums[1]` is now `1`.
    -   `1 > 0`, `1 <= 4`, `nums[1-1]` (i.e., `nums[0]`) is `-1`. `-1 != 1`. So, swap `nums[1]` and `nums[0]`.
    -   `nums` becomes `[1, -1, 3, 4]`. `nums[1]` is now `-1`.
    -   The `while` loop condition `nums[1] > 0` is now false. Move to `i = 2`.
-   `i = 2`, `nums[2] = 3`.
    -   `3 > 0`, `3 <= 4`, `nums[3-1]` (i.e., `nums[2]`) is `3`. `3 != 3` is false. The `while` loop doesn't execute. Move to `i = 3`.
-   `i = 3`, `nums[3] = 4`.
    -   `4 > 0`, `4 <= 4`, `nums[4-1]` (i.e., `nums[3]`) is `4`. `4 != 4` is false. The `while` loop doesn't execute.

After the first loop, `nums` is `[1, -1, 3, 4]`.

### 3. Finding the First Missing Positive (Second Loop)
```python
        for i, num in enumerate(nums):
            if num != i + 1:
                return i + 1
        
        return n + 1
```
After the first phase, if a number `k` (where $1 \le k \le n$) was present in the original array, it should now be at index `k - 1`. This loop simply iterates through the (potentially modified) array and checks if `nums[i]` is equal to `i + 1`.

-   If `nums[i]` is *not* equal to `i + 1`, it means that `i + 1` is the smallest positive integer that was not found and placed correctly. This is our answer.
    -   Continuing the example `nums = [1, -1, 3, 4]`:
        -   `i = 0`, `num = 1`. `1 == 0 + 1`. No return.
        -   `i = 1`, `num = -1`. `-1 != 1 + 1` (i.e., `-1 != 2`). So, `2` is the first missing positive. Return `2`.

-   If the loop completes without finding any `num != i + 1`, it means that all numbers from 1 to `n` are present in their correct positions (i.e., `nums = [1, 2, 3, ..., n]`). In this case, the first missing positive integer is `n + 1`.

### Time and Space Complexity
-   **Time Complexity: $O(n)$**
    -   The first `for` loop iterates `n` times.
    -   Inside the `for` loop, the `while` loop performs swaps. Crucially, each number is swapped at most once into its correct position. Once a number `k` is placed at index `k-1`, it will not be moved again by subsequent swaps. Therefore, the total number of swaps across all iterations of the outer `for` loop is at most `n`.
    -   The second `for` loop iterates `n` times.
    -   Thus, the overall time complexity is linear, $O(n)$.
-   **Space Complexity: $O(1)$**
    -   The solution modifies the input array in-place and uses only a few extra variables, so it requires constant additional space.

## Source [^1]
```python
class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)

        # Correct slot:
        # nums[i] = i + 1
        # nums[i] - 1 = i
        # nums[nums[i] - 1] = nums[i]
        for i in range(n):
            while nums[i] > 0 and nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]
        
        for i, num in enumerate(nums):
            if num != i + 1:
                return i + 1
        
        return n + 1
```
Time: $O(n)$
Space: $O(1)$

## Source[^2]
- 
## References

[^1]: https://walkccc.me/LeetCode/problems/41/?h=41#__tabbed_1_3
[^2]: [First Missing Positive - Leetcode 41 - Python](https://www.youtube.com/watch?v=8g78yfzMlao)