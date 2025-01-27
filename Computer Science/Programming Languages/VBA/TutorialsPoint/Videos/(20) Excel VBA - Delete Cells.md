---
Source:
  - https://www.youtube.com/watch?v=9GVYxyJ8_Q4
Reviewed: false
---
- ![[Screenshot 2025-01-25 at 5.39.45 AM.png|400]]
	- Delete options
		- Shift cells left
		- Shift cells up
		- Entire row
		- Entire column
	- `Range("b3").Delete`
		- Cells shift up
	- `Range("a1:a10").Delete`
		- Cells in this range are deleted and cells to the right are shifted left in place
	- `Range("b6").EntireRow.Delete`
		- Cells shift up
	- `Range("c4").EntireColumn.Delete`
		- #question it deletes column that `c4` is in but where are cells shifted to?