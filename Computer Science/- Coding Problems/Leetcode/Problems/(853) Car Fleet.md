---
Source:
  - https://leetcode.com/problems/car-fleet/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-18 at 1.28.07 PM.png]]
- Once cars are traveling right next to each other, that is called a car fleet.
	- If cars right next to each other, assumed to have the same exact position
	- A single car can be considered a car fleet
- Determine the number of car fleets that will arrive at the destination
- Cars are just a system of linear equations
- If a car reaches a destination before or at the same time as the car ahead, it must mean they've become a car fleet somewhere along the middle.
- Overall time complexity is O(nlogn) because we need to sort the cars first based on position
	- Extra space will just be O(n) because we will be creating a separate array and using a stack
- By sorting input based on positions and 
```python
class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
	    # This is a list comprehension which combines both lists
	    # so each index becomes [p,s]
        pair = [[p, s] for p, s in zip(position, speed)]

        stack = []
        # This code doesn't sort it every time
        for p, s in sorted(pair)[::-1]: #Reverse Sorted Order
            stack.append((target-p) / s)
            if len(stack) >= 2 and stack[-1] <= stack[-2]:
                stack.pop()
        return len(stack)
```
- Using a [[List comprehension (Python)|list comprehension]] with zip
- ![[Screenshot 2024-10-18 at 1.42.09 PM.png|300]]
- Explanation
	- Given
		- target = 12
		- position = `[10, 8, 0, 5, 3]`
		- speed = `[2, 4, 1, 1, 3]`
	- We first reverse the sorted list giving `[10,2], [8, 4], [5, 1], [3,3], [0,1]`
		- Then we calculate time until destination reached `(target - p) / s)`
		- Then we add to stack the equation and pop only if one is faster than the other (meaning the appended value must be less than the previous value)
		- It's sorted in a way so that the closest cars to the end are considered first
		- #question `1, 1, 7, 3, 12` (speed of cars based on how close they are to end)
			- For `1, 1`, the first car will reach the end at the same time as the second car making them a single fleet. Therefore, you pop the second car
			- For `1, 7`, the first car will reach the end faster than the second car causing 2 fleets
			- For `1, 7, 3`, the third car will reach first combining with the second car so it's popped
			- For  `1, 7, 12`, the second car will reach first before the last car meaning there are 3 fleets total	  
## Source[^2]
### (1) Stack
```python
class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        pair = [(p, s) for p, s in zip(position, speed)]
        pair.sort(reverse=True)
        stack = []
        for p, s in pair:  # Reverse Sorted Order
            stack.append((target - p) / s)
            if len(stack) >= 2 and stack[-1] <= stack[-2]:
                stack.pop()
        return len(stack)
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$

### (2) Iteration
```python
class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        pair = [(p, s) for p, s in zip(position, speed)]
        pair.sort(reverse=True)
        
        fleets = 1
        prevTime = (target - pair[0][0]) / pair[0][1]
        for i in range(1, len(pair)):
            currCar = pair[i]
            currTime = (target - currCar[0]) / currCar[1]
            if currTime > prevTime:
                fleets += 1
                prevTime = currTime
        return fleets
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$
## References

[^1]: https://www.youtube.com/watch?v=Pr6T-3yB9RM
[^2]: https://neetcode.io/solutions/car-fleet