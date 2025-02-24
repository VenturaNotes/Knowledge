---
aliases:
  - stacks
---
## Synthesis
- 
## Source [^1]
### Description
- The time complexity of push or pop for stack is constant
### Push Procedure
```
Procedure Push
	IF Top = MaximumSize THEN
		OUTPUT "Stack overflow"
	ELSE
		Top = Top + 1
		ArrayStack(Top) = new item
	END IF
END PROCDURE
```
- #comment 
	- `Top` appears to be a number which keeps track of the size of the stack. If it equals the MaximumSize value that we've set and we try to push another element onto it, it will just output "Stack overflow"
	- Otherwise, the value of `Top` will be incremented by 1, and the `ArrayStack` will insert the new `item` in that position given by the number of `Top`
### Pop Procedure
```
Procedure Pop
	IF Top = 0 THEN
		OUTPUT "Stack is empty"
	ELSE
		copy item = ArrayStack(Top)
		Top = Top - 1
	END IF
END Procedure
```
- #comment 
	- If the value of `Top` is equal to 0, then it signifies the stack is empty and will print out "Stack is empty"
	- Otherwise, make a copy of the element at the top of the stack and then decrement by 1. I guess in this case, the `ArrayStack` will still keep the value there if the value of `Top` increases again
		- #question Shouldn't the top of the stack be removed rather than just the pointer given by `Top`?
## References

[^1]: [[(2) Big O Part 2 – Constant Complexity]]