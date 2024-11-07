---
aliases:
  - while loop
  - while loops
---
## Synthesis
- 
## Source [^1]
```python
# Prints i as long as it's less than 6
i = 1
while i < 6:
	print(i)
	i+= 1

# Stops loop if i = 3
i = 1
while i < 6:
	if i == 3:
		break
	i += 1

# When i = 3, jump directly to next iteration
i = 0
while i < 6:
	i += 1
	if i == 3: #will skip printing number "3"
		continue
	print(i) 

# Combine while loop withe "else" condition
i = 1
while i < 6:
	print(i)
	i += 1
else:
	print("i is no longer less than 6") #This will just print once

```
#question I want to learn more about the [[break (python)|break]] keyword
#question I want to learn about [[continue (python)|continue]]
#question I want to learn more about [[pass (python)|pass]]

## References

[^1]: https://www.w3schools.com/python/exercise.asp?filename=exercise_while_loops1