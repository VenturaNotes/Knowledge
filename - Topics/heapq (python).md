## Synthesis
- A module in Python which implements the heap queue algorithm aka priority queue algorithm
	- #question What is the heapq algorithm?
	- #question Does 'algorithm' need to be at end of name? 
- It's a min-heap by default meaning the smallest element is always at the root (index 0). 
### Basic Operations (Min-Heap)
- It operates on regular Python lists. Provides functions that turn a list into a heap and operates on it. 
	- #question Can it operate on other data types aside from lists? 
```python
import heapq

# 1. Initialize an empty heap (a list)
my_heap = []

# 2. Add elements to the heap (heappush)
# heappush(heap, item) adds item while maintaining heap property
heapq.heappush(my_heap, 4)
heapq.heappush(my_heap, 1)
heapq.heappush(my_heap, 7)
heapq.heappush(my_heap, 3)
print(f"Heap after pushes: {my_heap}")
# Output might be something like: [1, 3, 7, 4] (order of non-root elements can vary)

# 3. Get the smallest element without removing it (my_heap[0])
# The smallest element is always at index 0
print(f"Smallest element (peek): {my_heap[0]}") # Output: 1

# 4. Remove and return the smallest element (heappop)
# heappop(heap) removes and returns the smallest item
smallest = heapq.heappop(my_heap)
print(f"Popped smallest element: {smallest}") # Output: 1
print(f"Heap after pop: {my_heap}") # Output might be: [3, 4, 7]

# 5. Add another element
heapq.heappush(my_heap, 2)
print(f"Heap after another push: {my_heap}") # Output might be: [2, 4, 7, 3]

# 6. Pop all elements
print("\nPopping all elements:")
while my_heap:
    print(heapq.heappop(my_heap), end=" ") # Output: 2 3 4 7
print(f"\nHeap after popping all: {my_heap}") # Output: []
```
 - #question Is the `heapq` ordered? When testing the initial print statement, the order always ended up being `1, 3, 7, 4`. 
 - #question What is meant by order of non-root elements can vary mean? What does root mean in this sense? I think it might be the top of a tree while the bottom are the leaves. 
 - #question How is the smallest element always at index 0?
## Source [^1]
- 
## References

[^1]: 