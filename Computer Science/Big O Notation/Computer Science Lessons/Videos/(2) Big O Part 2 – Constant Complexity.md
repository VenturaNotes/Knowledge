---
Source:
  - https://youtube.com/watch?v=1Md4Uo8LtHI
Reviewed: false
---
- ![[Screenshot 2025-02-22 at 10.20.22 PM.png]]
- Slide 1
	- [[Stack]]
		- Items are pushed onto and popped off the top of a stack
		- Peek examines top item without removing it
		- Last in first out data structure ([[Last in, First Out|LIFO]])
		- Implemented with an array and a pointer to the top item
- Slide 2
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
- Pseudocode for a stack push operation
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
- Pseudocode for stack pop operation
- Slide 3
	- When we want to push a new item onto the stack, we increment `top` and the item is copied into that position  
- Slide 4
	- To pop an item from the stack, it's copied from the position given by `Top` and then `Top` is decremented
		- Notice that we don't necessarily remove the item from the stack. It will be overwritten next time we push something else onto it
- Slide 5
	- In terms of complexity, it takes a certain amount of time to push an item onto the stack. Doubling the amount of data takes exactly the same amount of time.
	- The time it takes to remove an item is also independent of the amount of data in the stack
- ![[Screenshot 2025-02-22 at 10.23.44 PM.png]]
	- Slide 1
		- Plotting this information on a chart, we see that we have a nice flat line. No matter how much data there is to push or pop the stack, the time taken stays the same
		- It doesn't matter if it's 500 minutes or 500 microseconds, what matters is that the time complexity is always the same 
	- Slide 2: Stack Operations Complexity
		- Increasing the amount of data makes no difference to the time taken by push or pop
		- The Big O Time complexity is [[constant]]
			- In Big O notation, it's $O(1)$ 
	- Slide 3
		- The chart therefore describes constant time complexity