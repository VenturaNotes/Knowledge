---
Source:
  - https://leetcode.com/problems/top-k-frequent-elements/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- Problem: Need return the `k` numbers with the maximum number of occurrences within array in any order 
- Sorting it in the worst case, we get a time complexity of $nlogn$ 
	- Don't need to sort the entire thing since we only need the top `k` frequent elements
	- Could use a [[max heap]]
		- Count number of occurrences of each value. Then add each pair to max heap. The key (value?) of max heap would be the number of occurrences which is the count. Then pop from heap exactly `k` times
			- When initializing heap, will add entire set. There is a function called [[heapify]] which can do this in O(n) time.
			- Will only pop from [[Heap|heap]] k times
				- Each pop will take $logn$ and will do this $k$ times
				- $klogn$ is better than $nlogn$ as long as k is less than n
- There is a solution for time and space complexity each being $O(n)$ 
	- Need to use [[bucket sort]]

### Code
```python
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        count = {}
        freq = [[] for i in range(len(nums) + 1)]

        for n in nums:
            count[n] = 1 + count.get(n, 0)
        for n, c in count.items():
            freq[c].append(n)
        
        res = []
        for i in range(len(freq) - 1, 0, -1):
            for n in freq[i]:
                res.append(n)
                if len(res) == k:
                    return res
```
#### Key Terms
- [[range() (Python)|range()]]

#### Dry Run

## References

[^1]: https://www.youtube.com/watch?v=YPTqKIgVk-k