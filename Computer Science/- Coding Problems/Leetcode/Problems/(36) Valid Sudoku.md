---
Source:
  - https://leetcode.com/problems/valid-sudoku/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-14 at 7.01.27 PM.png]]
- Want to determine if board in its current state is valid or not. Only filled in cells need to be validated
	- 3 rules to this.
- Problem is actually not that difficult. Even though you might have a row of 1-8 and then a column of 2-9, and the missing spot is either a 1 or 9 which is impossible, this kind of board would still be considered valid.
- Could use a [[HashSet]] to detect duplicates in a row.
	- Unique HashSet for every single row in the entire grid
	- HashSet every single column
	- Adding element to a hash set is O(1). Checking duplicates is also O(1).
- We'd basically have the time complexity of the entire grid which is $9^2$ 
- Solution will end up being $O(9^2)$ 
	- Will iterate over entire grid and nothing else
	- Will have extra space of $O(9^2)$ as we'll have 3 HashSets of this exact size
- Will have 9 different sub-squares and have indices to represent them
	- Take the actual coordinates, divide the coordinates by 3, then we'd get the index for the row-column which identifies for which square it's a part of
	- For [[integer division]], we always round down. Tells us which cell within the 3x3 grid it belongs to.
	- The key will be $key(\frac{r}{3}, \frac{c}{3})$ and the value will be the set to see if there are duplicates
		- #question difference between HashSet and set? 
```python
class Solution:
	def isValidSudoku(self, board: List[List[str]]) -> bool:
		cols = collections.defaultdict(set)
		rows = collections.defaultdict(set)
		squares = collections.defaultdict(set) #key = (r / 3, c/3)
	
		for r in range(9):
			for c in range(9):
				if board[r][c] == ".": #The "." is just an empty position
					continue
				if (board[r][c] in rows[r] or
					board[r][c] in cols[c] or
					board[r][c] in squares[(r // 3, c // 3)]):
						return False
				cols[c].add(board[r][c])
				rows[r].add(board[r][c])
				squares[(r // 3, c // 3)].add(board[r][c])
		return True
```
- Hashmap is where the key is the column number and the value is going to be a set. 

## Source[^2]
### (1) Brute Force
```python
class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        for row in range(9):
            seen = set()
            for i in range(9):
                if board[row][i] == ".": 
                    continue
                if board[row][i] in seen:
                    return False
                seen.add(board[row][i])
        
        for col in range(9):
            seen = set()
            for i in range(9):
                if board[i][col] == ".":
                    continue
                if board[i][col] in seen:
                    return False
                seen.add(board[i][col])
            
        for square in range(9):
            seen = set()
            for i in range(3):
                for j in range(3):
                    row = (square//3) * 3 + i
                    col = (square % 3) * 3 + j
                    if board[row][col] == ".":
                        continue
                    if board[row][col] in seen:
                        return False
                    seen.add(board[row][col])
        return True
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n^2)$

### (2) Hash Set (One Pass)
```python
class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        cols = defaultdict(set)
        rows = defaultdict(set)
        squares = defaultdict(set)  

        for r in range(9):
            for c in range(9):
                if board[r][c] == ".":
                    continue
                if ( board[r][c] in rows[r]
                    or board[r][c] in cols[c]
                    or board[r][c] in squares[(r // 3, c // 3)]):
                    return False

                cols[c].add(board[r][c])
                rows[r].add(board[r][c])
                squares[(r // 3, c // 3)].add(board[r][c])

        return True
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n^2)$

### (3) Bitmask
```python
class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        rows = [0] * 9
        cols = [0] * 9
        squares = [0] * 9

        for r in range(9):
            for c in range(9):
                if board[r][c] == ".":
                    continue
                
                val = int(board[r][c]) - 1
                if (1 << val) & rows[r]:
                    return False
                if (1 << val) & cols[c]:
                    return False
                if (1 << val) & squares[(r // 3) * 3 + (c // 3)]:
                    return False
                    
                rows[r] |= (1 << val)
                cols[c] |= (1 << val)
                squares[(r // 3) * 3 + (c // 3)] |= (1 << val)

        return True
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n)$
## References

[^1]: https://www.youtube.com/watch?v=TjFXEUCMqI8
[^2]: https://neetcode.io/solutions/valid-sudoku