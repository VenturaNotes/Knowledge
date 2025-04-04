---
Source:
  - https://www.youtube.com/watch?v=LuGs7WhlHWA
Reviewed: false
---
- ![[Screenshot 2023-09-13 at 10.29.09 PM.png]]
	- [[Finite state machine|finite state machines]]
		- Will talk about [[regular language|regular languages]] and [[regular expressions]]
	- Finite State Machine (F.S.M)
		- Also: "Finite Automaton"
			- One automaton
			- Two automata
				- This is plural version
	- The simplest model of computation
	- Models a small computer or controller
		- Limited Memory
		- Finite & usually quite small
			- Typically a small number of states which can be represented with a small number of bits
	- Equal in Expressive Power (describes the same class of language. Each can be converted into the other)
		- [[regular language|regular languages]]
		- [[Regular expressions]]
		- [[Finite state machine|finite state machines]]
	- [[Finite state machine]] example
		- Parts
			- [[States]] (nodes)
			- [[Transitions]] (Edges)
		- We see a directed graph
			- Circles are states (or nodes) (4)
				- Need to be unique (will sometimes put names on them. In other examples, may not bother to write names of states)
			- edges are transitions (equivalently)
				- All edges will always be labeled with symbols
					- Key aspect of finite state machines
		- Each finite state machine has one node that's distinguished as the [[starting node]] or the initial node
			- node "a" in this case
				- Indicated with a little arrow that comes from nowhere and is unlabeled
			- initial state may be labeled with something else than an arrow
		- [[Starting State]]
			- Always exactly one starting state the "initial state"
		- [[Accepting State]] (or "final" states)
			- There can be several accepting states and some finite state machines may not have any accepting states (but that's a [[degenerate case]])
			- "d" is the one accepting state in this case
			- May be more than 1 but technically can be 0 as well
		- Alphabet of Symbols (symbols that label the edges)
			- $\Sigma$ = {0, 1}
				- Other examples will have different alphabets
- ![[Screenshot 2023-09-13 at 10.37.28 PM.png]]
	- Finite state machines
		- Can Generate Strings
			- Start at starting state
			- Take transitions at random
			- Finish up only in an "accepting" state
				- After traversing the edges (and you use the labeled edge)
				- Can't stop unless you're in an accepting state
				- As each edge is traversed, you have a [[symbol]]. Stringing all the symbols together creates a string of symbols
			- The set of strings you can generate?
				- What is the set of all strings it can generate?
		- Can accept strings (the term "recognize" is used for languages as a whole while "accept" is used for strings)
			- Start in starting state
				- Given a string of symbols from the alphabet in the beginning.
			- Start at first symbol in the string 
			- Follow transitions as determined by the symbols in the string
			- Process all symbols in string
			- Do you end up in an "accepting" state or not?
			- The set of strings that are accepted?
				- Form a language?
			- Others are "rejected?"
				- Then the string is not included in the language that the finite state machine defines
- ![[Screenshot 2023-09-13 at 10.57.28 PM.png]]
	- Formal Definition of finite state machine
		- Described by a 5-tuple (quintuple of things)
			- M = (Q, $\Sigma$, $\delta$, $q_0$, F)
				- [[Q]] = A finite set of states ^19b6f2
					- Do not allow an infinite number of states
						- Used the word infinity wrong here since infinity is not a number?
					- The number of states in a finite state machine is relatively small on the order of perhaps a half a dozen or so
				- $\Sigma$ ([[Sigma]]) = Alphabet, Finite Set of symbols
					- Typically quite small
						- If {0, 1}, it would have a size of 2
				- $\delta$ ([[delta]])  = The Transition Function (maps states and symbols to states)
					- $S : Q \times \Sigma \to Q$ 
						- delta is a function that takes two arguments and gives a result
							- Given a state (Q) and a symbol ($\Sigma$, it will tell you what state you'll go to (Q)
								- If we're in state C and see a 1, the transition function will put us in state D (as given in picture above)
				- $q_0$ = The [[starting state]]
					- $q_0 \in Q$ (or "initial state")
						- is little "q" sub-zero
						- Needs to be an element of set Q meaning it has to be a state
				- [[F]] = The set of accept states (or "Final States")
					- $F \subseteq Q$
						- Typically a nonempty subset (can be empty)
							- If it were empty, the finite state machine would accept no strings
								- That is a degenerate case
						- Typically there will be one or more final states in finite state machine
- ![[Screenshot 2023-09-13 at 11.07.55 PM.png]]
	- Example finite-state machine
	- Final states indicated by a double circle
	- Symbols of alphabet will be the labeled edges
	- $q_0$ is the initial state
	- F is the set of final states
	- $\delta$ Is our transition function
		- In a finite state machine, we have a finite number of states and a finite number of symbols
	- $\{0,1\}^*$ =
		- Indicates all strings of 0s and 1s since that is the given alphabet
	- Might notice that edges which are horizontal are labeled with 1 and edges that are vertical are labeled with 0
		- May notice an even or odd thing going on
	- If FSM has an odd number of 1s, will cross squiggly line
	- FSM accepting all the strings where there is an odd number of 0's and an odd number of 1's