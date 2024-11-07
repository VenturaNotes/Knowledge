---
aliases:
  - mergesort
---
## Synthesis
- 
## Source [^1]
Python Code
```python
def merge_sort(arr):
    if len(arr) > 1:
        left_arr = arr[:len(arr)//2]
        right_arr = arr[len(arr)//2:]

        # recursion
        merge_sort(left_arr)
        merge_sort(right_arr)

        # merge
        i = j = k = 0
		'''
		i: left_arr index
		j: right_arr index
		k: merged array index
		'''

        while i < len(left_arr) and j < len(right_arr):
            if left_arr[i] < right_arr[j]:
                arr[k] = left_arr[i]
                i += 1
            else:
                arr[k] = right_arr[j]
                j += 1
            k += 1
        
        while i < len(left_arr):
            arr[k] = left_arr[i]
            i += 1
            k += 1
        
        while j < len(right_arr):
            arr[k] = right_arr[j]
            j += 1
            k += 1
```

## Source[^2]
Dry run of video
![[Screenshot 2022-10-29 at 11.50.34 PM.png]]
## Source[^3]
### Complexities
Time Complexity: $O(nlog(n))$
Space Complexity: $O(n)$ 
## References

[^1]: https://www.youtube.com/watch?v=cVZMah9kEjI
[^2]: https://www.youtube.com/watch?v=Axva2VdsXkk
[^3]: https://medium.com/karuna-sehgal/a-simplified-explanation-of-merge-sort-77089fe03bb2