---
aliases:
  - TM
---
## Synthesis
- 
## Source [^1]
- (TM) An imaginary computing machine defined as a mathematical abstraction by Alan Turing to make precise the notion of an effective procedure (i.e. an algorithm). There are many equivalent ways of dealing with this problem; among the first was Turing's abstract machine, published in 1936.

  

A Turing machine is an automaton that includes a linear tape that is potentially infinite (in both directions), divided into boxes or cells, and read by a read-head that scans one cell at a time. Symbols written on the tape are drawn from a finite alphabet:

  

$$

s_{0}, \ldots, s_{p}

$$

  

The control or processing unit of the machine can assume one of a finite number of distinct internal states:

  

$$

q_{0}, \ldots, q_{m}

$$

  

The 'program' for a given machine is assumed to be made up from a finite set of instructions that are quintuples of the form

  

$$

\begin{aligned}

& q_{i} s_{k} s_{k} X \mathrm{q}_{j} \\

& \text { where } X \text { is } R, L \text {, or } N

\end{aligned}

$$

  

The first symbol indicates that the machine is in state $q_{i}$ while the second indicates that the head is reading $s_{j}$ on the tape. In this state the machine will replace $s_{j}$ by $s_{k}$ and if $X=R$ the head will move to the right; if $X=L$ it will move to the left and if $X=N$ it will remain where it is. To complete the sequence initiated by this triple the machine will go into state $q_{j}$.

  

The machine calculates functions on the natural numbers as follows: a function $f$,

  

$$

\begin{aligned}

& f: \mathbf{N}^{k} \rightarrow \mathbf{N} \\

& \text { where } \mathbf{N}=\{0,1,2, \ldots\}, \\

& \mathbf{N}^{k}=\mathbf{N} \times \ldots \times \mathbf{N} k \text { times }

\end{aligned}

$$

  

is (Turing) computable if for each $x$ in $\mathbf{N}^{k}$, when some representation of $x$ in $\mathbf{N}^{k}$ is placed on the tape (with the machine in the initial state of $q_{0}$ say), the machine halts with a representation of $f(x)$ on the tape. See also EFFECTIVE COMPUTABILITY.

  

It is customary in the study of abstract computation models to make a distinction between deterministic and nondeterministic algorithms. In a deterministic Turing machine the overall course of the computation is completely determined by the Turing machine (program), the starting state, and the initial tape-inputs; in a nondeterministic Turing machine there are several possibilities at each stage of the computation: it can execute one out of possibly several machine instructions. The class of problems solvable by deterministic Turing machines in polynomial time is the class $P$; the class of problems solvable by nondeterministic Turing machines in polynomial time is the class $N P$. See also $\mathrm{P}=\mathrm{NP}$ QUESTION.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]