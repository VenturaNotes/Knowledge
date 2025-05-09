---
Source:
  - https://youtube.com/watch?v=Qa6csfkK7_I
Reviewed: false
---
- ![[Screenshot 2023-01-05 at 7.22.02 AM.png]]
	- Finite Automata
		- Finite Automata with output
			- Moore Machine
			- Mealy Machine
		- Finite Automata without output
			- Deterministic Finite Automata (DFA)
			- Nondeterministic Finite Automata (NFA)
			- Epsilon - Nondeterministic Finite Automata ($\epsilon$ - NFA)
- Finite State Machines
	- It is the simplest model of computation
	- It has a very limited memory
- DFA - Deterministic Finite Automata
	- ![[Screenshot 2023-01-05 at 7.23.44 AM.png]]
		- The circles (A, B, C, D) are known as states
		- There are edges that go from A $\rightarrow$ B and B $\rightarrow$ A
			- The edges are transitions
			- The labeling of edges are known as inputs such as "1"
		- If you're in state "A" and the input you get is "1", your state "A" goes to "B"
		- If you're in state "A" and the input you get is "0", your state "A" goes to "C"
		- An arrow coming into state "A" means "A" is the starting state or the initial state of the DFA. When you see an arrow coming from nowhere pointing to a state, that shows that it is the initial state or the starting state.
		- State "D" has double circles around it. It means it is the final state or the terminating state. It is the final state of the DFA
	- Every DFA can be defined using 5-tuples
		- Q, $\Sigma$, $q_o$, F, $\delta$
			- Every DFA can be defined using these 5-tuples
			- Q = set of all states
			- $\Sigma$ = inputs
			- $q_o$ = start state / initial state
			- F = set of final states
			- $\delta$ = transition function that maps from $Q \times \Sigma \rightarrow Q$
		- Example for our DFA
			- Q = {A, B, C, D}
			- $\Sigma$ = {0, 1}
			- $q_o$ = A
			- F = {D}
			- $\delta$ =
				- ![[Screenshot 2023-01-05 at 7.36.25 AM.png]]
					- When "A" receives an input of "0", it goes to "C". 
					- When "A" receives an input of "1", it goes to "B"