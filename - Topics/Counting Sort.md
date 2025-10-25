## Synthesis
- A non-comparison-based sorting algorithm that works by counting the number of occurrences of each distinct element in the input array.
	- Then these counts are used to determine the positions of each element in the sorted output array.

### When to use it
- #question What is a better title that I could give this? 
- Works best when the range of numbers (min to max) is not too large. 
	- #question When is the range considered large? 
- You're sorting integers (not floats or strings)
	- #question So this means it can handle negative numbers? 

### Example
- We want to sort this list
	- `arr = [4, 2, 2, 8, 3, 3, 1]`
```python
def counting_sort(arr):
    # 1. Find the range of the numbers
    max_val = max(arr)
    min_val = min(arr)
    
    range_of_elements = max_val - min_val + 1

    # 2. Initialize count array
    count = [0] * range_of_elements

    # 3. Count each element
    for num in arr:
        count[num - min_val] += 1

    # 4. Rebuild the sorted array
    sorted_arr = []
    for i in range(range_of_elements):
        sorted_arr.extend([i + min_val] * count[i])

    return sorted_arr

# Example
arr = [4, 2, 2, 8, 3, 3, 1]
print("Original:", arr)
print("Sorted:", counting_sort(arr))

```
- #question Why are we adding +1 to the range of elements?
	- So lets say maximum value is 5 and minimum value is 2. Then 5-2 = 3 as a range of numbers. Then we add 1 to get 4. Why? 
	- #question Is it so the count of elements is correct?
- #question What exactly does min(arr) and max(arr) do?
	- I think it just finds the maximum and minimum value within an array.
		- #question What data types does it work on? Lists? Is List or hashmaps data types or is there some other name for them? 
```Output
Original: [4, 2, 2, 8, 3, 3, 1]
Sorted: [1, 2, 2, 3, 3, 4, 8]
```
- #question Is `output` a language like Python or C++? 
#### Dry Run
- arr = `[4, 2, 2, 8, 3, 3, 1]` and it's 0-indexed based
- (1) Initial Values
	- max_val = 8
	- min_val = 1
	- range_of_elements = 8 - 1 +1 = 8
- (2) Count Array
	- count= `[0, 0, 0, 0, 0, 0, 0, 0]`
- (3) Counting each element
	- So we have arr = `[4, 2, 2, 8, 3, 3, 1]`
		- `count[4 - 1]` += 1
			- So 3rd index increases by one and so on
	- In end,  `count = [1, 2, 2, 1, 0, 0, 0, 1]`
- (4) Rebuilding sorted array
	- `sorted_arr = []`
	- Looping 0 - 8 (noninclusive), so 0 to 7 which makes sense
	- `sorted_arr.extend([0+3] * 1) = `
		- #question Could append just work for this problem?

### How It Works
- Problem Statement: We want to sort an array `arr` of `N` non-negative integers, where al
	- #question Would it be possible to work with negative integers?
- (1) 
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