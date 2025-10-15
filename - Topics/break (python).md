---
aliases:
  - break
---
## Synthesis
- Used within loops such as [[for loop (python)|for loops]] and [[while loop (python)|while loops]] to terminate the loop prematurely based on a condition
### Exit Loop Prematurely
- Exits out of for loops, while loops, and nested loops
```python
# Loop will terminate when i = 3
for i in range(5):
	if i == 3:
		break
	print(i)
```

- Can use break with else Clause
```python
for i in range(5):
    if i == 3:
        break
else:
    print("Loop completed without breaking.")
```
- If loop completes all iterations without encountering a `break`, the `else` block is executed. If the loop is terminate by `break`, the `else` block is skipped
	- In the above example, the loop completes without breaking
### Description
- Scope: The scope of `break` is limited to the loop it is contained in. If there are nested loops, `break` will only exit the innermost loop

### Try... finally block
```python
for i in range(5):
    try:
        if i == 3:
            print("try block broken")
            break
    finally:
        print("This is the finally block, it always executes.")

print("Loop has been exited.")
```
- Here, we see that the print statement in `finally` will always run in each iteration of the for loop even with the `break` statement. 
- [[Exception handling (python)|Exception handling]] involves `try`, `except`, `else`, and `finally` blocks

Output
```
This is the finally block, it always executes.
This is the finally block, it always executes.
This is the finally block, it always executes.
try block broken
This is the finally block, it always executes.
Loop has been exited.
```
## Source [^1]
- 
## References

[^1]: 