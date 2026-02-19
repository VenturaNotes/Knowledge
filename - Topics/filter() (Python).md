---
aliases:
  - filter()
---
## Synthesis
- It seems to expect 2 arguments. Given
```python
myTest = [1, 2, 3, 4, 5]

def test(lst):
    return 0

for i in filter(test, myTest):
    print(i)
```
- The above will return nothing. If you modify the `test` function to `return 1`, then it returns
```Output
1
2
3
4
5
```
## Source [^1]
- 
## References

[^1]: