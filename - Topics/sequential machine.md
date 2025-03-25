## Synthesis
- 
## Source [^1]
- 1. A finite-state automaton with output (in some contexts including machines with infinite state set). Thus there is a function $f$ from the Cartesian product $I \times Q$ to the product $Q \times O$, with $Q$ a set of states and $I, O$ finite sets of input and output symbols respectively. Suppose, for example,

  

$$

\begin{aligned}

& a_{1} q_{0} \mapsto q_{1}, x \\

& b_{1} q_{1} \mapsto q_{1}, y \\

& c_{1} q_{1} \mapsto q_{2}, z

\end{aligned}

$$

  

then, if the machine is in state $q_{0}$ and reads $a$, it moves to state $q_{1}$ and outputs $x$, and so on. Assuming the starting state to be $q_{0}$, it can be seen for example that the input string abbbc is mapped to the output string xyyyz. This mapping from the set of all input strings to the set of all output strings, i.e. $I^{}$ to $O^{}$, is called the response function of the machine. The function $f$ comprises a state-transition function $\mathbf{f}_{Q}$ from $I \times Q$ to $Q$ and an output function $\mathbf{f}_{O}$ from $I \times Q$ to $O$.

  

What is described here is sometimes called a Mealy machine to distinguish it from the more restricted Moore machines. In a Moore machine, the symbol output at each stage depends only on the current state, and not on the input symbol read. The example above is therefore not a Moore machine since

  

$$

f_{0}\left(b, q_{1}\right)=y

$$

  

whereas

  

$$

f_{0}\left(c, q_{1}\right)=z

$$

  

Any Moore machine can be converted to an equivalent Mealy machine by adding more states.

  

A generalized sequential machine is an extension of the notion of sequential machine: a string of symbols is output at each stage rather than a single symbol. Thus there is a function from $I \times Q$ to $Q \times O^{}$. See also GSM MAPPING. 2. Another name for sequential circuit.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]