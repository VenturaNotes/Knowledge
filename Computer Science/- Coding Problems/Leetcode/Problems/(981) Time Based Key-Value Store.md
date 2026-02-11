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
## Source[^2]
### (1) Brute Force
```python
class TimeMap:

    def __init__(self):
        self.keyStore = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        if key not in self.keyStore:
            self.keyStore[key] = {}
        if timestamp not in self.keyStore[key]:
            self.keyStore[key][timestamp] = []
        self.keyStore[key][timestamp].append(value)

    def get(self, key: str, timestamp: int) -> str:
        if key not in self.keyStore:
            return ""
        seen = 0

        for time in self.keyStore[key]:
            if time <= timestamp:
                seen = max(seen, time)
        return "" if seen == 0 else self.keyStore[key][seen][-1]
```
Time Complexity: $O(1)$ for set() and $O(n)$ for get()
Space Complexity: $O(m*n)$
- Where $n$ is the total number of unique timestamps associated with a key and $m$ is the total number of keys
### (2) Binary Search (Sorted Map)
```python
from sortedcontainers import SortedDict

class TimeMap:
    def __init__(self):
        self.m = defaultdict(SortedDict)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.m[key][timestamp] = value

    def get(self, key: str, timestamp: int) -> str:
        if key not in self.m:
            return ""
        
        timestamps = self.m[key]
        idx = timestamps.bisect_right(timestamp) - 1
        
        if idx >= 0:
            closest_time = timestamps.iloc[idx]
            return timestamps[closest_time]
        return ""
```
Time Complexity: $O(1)$ for set() and $O(logn)$ for get()
Space Complexity: $O(m*n)$
- Where $n$ is the total number of values associated with a key and $m$ is the total number of keys
### (3) Binary Search (Array)
```python
class TimeMap:

    def __init__(self):
        self.keyStore = {}  # key : list of [val, timestamp]

    def set(self, key: str, value: str, timestamp: int) -> None:
        if key not in self.keyStore:
            self.keyStore[key] = []
        self.keyStore[key].append([value, timestamp])

    def get(self, key: str, timestamp: int) -> str:
        res, values = "", self.keyStore.get(key, [])
        l, r = 0, len(values) - 1
        while l <= r:
            m = (l + r) // 2
            if values[m][1] <= timestamp:
                res = values[m][0]
                l = m + 1
            else:
                r = m - 1
        return res
```
Time Complexity: $O(1)$ for set() and $O(logn)$ for get()
Space Complexity: $O(m*n)$
- Where $n$ is the total number of values associated with a key and $m$ is the total number of keys
## References

[^1]: [Time Based Key-Value Store - Leetcode 981 - Python](https://www.youtube.com/watch?v=fu2cD_6E8Hw)
[^2]: https://neetcode.io/solutions/time-based-key-value-store