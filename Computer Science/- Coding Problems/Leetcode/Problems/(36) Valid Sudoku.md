---
Source:
  - https://leetcode.com/problems/valid-sudoku/
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
## References

[^1]: https://www.youtube.com/watch?v=TjFXEUCMqI8