## Synthesis
- 
## Source [^1]
- (FSA, finite-state machine) A simple kind of automaton. The input string is read once from left to right, looking at each symbol in turn. At any time the FSA is in one of finitely many internal states; the state changes after each input symbol is read. The new state depends on the symbol just read and on the current state. An FSA is therefore determined by a function $f$

  

$$

f: I \times Q \rightarrow Q

$$

  

where $I$ is the set of possible input symbols, $Q$ is the set of states, and $I \times Q$ is the Cartesian product of $I$ and $Q . Q$ must be finite.

  

The function $f$ is called a [[state-transition function]]. It is commonly represented either by a table or by a directed graph, known respectively as a state-transition table and a state-transition diagram. The figure shows two equivalent representations in which

  

$$

\begin{aligned}

& I=\{a, b, c\} \\

& Q=\{1,2,3,4\}

\end{aligned}

$$

  

In this example,

  

$$

\begin{aligned}

& f(a, 1)=2 \\

& f(c, 4)=4, \text { etc. }

\end{aligned}

$$

  

$f$ extends to strings in the obvious manner: in the example,

  

$$

\begin{aligned}

& f(b c, 2)=4 \\

& f(\text { aaa,3) }=1, \text { etc. }

\end{aligned}

$$

  

Let $Q$ be divided into accepting states and rejecting states, and let $q_{0}$ be some member of $Q$ (referred to as the start state). The language recognized by the FSA is the set of all $w$ such that

  

$$

f\left(w, q_{0}\right)

$$

  

is an accepting state, i.e. the set of all strings that take the start state to an accepting state. For example, in the FSA shown in the figure let $q_{0}$ be 1 and let 4 be the only accepting state; the language recognized is then the set of all strings over $\{a, b, c\}$ that somewhere contain $a b c$ as a substring. A language recognized by an FSA is known as a regular language.

  

| | 1 | 2 | 3 | 4 |

| :--: | :--: | :--: | :--: | :--: |

| $a:$ | 2 | 2 | 2 | 4 |

| $b:$ | 1 | 3 | 1 | 4 |

| $c:$ | 1 | 1 | 4 | 4 |

  

![[A Dictionary of Computer Science [part 6]_img_2.jpeg]]

  

Finite-state automaton. Equivalent transition table and diagram of an FSA

A generalization is to allow more than one state to which the FSA can move, for a given input symbol and current state. This gives a nondeterministic FSA. The input string is then accepted if there is some sequence of choices of moves leading to an accepting state. Such a machine can always be converted to a deterministic one recognizing the same language.

  

See also MINIMAL MACHINE, SEQUENTIAL MACHINE.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]