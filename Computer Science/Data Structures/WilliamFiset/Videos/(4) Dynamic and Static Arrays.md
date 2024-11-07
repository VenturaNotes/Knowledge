---
Source:
  - https://www.youtube.com/watch?v=PEnFFiQe1pM
---
- ![[Screenshot 2024-10-04 at 3.15.08 PM.png]]
	- Static and Dynamic Arrays
		- Arrays are probably the most used data structure 
			- Forms a fundamental building block for all other data structures
			- With arrays and pointers alone, we could probably construct any kind of data structure
	- Outline
		- Discussion and examples about Arrays
			- What is an Array?
			- When and where is an Array used?
			- Complexity
			- Static array usage example
		- Dynamic Array implementation details
		- Code Implementation
		- Other
			- Will look at some source code on how to construct a dynamic array using only static arrays
	- What is a [[static array]]?
		- A static array is a fixed length container containing n elements [[indexable]] from the range $[0, n-1]$.
			- Static arrays are given as contiguous chunks of memory meaning that your chunk of memory doesn't look like a piece of Swiss cheese with a bunch of holes and gaps.
			- It's contiguous. All the addresses are adjacent in your static array
		- Q: What is meant by being 'indexable'?
		- A: This means that each slot/index in the array can be referenced with a number
		- Cannot grow larger or smaller
	- When and where is a static array used? (basically used everywhere)
		- (1) Storing and accessing sequential data
		- (2) Temporarily storing objects
		- (3) Used by IO routines as buffers
			- Store information from an input or output stream
			- Let's say we have a really large file for instance that you need to process but that file is so big it doesn't fit all in memory. 
				- Therefore, we use a buffer to read small chunks of the file into the buffer or array one at a time. Eventually, we're able to read the entire file.
		- (4) Lookup tables and inverse lookup tables
			- Great for lookup tables due to their indexing property
			- Great way to retrieve data from a lookup table if you know where everything is, where it's supposed to be, and what offset.
		- (5) Can be used to return multiple values from a function
			- Great for a programming language that only allows one return value
			- The hack we use is to return a pointer or a reference to an array which then contains all of the return values we want.
		- (6) Used in dynamic programming to cache answers to subproblems.
			- With tabulation to cache already computed sub-problems
			- Great examples are knapsack problem or the coin change problem
	- Complexity

|                                                                                                                                                             | Static Array | Dynamic Array |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------- |
| Access (because of property of array being indexable)                                                                                                       | O(1)         | O(1)          |
| Search (may need to traverse elements in array)                                                                                                             | O(n)         | O(n)          |
| Insertion (may need to shift elements right and recopy all elements into new static array. This is assuming implementing dynamic array using static arrays) | N/A          | O(n)          |
| Appending (Need to resize internal static array containing all those elements but this happens so rarely that appending becomes constant time)              | N/A          | O(1)          |
| Deletion (linear for same reason as insertion. Need to shift elements and potentially recopy everything into static array)                                  | N/A          | O(n)          |
- ![[Screenshot 2024-10-04 at 3.26.26 PM.png]]
	- Static Array
		- Elements in A are referenced by their index. There is no other way to access elements in an array. Array indexing is zero-based, meaning the first element is found in position zero.
		- Mathematics is 1 based while computer science is 0 based.
		- [[Quantum computing]]
			- Field is a mess. Tries to please mathematicians, computer scientists, and physicists all at the same time. Indexing just doesn't work well.
		- Elements can be iterated over using a for each loop which is offered in some programming languages.
			- Doesn't require to explicitly reference indices of array (although the indexing is done internally behind the scenes)
	- Static Array
		- Notation of square brackets denotes indexing. 
		- `A[0] = 44`
			- A at position 0 is equal to the value 44.
		- `A[9]` is out of bounds and our program will throw an exception (unless you're in C where it doesn't always throw an exception unfortunately )
	- Operations on Dynamic Arrays
		- [[Dynamic Array]]
			- The dynamic array can grow and shrink in size.
			- Can do all the similar get, set operations static arrays can do but it can grow in size dynamically as needed.
			- Can remove elements
	- Dynamic Array
		- Q: How can we implement a dynamic array?
		- A: One way is to use a static array!
			- (1) Create a static array with an initial capacity
				- Usually non-zero
			- (2) Add elements to the underlying static array, keeping track of the number of elements
			- (3) If adding another element will exceed the capacity, then create a new static array with twice the capacity and copy the original elements into it.
- ![[Screenshot 2024-10-04 at 3.27.43 PM.png]]
	- Dynamic Array
		- Suppose we create a dynamic array with an initial capacity of two and then begin adding elements to it.
			- $\varnothing$ is currently used as an empty position