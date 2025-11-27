---
Source:
  - https://leetcode.com/problems/sorting-the-sentence/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def sortSentence(self, s: str) -> str:
        word_list = s.split()
        index_list = []
        result_list = ['0'] * len(word_list)

        for i in word_list:
            index_list.append(int(i[-1]))
        print(index_list)

        for i in range(len(index_list)):
            print(index_list)
            print(word_list)
            print(result_list)
            result_list[index_list[i]-1] = word_list[i][0:-1]
        
        return " ".join(result_list)
```
## Source [^1]
- 
## References

[^1]: 