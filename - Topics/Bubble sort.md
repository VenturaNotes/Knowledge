## Synthesis
- 
## Source [^1]
- Simplest [[sorting algorithm]] that works by repeatedly swapping adjacent elements if they are in the wrong order

## Source[^2]
- Repeatedly swaps adjacent elements if they are in the wrong order

## Source[^3]
```python
length = input()
elements = list(map(int, input().split()))

count = 0
n = length
swapped = True
while swapped:
    swapped = False
    count = count + 1
    for i in range(len(elements)-1):
        if elements[i] > elements[i+1]:
            temp = elements[i]
            elements[i] = elements[i+1]
            elements[i+1] = temp
            swapped = True
print(count)
```
## References

[^1]: https://www.geeksforgeeks.org/python-program-for-bubble-sort/
[^2]: ChatGPT
[^3]: https://www.hackerearth.com/practice/algorithms/sorting/bubble-sort/practice-problems/algorithm/bubble-sort-15-8064c987/?purpose=login&source=problem-page&update=google