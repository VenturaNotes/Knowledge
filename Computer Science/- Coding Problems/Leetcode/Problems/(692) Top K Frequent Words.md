---
Source:
  - https://leetcode.com/problems/top-k-frequent-words/
  - https://neetcode.io/problems/top-k-elements-in-list
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def topKFrequent(self, words: List[str], k: int) -> List[str]:
        res = defaultdict(int) #O(n) space (worst case)
        endlist = []

        for i in words:#O(n) time
            res[i] += 1

        while True:
            temp = 0
            mylist = []
            for j in res:
                if res.get(j) > temp:
                    mylist.clear() #Is this constant complexity?
                    mylist.append(j)
                    temp = res.get(j)
                elif res.get(j) == temp:
                    mylist.append(j)
            mylist = sorted(mylist)
            for j in mylist:
                if len(endlist) == k:
                    break
                endlist.append(j)
                res.pop(j)
            if len(endlist) == k:
                break
            print(endlist)
        return endlist
```
- #question what is the time complexity for `mylist.clear`?
- First I create a dictionary where the default key value is 0. Then I count the number of each string within the list and store this as a key-value pair
- Then I have a while loop which has a `temp` variable keeping track of the highest occurrence within the dictionary. If a new highest value found, clear the `mylist`, update `temp`, and add the new key to `mylist`. If a key has a equivalent value, just add it to `mylist`. Then simply sort `mylist`. 
- Afterwards, add the new values to `endlist` (while removing the keys from `res`) and then return `endlist` when the length of `endlist` equals k. 
## Source[^1]
- 
## References

[^1]: 