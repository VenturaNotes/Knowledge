---
Source:
  - https://leetcode.com/problems/counting-bits/
Reviewed: false
tags:
  - in-progress
---
## Synthesis
- ![[(338) Counting Bits 2026-08-10 17.30.03.excalidraw]]
- [ ] How can I do this in linear time the problem? What is the optimal solution?
### Approach 1
```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        myList = []
        for i in range(n+1):
            countOne = 0
            while i > 0:
                if i % 2 == 1:
                    countOne +=1
                i //=2
            myList.append(countOne)
        return myList
```
- $O(nlogn)$ time

### Approach 2 - Right Shift / Integer Division (DP)
- We can use dynamic programming to solve this approach in linear time by reusing bit counts of smaller numbers that we've already computed. 
### Method 1: Right Shift / Integer Division (DP)

Notice the relationship between a number $i$ and $i // 2$ (or $i \gg 1$):

- Hey, could you explain to me what `i >> 1` does in python and give a simple example? And what topic does the `>>` fall under and what is it called?
[1]
### 1. What does i >> 1 do?

In Python, i >> 1 shifts the binary bits of the integer i to the **right by 1 position**.

In practical mathematical terms, shifting a number to the right by 1 bit is equivalent to **integer division by 2** (floor division, or i // 2). The rightmost bit is dropped/discarded.
### 2. Topic and Name
- **Topic:** **Bitwise Operations** (or Bitwise Operators).
- **Operator Name:** The **Bitwise Right Shift** operator (often simply called the **Right Shift** operator).

---

### 3. Simple Example

#### Example 1: Even Number

code Python

downloadcontent_copy

expand_less

`i = 10 result = i >> 1  print(result)  # Output: 5`

**How it works behind the scenes (in binary):**
- 10 in binary is 1010.
- Shifting 1010 to the right by 1 position drops the last 0, giving 101.
- 101 in binary equals **5** in decimal.

---
#### Example 2: Odd Number

code Python

downloadcontent_copy

expand_less

`i = 9 result = i >> 1  print(result)  # Output: 4`

**How it works behind the scenes (in binary):**
- 9 in binary is 1001.
- Shifting 1001 to the right by 1 position drops the last 1, leaving 100.
- 100 in binary equals **4** in decimal (since 9 // 2 = 4).

---

### Summary Checklist
- **i >> 1**: Shifts bits right by 1 position (effectively i // 2).
- **i >> n**: Shifts bits right by n positions (effectively i // (2**n)).
[/1]


* Shifting a number right by 1 bit (`i >> 1`) removes its last (least significant) bit.
* The number of 1s in $i$ is equal to:
  $$\text{count}(i) = \text{count}(i // 2) + (\text{last bit of } i)$$

Since $i // 2$ is always smaller than $i$, its result will already be stored in our array!

#### Python Implementation:

```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        ans = [0] * (n + 1)
        for i in range(1, n + 1):
            # ans[i >> 1] gets count for i // 2
            # (i & 1) checks if the last bit is 1 (equivalent to i % 2)
            ans[i] = ans[i >> 1] + (i & 1)
        return ans
```

* **Time Complexity:** $O(n)$ — We iterate from $1$ to $n$ exactly once, doing $O(1)$ work per number.
* **Space Complexity:** $O(1)$ auxiliary space (excluding the output array).

---

### Method 2: Drop the Rightmost Set Bit (`i & (i - 1)`)

There is a famous bit manipulation trick: **`i & (i - 1)` always clears the lowest (rightmost) set bit (`1`) of $i$.**

For example:
* $i = 12$ (`1100` in binary)
* $i - 1 = 11$ (`1011` in binary)
* $i \ \& \ (i - 1) = 8$ (`1000` in binary) — Notice the last `1` is turned into `0`.

Since `i & (i - 1)` removes exactly **one** set bit and produces a smaller number, the number of 1s in $i$ is simply **1 plus the number of 1s in `i & (i - 1)`**.

#### Python Implementation:

```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        ans = [0] * (n + 1)
        for i in range(1, n + 1):
            ans[i] = ans[i & (i - 1)] + 1
        return ans
```

* **Time Complexity:** $O(n)$
* **Space Complexity:** $O(1)$ auxiliary space.

---

### Summary of Improvements

| Solution | Time Complexity | How it Works |
| :--- | :--- | :--- |
| **Your Original** | $O(n \log n)$ | Counts bits from scratch for every $i$ via repetitive division by 2. |
| **Method 1 (Right Shift)** | $O(n)$ | Reuses the result of $i // 2$ and checks if $i$ is odd/even. |
| **Method 2 (`i & (i - 1)`)** | $O(n)$ | Reuses the result of turning off $i$'s rightmost `1` bit. |

Method 1 and Method 2 are both single-pass solutions that run in linear time. Method 2 is often considered the most elegant bit manipulation approach on LeetCode!

## Source [^1]
- ![[Screenshot 2024-12-08 at 9.42.17 PM.png]]
- Brute force way to solve this problem is $nlogn$ 
	- For any integer $n$, how many times can you divide it by 2? It's just $log_2n$. We're doing this for a bunch of integers (up to $n$) so we get the time complexity: $nlogn$ 
- There is some repeated work that we can eliminate that we can easily recognize when drawing out the bit mappings (the binary representations of a bunch of integers)
	- For that repeated work, we can get an $O(n)$ solution.
- This is a [[dynamic programming]] problem
- The offset is going to be the most significant that we have reached so for. The most significant bits are
	- `[1, 2, 4, 8, 16]`
		- Basically double size every single time
		- We know a bit is just a power of 2. That's what binary represents
```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        dp = [0] * (n+1)
        ans = [0]
        offset = 1

        for i in range(1, n + 1):
            if offset * 2 == i:
                offset = i
            dp[i] = 1 + dp[i - offset]
        return dp
```
## Source[^2]
### (1) Bit Manipulation - I
```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        res = []
        for num in range(n + 1):
            one = 0
            for i in range(32):
                if num & (1 << i):
                    one += 1
            res.append(one)
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (2) Bit Manipulation - II
```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        res = [0] * (n + 1)
        for i in range(1, n + 1):
            num = i
            while num != 0:
                res[i] += 1
                num &= (num - 1)
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (3) In-Built Function
```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        return [bin(i).count('1') for i in range(n + 1)]
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (4) Bit Manipulation (DP)
```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        dp = [0] * (n + 1)
        offset = 1

        for i in range(1, n + 1):
            if offset * 2 == i:
                offset = i
            dp[i] = 1 + dp[i - offset]
        return dp
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (5) Bit Manipulation (Optimal)
```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        dp = [0] * (n + 1)
        for i in range(n + 1):
            dp[i] = dp[i >> 1] + (i & 1)
        return dp
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: [Counting Bits - Dynamic Programming - Leetcode 338 - Python](https://www.youtube.com/watch?v=RyBM56RIWrM)
[^2]: https://neetcode.io/solutions/counting-bits