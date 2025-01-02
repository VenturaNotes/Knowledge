---
Source:
  - https://leetcode.com/problems/time-based-key-value-store/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-10 at 10.24.12 PM.png]]
- Can logically dig your way through problem
- Design a key-value store
	- Similar to a [[hashmap]]
	- Will have a list of values associated with that key
	- Values themselves will have a pair and a timestamp associated with it
	- Main operations supported
		- Constructor
		- Set
			- Will always be a constant time operation
			- Will always add the value to the end of the list
		- Get
			- Will iterate through list to get the timestamp we want of the key "food" to return "bar"
			- If you don't find an exact match, return the most recent one
				- Closest value to 3 less than 3 for example
	- Note
		- All the timestamps `timestamp` of set are strictly increasing. This means the list will be sorted by default. Therefore, you can use [[binary search]]
			- It makes sense the list would already be in sorted order since timestamps move linearly anyway
				- Great question to ask in a real interview
		- Worse case scenario, the get operation is a $O(logn)$ operation

Code
```python
class TimeMap:

    def __init__(self):
        self.store = {} #key : list of [val, timestamp]

    def set(self, key: str, value: str, timestamp: int) -> None:
        if key not in self.store:
            self.store[key] = []
        self.store[key].append([value,timestamp])

    def get(self, key: str, timestamp: int) -> str:
        res = ""
        values = self.store.get(key, [])

        # binary search
        l, r = 0, len(values) - 1
        while l <= r:
            m = (l + r) // 2
            if values[m][1] <= timestamp: #values[m][1] looking for 2nd value
                res = values[m][0]
                l = m + 1 #This is shifting the left pointer to the right.
                # A little suboptimal solution since even if you
                # find the timestamp, it will keep running
                # Can make it more efficient by just returning
                # when the value is found
            else:
                r = m - 1
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=fu2cD_6E8Hw