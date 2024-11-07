[Video](https://youtube.com/watch?v=ehy0jGIYRtE)

- NFA
- Deterministic Finite Automata
	- Determinism
		- In DFA, given the current state we know what the next state will be
		- It has only one unique next state
		- It has no choices or randomness
		- It is simple and easy to design
	- ![[Screenshot 2023-01-05 at 7.20.59 PM.png]]
- Non-deterministic Finite Automata
	- Non-determinism
		- In NFA, given the current state there could be multiple next states
			- In State A when given an input of 0, it could go to state A or to state C
		- The next state may be chosen at random
		- All the next states may be chosen in parallel
			- You could simultaneously choose the next states for a particular input
	- ![[Screenshot 2023-01-05 at 7.24.33 PM.png]]
		- The $\epsilon$ means that state A could accept an empty input and go to state 
			- DFA does not have $\epsilon$ has input