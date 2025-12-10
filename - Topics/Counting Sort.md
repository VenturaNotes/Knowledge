## Synthesis
- A non-comparison-based sorting algorithm that works by counting the number of occurrences of each distinct element in the input array.
	- Then these counts are used to determine the positions of each element in the sorted output array.
- #question Can you use negative numbers in counting sort?
### When to use it
- #question What is a better title that I could give this? 
- Works best when the range of numbers (min to max) is not too large. 
	- #question When is the range considered large? 
- You're sorting integers (not floats or strings)
	- #question So this means it can handle negative numbers? 
	- #question Why is it unable to handle floats? 
### Example
- We want to sort this list
	- `arr = [4, 2, 2, 8, 3, 3, 1]`
```python
def counting_sort(arr):
    # 1. Find the range of the numbers
    max_val = max(arr)
    min_val = min(arr)
    
    range_of_elements = max_val - min_val + 1

    # 2. Initialize count array (indexed values)
    count = [0] * range_of_elements

    # 3. Count each element (sorting the values)
    for num in arr:
        count[num - min_val] += 1

    # 4. Rebuild the sorted array (including multiple occurrences)
    sorted_arr = []
    for i in range(range_of_elements):
        sorted_arr.extend([i + min_val] * count[i])

    return sorted_arr

# Example
arr = [4, 2, 2, 8, 3, 3, 1]
print("Original:", arr)
print("Sorted:", counting_sort(arr))
```

```Output
Original: [4, 2, 2, 8, 3, 3, 1]
Sorted: [1, 2, 2, 3, 3, 4, 8]
```
- `Output` here is just a label to indicate result or console output and isn't a keyword here
#### Explanation
- (1) First we find the range of numbers (minimum and maximum). We do `+1` because we plan to insert the number in the `count` array, but in the form of an index relative to the offset of `min_val`. So for example when we insert `8` into `count`, `8-1 = 7`, based on a 0-indexed array, we'd need 8 spots for room to insert `7`. 
	- `max_val = 8`
	- `min_val = 1`
	- `range_of_elements = 8-1+1 = 8`
- (2) So now we initialize the `count` array which gives `[0, 0, 0, 0, 0, 0, 0, 0]`
- (3) Now we find the difference between each element in `arr` and `min_val`, and count their occurrences within `count`. By default, they'll be sorted
- (4) To rebuild the array, we need to reverse the difference of `num - min_val` back to `i + min_val` and then multiply by the number of occurrences within `count[i]`. So for example, the built `count` is `count = [1, 2, 2, 1, 0, 0, 0, 1]`
	- `arr[0] = 4` which is placed in `count[4-1] = count[3]` and `count[3]+=1` gives `count[3] = 1` as shown above. This was done for each of the elements
	- Now reversing
		- `[i + min_val] * count[i]` gives `[0 + 1] * count[0] = [1]*1 = [1]`
			- `[1+1] * count[1] = [2] * 2 = [2,2]`
		- So the first few elements are `[1, 2, 2, ...]` until we return back the sorted list
## Source [^1]
- 
	- In video example, we try to sort an array in ascending order. 
	- Counting sort works the best when the range of numbers each value could have is very small in the array. 
	- The first part of counting sort is to find the starting index of each number
		- Counting the number of occurrences for each number in the array.
	- The second step is to add each number to the right accumulatively
		- #question Is "accumulatively" the best way to describe it? What is the difference between accumulatively and cumulatively?
## References

[^1]: [Learn Counting Sort Algorithm in LESS THAN 6 MINUTES!](https://www.youtube.com/watch?v=OKd534EWcdk)