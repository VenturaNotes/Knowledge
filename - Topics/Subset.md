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
- #question What does it mean to return nothing within a method? 
#### Dry Run
```python
my_set = [2, 5, 6]
all_subsets = get_subsets_recursive(my_set)
print(all_subsets)
```
- Output Flow:
	- 
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