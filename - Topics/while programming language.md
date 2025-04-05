## Synthesis
- 
## Source [^1]
- A small imperative programming language whose programs are based on a signature $\Sigma$ and are made from assignments, sequential composition, conditional statements, and while statements. Programs in the language are defined, using an abbreviated BNF notation, by

  

$$

\begin{aligned}

& S:=x:=t \mid S_{1}, S_{2} \\

& \text { if } b \text { then } S_{1} \text { else } S_{2} \text { fi } \mid \text { while } b \text { do } S \text { od }

\end{aligned}

$$

  

where $x$ is any variable, $t$ is any term over the signature $\Sigma b$ is a Boolean term, and $S, S_{1}$, and $S_{2}$ are [[while program|while programs]]. The role of the signature is to define the data types (and hence the types of variables needed) and the basic operations on data (and hence the terms that appear in assignments). The while programming language can compute functions and sets on any algebra with signature $\Sigma$. When applied to the simple algebra

  

$$

([0,1,2, \ldots] \mid 0, n+1)

$$

  

of natural numbers, the while programs compute all partial recursive functions. The while language is an important language for the theoretical analysis of ideas about imperative languages. It is easily extended by adding constructs, such as the concurrent assignment, repeat and for statements, and nondeterministic constructs (like the random assignment $x:=$ ?).
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]