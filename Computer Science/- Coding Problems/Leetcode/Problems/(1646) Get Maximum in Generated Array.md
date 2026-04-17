---
Source:
  - https://leetcode.com/problems/get-maximum-in-generated-array/
Reviewed: false
Approaches: "1"
---
## Synthesis

### My Solution
```python
class Solution:
    def getMaximumGenerated(self, n: int) -> int:
        my_array = []
        
        for i in range(n+1):
            if i == 0:
                my_array.append(0)
            elif i == 1:
                my_array.append(1)
            elif i % 2 == 0:
                my_array.append(my_array[int(i/2)])
            elif i % 2 == 1:
                my_array.append(my_array[int(i/2)] + my_array[int(i/2)+1])
                
        return max(my_array)
```