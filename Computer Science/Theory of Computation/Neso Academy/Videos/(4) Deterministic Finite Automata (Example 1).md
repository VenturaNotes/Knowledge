[Video](https://youtube.com/watch?v=40i4PKpM0cI)

- L1 = Set of all strings that start with '0'
	- L1 is a [[(2) Finite State Machine (Prerequisites)#^e0c9c0|language]]
	- ![[Screenshot 2023-01-05 at 7.43.44 AM.png]]
	- It's in infinite set because any string that starts in 0 will be present in the above language
- ![[Screenshot 2023-01-05 at 7.49.31 AM.png]]
	- Always start a DFA with a start state
	- "C" is a dead state or trap state
		- This string is rejected because it cannot reach the final state
	- When the string ends in the final state, it's accepted
