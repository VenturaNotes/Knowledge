---
aliases:
  - sort()
---
## Synthesis
- Will sort pairs in a list in ascending order
- Given `A = [[3, 0], [1, 1], [4, 2], [2, 3]]`
- `A.sort()` will do `A = [[1, 1], [2, 3], [3, 0], [4, 2]]`
	- This will change the value of `A` itself without needing an assignment operation
- To reverse sort from highest to lowest
	- `A.sort(reverse=True)`
- The time complexity of the `sort()` on a list is $O(N log N)$ in the average and worst-case scenarios where N is the number of elements in the list
	- This method uses an algorithm called [[Timsort]] which uses a hybrid stable sorting algorithm from [[Merge Sort]] and [[Insertion Sort]]. Highly optimized for various real-world data.
		- #question What is Timsort? 
		- #question What is a non-stable sorting algorithm? 
	- In base-case scenario, Timsort can achieve a complexity of $O(N)$ if the list is already sorted or nearly sorted. 
## Source [^1]
- 
## References

[^1]: 