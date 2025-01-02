---
Source:
  - https://leetcode.com/problems/top-k-frequent-words/
  - https://neetcode.io/problems/top-k-elements-in-list
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-09 at 12.36.01 AM.png]]
	- Possible solutions to question
		- k will never be greater than the number of distinct elements in the input array
		- Given that we sort the pairs $(1,3), (2,2) \text { and } (3,1)$ from `[1, 1, 1, 2, 2, 3]`, 
			- Sorting it in worst case where every single value is distinct and we wanted the top `k` distinct values, we'd get a time complexity of $nlogn$ but we don't need to sort the entire thing because we only want the top `k` frequent elements in another solution, we could use a [[max heap]]
				- Count number of occurrences of each value
				- Then add each pair to max heap
					- Key of max heap would be the number of occurrences (the count)
					- Then we'd pop from our heap exactly `k` times.
				- When initializing heap, will add the entire set $(1,3), (2,2) \text { and } (3,1)$ and there's a function called [[heapify]] which can do that in linear time O(n)
					- Each pop will take O(logn) and doing that k times so $O(k*logn)$
						- Better than $nlogn$ as long as k < n
		- There is a better solution which can be done in O(n) time. Linear Time
			- O(n) time and O(n) memory but will use same technique where for each value like "1", we count the number of occurrences which would be 3 in this case.
	- [[Bucket Sort]]
		- Problem can be solved in linear time if we used the algorithm called bucket sort.
		- How bucket sort is usually taught
			- For each value (such as 1), we'll take an input array, the first row is the indices of the array and the second value is going to be the count.
			- Given `[1, 1, 1, 2, 2, 100]`, for 1, we'll go to the index 1 and we'll put the value that it occurs once.
			- Will go through the input array, count how many times each value occurs and in input array, put that count for that index
				- Map value to index and then put the count of that value
		- This algorithm would be linear time if our input values were bounded. If we knew every value was between 1 and 10, then we know the size of the input array will also be 10. In this case, the values are unbounded. It could've been a million and the size of the input array would be 1 million even if the total input size is only 6. However, the array where we store the bucket sort values will be unbounded. We want the top k elements, the array we created is unclear where the top k elements are actually going to be.
			- So this type of bucket sort doesn't work
	- Bucket sort tricky solution
		- For the index, we're actually going to be mapping the counts of each value, and the values, we're actually going to have a list of which values have exactly this particular count
			- #comment So they would be stored as arrays within the array it seems
		- The indices values stop at 6 for this example because the input array is of size 6. The most number of times a value could occur would be exactly 6 times. It's proportionate to the size of the input array. Will be scanning right to left which is in linear time
	- Why is it linear time again?
		- Max size of new array will be equal to size of input array.
		- Will iterate through entire input array which is going to be O(n) and then we'll add another O(n) to it because we have to iterate through 6 values in one position if the array was `[1, 2, 3, 4, 5, 6]` which is still technically linear time. 
		- We are creating the array to help us and we'll also need a [[hashmap]] to count the occurrences of each value in the input array so memory complexity is O(n)
```python
Class Solution:
	def topKFrequent(self, nums: List[int], k:int) -> List[int]:
		#Will use hashmap to count occurrences of each value
		count = {}
		
		# The special array which will be the same size as the input array
		# about is going to be called frequency. Basically, the index is going
		# to be the frequency of an element (or count) and the value is going
		# to be the list of values that occur that particular many number of
		# times. 
		freq = [[] for i in range (len(nums) + 1)] 

		for n in nums:
			# Will return 0 if it doesn't exist
			count[n] = 1 + count.get(n, 0)
		
		# Will return every single key value pair added to dictionary
		# n is number and c is count here
		for n, c in count.items():
			# Saying the value n occurs c number of times
			freq[c].append(n)

		res = []

		# -1 is the decrementor here
		for i in range(len(freq) - 1, 0, -1):
			# everything inserted in "i" is another sublist
			# could be empty or could have some values
			for n in freq[i]:
				res.append(n)
				# guaranteed to have at least k values in input array
				if len(res) == k:
					return res
```
- #comment Seems like we are adding +1 to the input so we don't need to do -1 for the second for loop when pairing the occurrence of a value within the count dictionary to the index of the frequency array. 
	- O(klogn) is a doable solution for heap
	- Could do this in O(n) time 
- ![[Screenshot 2024-10-09 at 3.18.56 AM.png]]
## References

[^1]: https://youtu.be/YPTqKIgVk-k?si=y6KXepaOXKAEbyLU