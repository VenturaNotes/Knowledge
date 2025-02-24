---
Source:
  - https://youtube.com/watch?v=mIjuDg8ky4U
Reviewed: false
---
- Image
- Slide 1: The Dominant Term
	- Let's review a mathematical principle. Mainly the concept of a [[dominant term]] in an expression
	- An algorithm working on a data structure of size $n$ might take $5n^3 + n^2 + 4n + 3$ steps
	- The larger n becomes, the less significant the smaller terms become, so we ignore everything except $5n^3$ 
	- We can also ignore any constants, so the Big O time complexity of this algorithm is $O(n^3)$ 
		- We call this [[cubic complexity]]
- Slide 2: [[Bubble sort]]
	- It's a sorting algorithm
	- Sorts a list of items into numeric or alphabetical order
	- Scans a list comparing pairs of values and swapping their positions if necessary
	- For n data items, the list is scanned like this n-1 times
	- Various enhancements possible
- Slide 3: Pseudocode
```
FOR i = 0 TO n - 2
	IF ArrayToSort(i) > ArrayToSort(i + 1) THEN
		Swap ArrayToSort(i) with ArrayToSort(i + 1)
	END IF
NEXT i
```
- Involves a loop to scan the array, comparing pairs of items and swapping if necessary