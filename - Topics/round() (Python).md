---
aliases:
  - round()
---
## Synthesis
- 

## Original
```python
print(round(2.675, 2)) # 2.67
print(round(2.675001, 2)) # 2.68
print(round(3.145, 2)) # 3.15
```
- It appears that while the `round(x,2)` function and `{:.2f}.format` both round to the nearest second decimal-place, it is affected by floating-point number calculations
	- Above, `2.675` is rounded to `2.67` despite `5` in the 3rd decimal place 
	- So typically you round up if the next digit is `5` but not always
## Source [^1]
- Result of `(2.675, 2)` is `2.67`
## References

[^1]: [[Home Page - 500+ Python Interview Questions and Answers by applyre]]