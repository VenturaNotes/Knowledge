---
Source:
  - https://leetcode.com/problems/can-place-flowers/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def canPlaceFlowers(self, flowerbed: List[int], n: int) -> bool:
        if len(flowerbed) == 1:
            if n == 0:
                return True
            elif flowerbed[0] == 1:
                return False
            elif flowerbed[0] == 0 and n == 1:
                return True
            else:
                return False
        if len(flowerbed) == 2:
            if n == 0:
                return True
            elif flowerbed[0] == 1 or flowerbed[1] == 1:
                return False
            elif flowerbed[0] == 0 and flowerbed[1] == 0 and n == 1:
                return True
            else:
                return False
        changed = 0

        if flowerbed[0] == 0 and flowerbed[1] == 0:
            flowerbed[0] = 1
            changed+=1
        
        if flowerbed[-1] == 0 and flowerbed[-2] == 0:
            flowerbed[-1] = 1
            changed += 1

        for i in range(1,len(flowerbed)-1):
            if flowerbed[i-1] == 0 and flowerbed[i+1] == 0 and flowerbed[i] != 1:
                flowerbed[i] = 1
                changed +=1
        if changed >= n:
            return True
        else:
            return False


'''
Given Bed: 
- Plots Planted
- Plots not planted
- Plots cannot be planted in adjacent plots
'''
```
## Source [^1]
- 
## References

[^1]: 