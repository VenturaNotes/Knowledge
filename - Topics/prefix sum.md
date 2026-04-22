## Synthesis
### Description
- A technique used to efficiently calculate the sum of elements within any sub-array.
- It precomputes the sum of all elements up to each position in the original array and storing these cumulative sums in a new array, often called the prefix sum array.
	- So if you're given an original array $A = [1, 2, 3, 4, 5]$, the prefix sum array would be  $P = [1, 3, 6, 10, 15]$ (as demonstrated below)
- Given $A = [a_0, a_1, a_2, \ldots a_{n-1}]$
	- $P[i] = a_0+a_1+a_2 + \ldots + a_i$ where $P[i]$ stores the sum of the first $i+1$ elements of $A$.
		- So for example if you have $A = [3]$, then when $i = 0$, you store $i+1 = 0 + 1 = 1$ element of A which is $P[0] = 3$ which is the sum of the sub-array $A[0]$ 
- Construction
	-   $P[0] = A[0]$
		- This is the base case
	-   $P[i] = P[i-1] + A[i]$ for $i > 0$
		- This continues to construct the prefix sum array
- Purpose
	- The sum of any sub-array $A[j...k]$ (from index $j$ to index $k$, inclusive) can be calculated in constant time using the formula:
		-   Sum($A[j...k]$) = $P[k] - P[j-1]$
		-   If $j=0$, then Sum($A[0...k]$) = $P[k]$ (since there's no $P[-1]$).
- Usefulness
	- Without this, we would need to iterate through all the elements in the sub-array which takes $O(k-j+1)$ time which is inefficient if you need to calculate many sub-array sums.
		- $k-j +1$: This is the inclusive range
			- For example, if you have $A[2\ldots7]$, then the range is $7-2 + 1 = 6$ 
				- $2 + 3 + 4 + 5 + 6 + 7 = 27$ (7 terms total)
				- True for $A[0\ldots 4]$ as well
					- $4-0+1 = 5$
					- $0+1+2+3+ 4 = 10$ (5 terms total)
	- With prefix sums, each sub-array sum takes only $O(1)$ time (constant) after an initial $O(N)$ time to build the prefix sum array. 
### Examples
- Given $A = [1, 2, 3, 4, 5]$
- Step 1: Construct the Prefix Sum Array $P$
	*   $P[0] = A[0] = 1$
	*   $P[1] = P[0] + A[1] = 1 + 2 = 3$
	*   $P[2] = P[1] + A[2] = 3 + 3 = 6$
	*   $P[3] = P[2] + A[3] = 6 + 4 = 10$
	*   $P[4] = P[3] + A[4] = 10 + 5 = 15$
	* So, our prefix sum array is $P = [1, 3, 6, 10, 15]$.
* Step 2:  Calculate the sums you want of different sub-arrays using P (0-indexed)
	- Find sum of $A[0 \ldots 2]$ (edge case)
		- $P[2] = 6$
			- Just take last index of substring and that solution can be found within P
	- Find sum of $A[1 \ldots 3]$
		- $P[3] - P[1-1] = P[3]-P[0] = 10 - 1 = 9$
	- Find sum of $A[2 \ldots 4]$
		- $P[4] - P[1] = 15 - 3 = 12$
- One prefix sum array is built, any range sum can be found with simple subtraction making it very efficient for repeated queries.
## Source [^1]
- 
## References

[^1]: 