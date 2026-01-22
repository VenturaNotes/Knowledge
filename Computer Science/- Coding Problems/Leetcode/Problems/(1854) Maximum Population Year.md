---
Source:
  - https://leetcode.com/problems/maximum-population-year/
Reviewed: false
tags:
  - in-progress
---
## Synthesis
### My Solution

#### Code
```python
class Solution:
    def maximumPopulation(self, logs: List[List[int]]) -> int:
        year = {}
        for i in logs:
            for j in range(i[0],i[1]):
                year[j] = year.get(j,0)+1

        max_key = max(year, key=lambda k: (year[k], -k))
        return max_key
```
#### Dry Run
- Given
	- `logs = [[1950,1961],[1960,1971],[1970,1981]]`
- Creating an empty dictionary: `year = {}`
- Then looping through logs and finding its range. For example:
	- The `range(i[0], i[1])` for first `j` would be from `[1950, 1961]`. So we find the range between these numbers (each one aside from year of death), and then add +1 to the dictionary as a key-value pair
	- The `year[j] = year.get(j,0)+1` checks if key exists and if not, default value to 0
- Now `year` has a key-value pair for every available year of `logs`. Now we just need to return earliest year with maximum population
- Help
	- The `max()` function is used to find largest item in iterable. In this case, the iterable is the `year` dictionary. When `max()` is called with a dictionary, it iterates over keys by default
	- 
## Source [^1]
- 
## References

[^1]: 