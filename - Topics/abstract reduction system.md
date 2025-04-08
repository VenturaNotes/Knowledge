## Synthesis
- 
## Source [^1]
- (abstract rewrite system, abstract replacement system) A general characterization of the process of deriving or transforming data by means of rules. It is an abstraction based primarily on examples of term rewriting systems: it is simply a reflexive and transitive binary relation $\rightarrow_{R}$ on a nonempty set $A$. For $a, b \in A$, if $a$

  

$\rightarrow_{R} \mathrm{~b}$ then $a$ is said to reduce or rewrite to $b$.

Using this abstraction, it is easy to define a range of basic notions that play a role in computing with rules.

(1) An element $a \in A$ is a normal form for $\rightarrow_{R}$ if there does not exist $b$, different from $a$, such that $a \rightarrow_{R} \mathrm{~b}$.

(2) The [[reduction system]] $\rightarrow_{R}$ is Church-Rosser (or confluent) if for any $a \in A$ if there are $b_{1}, b_{2} \in A$ such that $a \rightarrow_{R} \mathrm{~b}_{1}$ and $a \rightarrow_{R} \mathrm{~b}_{2}$ then there exists $c \in A$ such that $b_{1}$ $\rightarrow_{R} \mathrm{c}$ and $b_{2} \rightarrow_{R} \mathrm{c}$.

(3) The reduction system $\rightarrow_{R}$ is [[weakly terminating]] (or weakly normalizing) if for each $a \in A$ there is some normal form $b \in A$ so that $a \rightarrow_{R} \mathrm{~b}$.

(4) The reduction system $\rightarrow_{R}$ is [[strongly terminating]] (or strongly normalizing or Noetherian) if there does not exist an infinite chain

  

$$

a_{0} \rightarrow_{R} \mathrm{a}_{1} \rightarrow_{R} \ldots \rightarrow_{R} \mathrm{a}_{\mathrm{n}} \rightarrow_{R} \ldots

$$

  

of reductions in $A$ wherein

  

$$

a_{i} \neq a_{i+1} \text { for } i=0,1,2, \ldots

$$

  

(5) The reduction system $\rightarrow_{R}$ is complete if it is Church-Rosser and strongly terminating.

(6) A reduction system is Church-Rosser and weakly terminating if, and only if, every element reduces to a unique normal form. Let $\equiv_{R}$ denote the smallest equivalence relation on $A$ containing $\rightarrow_{R}$. If $\rightarrow_{R}$ is a Church-Rosser weakly terminating reduction system then the set $N F\left(\rightarrow_{R}\right)$ of normal forms is a transversal for $\equiv_{R}$, i.e. a set that contains one and only one representative of each equivalence class.
- Reduction system is short for abstract reduction system
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]