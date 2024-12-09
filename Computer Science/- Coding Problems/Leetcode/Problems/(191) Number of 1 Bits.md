---
Source:
  - https://leetcode.com/problems/number-of-1-bits/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-08 at 9.32.55 PM.png]]
- Write a function that takes an unsigned integer and returns the number of `1` bits it has (also known as the [[Hamming weight]])
- Could & the bits or mod it
	- #question what is meant by "&"ing? 
- Can shift the bits to the right by one.
	- Luckily, most languages can natively support this and it's an efficient [[Central Processing Unit|CPU]] operation
		- #question What makes an efficient CPU operation. Compilers related? 
- Bit shift operation more efficient on CPU
Solution #1 
```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        res = 0
        while n:
            res += n % 2
            n = n >> 1
        return res
```
- Guaranteed that every input is a 32 bit integer, so we know the while loop will run 32 times. 
	- So time complexity is O(32) which is constant time or $O(1)$ 
	- No extra memory complexity so also $O(1)$
- Downside of solution is that it has to look at every bit. Even the ones that aren't 1s
	- It is possible for our algorithm to run as many times as there are 1s in the input
- Not easy to come up with as time complexity will be the same. Just constant time and constant space
	- However, might be useful to get good at [[bit manipulation]]
- Will take `n = n & (n-1)` for trick
	- When subtracting 1, pretty much just getting rid of a bit
	- Skipping all zeros
Second solution
```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        res = 0
        while n:
            n &= (n-1)
            res +=1
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=5Km3utixwZs