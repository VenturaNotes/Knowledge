---
Source:
  - https://leetcode.com/problems/build-an-array-with-stack-operations/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def buildArray(self, target: List[int], n: int) -> List[str]:
        stack = []
        operations = []
        index = 0
        count = 1

        while count <= n:
            if stack == target:
                break
            elif len(stack) == 0:
                stack.append(count)
                operations.append("Push")
                count+=1
            elif stack[-1] != target[index]:
                stack.pop()
                operations.append("Pop")
                stack.append(count)
                operations.append("Push")
                count+=1
            elif stack[-1] == target[index]:
                stack.append(count)
                operations.append("Push")
                count+=1
                index+=1
        return operations
```
## Source [^1]
- 
## References

[^1]: 