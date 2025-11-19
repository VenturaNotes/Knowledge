## Synthesis
```python
import random

test = [0.25, 0.25, 0.25, 0.25]

idx = random.choices(range(len(test)), weights=test, k=1)[0]
print(idx)
```
- In random.choices()
	- `range(len(test))` creates the list of indices to choose from
		- `range(4)` $\to$ `0, 1, 2, 3`
	- `weights = test`
		- Finds the probability weight for each index. In this case
			- Index 0 has weight 0.25
			- Index 1 has weight 0.25
			- Index 2 has weight 0.25
			- Index 3 has weight 0.25
			- The chance of being picked is proportional to its weight
		- Side note
			- The weights do NOT need to add up to 1. random.choices() automatically normalizes them, but all weights must be non-negative numbers (integers or floats)
			- The function will just use their relative proportions.
	- `k = 1`
		- requests one random choice
	- `random.choices()` returns a list even if you ask for one item, so you do `[0]` to retrieve the index integer such as `2`
## Source [^1]
- 
## References

[^1]: 