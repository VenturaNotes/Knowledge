---
Source:
  - https://leetcode.com/problems/sum-of-two-integers/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-08 at 10.44.39 PM.png]]
- Must return the sum of two integers without using the `+` and `-` [[operator|operators]]
- Need to use [[bit manipulation]] for this
- Will use [[exclusive or|xor]] operation
- Will use & operator if you have a carry
- Time complexity is O(1) as the integers `a,b` will be between -1000 and 1000
- Negative numbers handles themselves
- In python, their integers are arbitrarily large, they're not 32 bit. So it might run into problems with this algorithm
```java
class Solution {
    public int getSum(int a, int b) {
        while (b != 0) {
            int tmp = (a & b) << 1;
            a = a ^ b;
            b = tmp;
        }
        return a;
    }
}
```
## References

[^1]: https://www.youtube.com/watch?v=gVUrDV4tZfY