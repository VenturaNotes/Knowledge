---
Source:
  - https://www.youtube.com/watch?v=Ber2pi2C0j0
---
- ![[Screenshot 2023-08-30 at 3.53.35 AM.png]]
	- Need to find a value inside an $m \times n$ matrix that has sorted values
	- Brute force
		- Time Complexity: $O(m*n)$ 
		- Search every single value in input array
	- [[Binary Search]]
		- Time Complexity: $mlogn$
			- This is using the property that the integers in each row are sorted from left to right
	- Using a double binary search, we'd get the time complexity to be $logm$ + $logn$ 
		- $logm$ is binary search the which row to use
		- $logn$ is binary search the column of the row found
	- We'll have 2 pointers, left pointer and right pointer.
	- Using a double binary search.
- Code
```python
def searchMatrix(matrix, target):
    ROWS, COLS = len(matrix), len(matrix[0])

    top, bot = 0, ROWS - 1
    while top <= bot:
        row = (top + bot) //2
        if target > matrix[row][-1]:
            top = row + 1
        elif target < matrix[row][0]:
            bot = row - 1
        else:
            break

    if not (top <= bot):
        return False
    row = (top + bot) // 2
    l, r = 0, COLS - 1
    while l <= r:
        m = (l + r) // 2
        if target > matrix[row][m]:
            l = m + 1
        elif target < matrix[row][m]:
            r = m - 1
        else:
            return True
    return False

print(searchMatrix([[1,3,5]], 4))
#Returns False
```

