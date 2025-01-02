---
Source:
  - https://www.youtube.com/watch?v=zUUkiEllHG0
Reviewed: false
---
- ![[Screenshot 2024-10-04 at 1.47.07 PM.png]]
	- [[Computational Complexity Analysis]]
		- Helps us understand the performance that our data structures are providing
	- [[Complexity Analysis]]
		- As programmers, we often find ourselves asking the same two questions over and over again
			- How much time does this algorithm need to finish
			- How much space does this algorithm need for its computation?
	- [[Big-O Notation]]
		- Big-O Notation gives an upper bound of the complexity in the worst case, helping to quantify performance as the input size becomes arbitrarily large.
			- Suppose you had an unordered list of unique numbers. Worst case when finding a specific number would be if it's at the end of the list
			- With this example, the time complexity would be linear with respect to the number of elements in the size of your list (since you need to traverse every element before finding your number like 7)
		- Big O only cares when the input becomes arbitrarily large (not small). Therefore, we ignore things like constants and multiplicative factors
	- Big - O Notation (only care when n goes to infinity)
		- n - The size of the input complexities ordered in from smallest to largest
			- [[Constant Time]]: $O(1)$
				- Refer to constant time as 1 wrapped around a Big O
			- [[Logarithmic Time]]: $O(log(n))$
				- Read as: Big O of log of N
			- [[Linear Time]]: $O(n)$
			- [[Linearithmic Time]]: $O(nlog(n))$
			- [[Quadric Time]]: $O(n^2)$
			- [[Cubic Time]]: $O(n^3)$
			- [[Exponential Time]]: $O(b^n)$, b > 1
			- [[Factorial Time]]: $O(n!)$
		- We do have things in between these like square root of n. Log log of n. N to the 5th and so on.
			- Basically any mathematical expression containing n can be wrapped around a Big O and is Big O notation valid
	- Big-O Properties
		- O(n + c) = O(n)
			- Remove constant values added to big o notation
			- Adding a constant to infinity is infinity
		- O(cn) = O(n), c > 0
			- Multiplying a constant by infinity is infinity
		- Of course ignoring constants is theoretical since having a constant of 2 billion will have a substantial impact on the running time of the algorithm
		- Let f be a function that describes the running time of a particular algorithm for an input of size n:
			- $f(n) = 7log(n)^3 + 15n^2+2n^3+8$
				- $n^3$ is the most dominant term in the function
			- $O(f(n)) = O(n^3)$
		- Practical examples coming up don't worry :)
- ![[Screenshot 2024-10-04 at 2.26.51 PM.png]]
	- Big-O Examples
		- The following run in [[constant time]]: O(1)
	- Big-O Examples
		- The following run in [[linear time]]: O(n)
	- Big-O Examples
		- Both of the following run in quadratic time. The first may be obvious since n work done n times is $n*n$ = $O(n^2)$, but what about the second one?
	- Big-O Examples
		- For a moment just focus on the second loop. Since `i` goes from `[0,n)` the amount of looping done is directly determined by what `i` is. Remark that if `i=0`, we do `n` work, if i=1, we do `n-1` work, if `i=2`, we do `n-2` work, etc...
		- So the question then becomes what is
			- $(n) + (n-1) + (n-2) + (n-3) + ... + 3 + 2 + 1$?
				- This is a well known identity
			- Remarkably, this turns out to be $n(n+1)/2$, so 
				- $O(n(n+1)/2) = O(n^2/2 + n/2) = O(n^2)$
- ![[Screenshot 2024-10-04 at 2.41.49 PM.png]]
	- Big-O Examples
		- Suppose we have a sorted array and we want to find the index of a particular value in the array, if it exists. What is the time complexity of the following algorithm?
		- Showing algorithm for binary search which yields a logarithmic time complexity
			- It starts by making two pointer arrows. One at start and one at end of array.
			- Then it selects a midpoint between the two and checks if the value we're looking for was found at the midpoint 
			- Then it has either found it or not. If it finds it, it stops. Otherwise, it discards one half of the array and adjusts either the high or the low pointer.
			- Even in the worst case, we're still discarding half of the array each iteration.
				- Very quickly, we'll run out of array to check.
			- Worst case scenario would be $Log_2$ of n iterations meaning the binary search runs in logarithmic time 
```
low := 0
high := n-1
While low <= high Do
	mid := (low + high) / 2

	If array[mid] == value: return mid
	Else If array[mid] < value: lo = mid + 1
	Else if array[mid] > value: hi = mid - 1
return -1 // Value not found
```
- Big-O Examples
	- One of the inner loops does 3n work and the other does 2n work.
	- The rule we use to determine the complexity of this algorithm is to multiply loops on different levels and add those that are on the same (generally speaking)
		- Gives $f(n) = n * (3n + 2n) = 5n^2$
		- $O(f(n)) = O(n^2)$
- Big-O Examples
	- Finding all subsets of a set - $O(2^n)$
	- Finding all permutations of a string - $O(n!)$
	- Sorting using [[Merge Sort|mergesort]] - $O(nlog(n))$
	- Iterating over all the cells in a matrix of size n by m - $O(nm)$
- Contact Information
	- Email: william.alexandre.fiset@gmail.com
	- Website: www.williamfiset.com