---
Source:
  - https://leetcode.com/problems/categorize-box-according-to-criteria
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def categorizeBox(self, length: int, width: int, height: int, mass: int) -> str:
        category = set()
        
        if length >= pow(10,4) or width >= pow(10,4) or \
            height >= pow(10,4) or length*width*height >= pow(10,9):
            category.add("Bulky")
        if mass >= 100:
            category.add("Heavy")
        if "Bulky" in category and "Heavy" in category:
            return "Both"
        elif len(category) == 0:
            return "Neither"
        elif "Bulky" in category:
            return "Bulky"
        elif "Heavy" in category:
            return "Heavy"
```
## Source [^1]
- 
## References

[^1]: 