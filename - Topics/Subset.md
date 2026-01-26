---
aliases:
  - subsets
tags:
  - in-progress
---
## Synthesis

### Recursive Approach to Finding all Subsets
```python
def get_subsets_recursive(nums):
    subsets = []
    current_subset = []

    def backtrack(index):
        # Base case: We've considered all elements
        if index == len(nums):
	        # Add a copy of the current subset
            subsets.append(list(current_subset))
            return

        # Recursive step 1: Include the current element
        current_subset.append(nums[index])
        backtrack(index + 1)
        current_subset.pop() # Backtrack: remove the element for the next choice

        # Recursive step 2: Exclude the current element
        backtrack(index + 1)

    backtrack(0)
    return subsets
```
- #question What does it mean to return nothing within a method? Is that different than continue? 
#### Dry Run
```python
my_set = [2, 5, 6]
print(get_subsets_recursive(my_set))
```
- Answer = $2^3$ = 8
	- All Subsets: `[], [2], [5], [6], [2, 5], [2,6], [5,6] [2, 5, 6]`

| Cycles                         | 1st Cycle                             | 2nd Cycle                            | 3rd Cycle                               | 4th Cycle                                           | 5th Cycle                       |
| ------------------------------ | ------------------------------------- | ------------------------------------ | --------------------------------------- | --------------------------------------------------- | ------------------------------- |
| Initial                        | `index = 0` and `current_subset = []` | `index = 1 and current_subset = [2]` | `index = 2 and current_subset = [2, 5]` | `index = 3 and current_subset = [2, 5, 6]`          | `index = 3 and current_subset = |
| `index == len(nums)`           | `0 != 3` (skipped)                    | 1 != 3 (skipped)                     | 2 != 3 (skipped)                        | 3 == 3<br>Append `[2, 5, 6]` to subsets and DONE 🟢 |                                 |
| `current_subset` after adding  | `[2]`                                 | `[2, 5]`                             | `[2,5,6]`                               |                                                     |                                 |
| 1st Backtrack                  | Go to 2nd                             | Go to 3rd                            | Go to 4th                               |                                                     |                                 |
| `current_subset` after popping |                                       |                                      | `[2, 5]`                                |                                                     |                                 |
| 2nd Backtrack                  |                                       |                                      | Go to 5th                               |                                                     |                                 |
- #question Do you have to do `list()` to make a copy? 
- #question Does return and break do the same thing in the code? 
## Source[^1]
- You can have a [[Proper Subset]] and an [[Improper Subset]]
- Given an improper subset A $\subseteq$ B
	- Every element of A is in B

## Source[^2]
- Transitive Property of Subsets
	- Can have a transitive relation

## Source[^3]
- (of a set $S$) A set $T$ whose members are all members of $S$; this is usually expressed as$$T \subseteq S$$A subset $T$ is a proper subset of $S$ if there is some element in $S$ that is not in $T$; this is expressed as$$T \subset S$$
## References

[^1]: [[(Video) Elementary Set Theory in 49 minutes by Dennis Davis]]
[^2]: [[(40) Proof - Subset is a Transitive Relation - Set Theory, Subsets, Transitivity]]
[^3]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]