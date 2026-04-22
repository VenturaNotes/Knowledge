---
tags:
  - in-progress
---
## Synthesis

### Sliding Window (Fixed Size)
#### Description
- Efficient technique to solve problems involving [[contiguous]] subarray or substrings of a specific length $k$, and you might be trying to find the subarray with the largest sum.
- Nested loops have an $O(n \times k)$ time complexity but the sliding window approach allows us to process the data in a single pass, achieving $O(n)$ time complexity.
	- For example, if you have an array of $1,000,000$ elements and you want to find the subarray with the largest sum where its length $k = 100$
		- Brute Force Approach:
			- $1,000,000 * 100 = 100,000,000$ operations
				- $O(k)$ operations per slide (in this case $k-1= 100-1 = 99$)
				- The length of the array is $n$ so overall time complexity is $O(n\times k)$
		- Sliding Window Approach
			- $1,000,000 * 2 = 2,000,000$ operations
				- Only $O(1)$ operations per slide is needed which is simply one addition and one subtraction
					- For example, if the sum of a subarray = $100$, then the sum of the next iteration of the sliding window would be
						- 100 - (element removed) + (element added)
				- The length of the array is $n$ so the overall time complexity is $O(n)$
#### Main Idea
- Maintain a "window" of size $k$ and "slide" it across the array. As window moves
	- Subtract element leaving window from left
	- Add element entering window from right
- This avoid re-calculating sum (or other property) for entire window every step
#### Logic
1.  **Initialize**: Calculate the sum (or target property) of the first $k$ elements.
2.  **Slide**: Move the window one element at a time from index $k$ to the end of the array.
3.  **Update**: For each step:
	- Add the new element at the current index.
	- Subtract the element that is now outside the window (at index `i - k`).
		- For example, if $k = 100$, the first $k$ elements would be the first 100 elements which ends at index $i = 99$. Then when you shift right one, you get $i - k = 100 - 100 = 0$, so you'd subtract out the element from index 0. 
	- Compare the current window's value with the maximum/minimum found so far.
#### Example
- Problem: Find the maximum sum of a subarray of size $k=3$.
- Array: `[2, 1, 5, 1, 3, 2]`

| Window | Elements    | Calculation | Current Sum | Max Sum |
| :----- | :---------- | :---------- | :---------- | :------ |
| 1      | `[2, 1, 5]` | $2 + 1 + 5$ | 8           | 8       |
| 2      | `[1, 5, 1]` | $8 - 2 + 1$ | 7           | 8       |
| 3      | `[5, 1, 3]` | $7 - 1 + 3$ | 9           | 9       |
| 4      | `[1, 3, 2]` | $9 - 5 + 2$ | 6           | 9       |

- Result: 9
	- Each step represents a new window being added. To compute new windows, we subtract from the previous sum by the element removed $(i-k)$ and add the new element which entered the window.

#### Python Code Snippet

## Organize
### Python Code Snippet

Here is a standard implementation for finding the maximum sum of any contiguous subarray of size $k$:

```python
def max_sub_array_of_size_k(k, arr):
    max_sum = 0
    window_sum = 0
    window_start = 0

    for window_end in range(len(arr)):
        window_sum += arr[window_end]  # Add the next element
        
        # Slide the window once we hit size 'k'
        if window_end >= k - 1:
            max_sum = max(max_sum, window_sum)
            # Subtract the element going out
            window_sum -= arr[window_start]
            # Slide the window ahead
            window_start += 1
            
    return max_sum

# Example usage:
nums = [2, 1, 5, 1, 3, 2]
k = 3
print(f"Maximum sum of a subarray of size {k}: {max_sub_array_of_size_k(k, nums)}")
```

### When to Use This Pattern
- The problem involves a **contiguous** sequence (array or string).
- The problem specifies a **fixed length** $k$.
- You are asked to find a maximum, minimum, average, or a specific property (like a target sum or unique characters) within that fixed length.
## Source [^1]
- A flow control technique in which the transmitter sends out a number of packets (equal to the transmit window size), then waits for an acknowledgment for the first packet before sending out the next one. In this way there is never more than one window's worth of packets in the network. It is more efficient than stop-and-wait flow control, particularly on long fast links.
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]