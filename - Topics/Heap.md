## Synthesis
- The heap's efficiency advantage applies when the list is dynamic and elements are frequently added or removed, potentially changing the maximum value
	- The initial construction of a heap is $O(n)$ time and subsequent comparisons is $O(1)$ (simply accessing the top of the heap)
	- #question Is a heap actually a data structure or just a method of organizing lists?
## Source [^1]
- (1) An area of storage used for dynamic allocation of data structures where the order of releasing the allocated data structure is indeterminate. Compare STACK. 
- (2) A complete binary tree (see COMPLETE TREE) in which the value at each node is at least as large as the values at its children (if they exist). Heaps are used to implement priority queues.
## Source[^2]
- A heap is a complete binary tree [[data structure]] that satisfies the heap property: for every node, the value of its children is greater than or equal to its own value.
	- #question What is a complete binary tree data structure?
	- #question What exactly is a data structure?
	- #question What is meant by "heap property?" For it to be a heap, does this need to be true for every version? What about max heap vs min heap? Wouldn't this type of property change then? 
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: https://www.geeksforgeeks.org/dsa/heap-data-structure/