---
Source:
  - https://www.youtube.com/watch?v=1VMgVZpwLGQ
Reviewed: false
---
- ![[Screenshot 2023-12-19 at 2.43.47 PM.png]]
	- We use [[Turing machines]] as an abstract model for a computer
	- What does it mean to solve a problem?
		- definition (computing a function)
			- Let $f : \{0, 1\}^* \to \{0, 1\}^*$ be a problem, Let T : $\mathbb{N} \to \mathbb{N}$ and let M be a TM (Turing machine)
				- We say M computes f in T(n) time if for every $x \in \{0,1\}^*$, if M is initialized to the start configuration for input x, then after at most T(|x|) steps the TM halts and outputs f(x)
			- The function T gives an upper-bound on number of steps that Turing machine performs
			- We say that M computes $f$ if it computes $f$ in $T(n)$ time for some [[function (math)|function]] T : $\mathbb{N} \to \mathbb{N}$
				- Means that the Turing machine computes the function $f$ if for every input it produces the correct output and does so within a limited number of computational steps
				- Means TM always halts!
			- $T(n)$ expresses how many steps allowed for each length of input
				- T(n) gives you relationship between size of input and number of steps Turing machine is allowed to perform
			- If there is a single input for which the machine does not halt, the machine doesn't compute anything
				- A machine that computes function f needs to halt on every input