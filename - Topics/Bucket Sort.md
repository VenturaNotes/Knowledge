## Synthesis
- 
## Source [^1]
- An external sort in which the records to be sorted are grouped in some way, and each group stored in a distinct bucket. Different buckets will probably be stored on different storage devices. If searching is to be performed on the data, then each bucket should contain records with the same hash value (see HASHING). In this way all the records that might contain the required key may be fetched from the external memory at once.

## Source[^2]
```python
def bucket_sort(arr):
    if len(arr) == 0:
        return arr

    # Step 1: Create buckets
    num_buckets = 10
    buckets = [[] for _ in range(num_buckets)]

    # Step 2: Scatter the elements into buckets
    for num in arr:
        index = int(num * num_buckets)  # Assumes input is between 0 and 1
        buckets[index].append(num)

    # Step 3: Sort each bucket
    for bucket in buckets:
        bucket.sort()  # You could also use insertion sort here

    # Step 4: Concatenate all buckets
    sorted_array = []
    for bucket in buckets:
        sorted_array.extend(bucket)

    return sorted_array
```
- Initially checks the length of the array. If it's equal to zero, it just returns the array.
- #question How does this code work? 
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: ChatGPT