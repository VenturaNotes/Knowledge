---
Source:
  - https://youtube.com/watch?v=Fpmr1nHqYrw
Reviewed: false
---
- How to figure out what a DFA recognizes
- ![[Screenshot 2023-01-05 at 8.28.47 AM.png]]
	- L = {accepts the string 01 or a string of at least one '1'} followed by a '0'}
	- Examples
		- ![[Screenshot 2023-01-05 at 8.34.55 AM.png]]
		- ![[Screenshot 2023-01-05 at 8.34.37 AM.png]]
			- These all go to dead states
		- X is our dead state
		- If you see an example given without a dead state, or a specific state does not have a place to go, assume that it goes to a dead state