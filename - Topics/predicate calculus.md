## Synthesis
- 
## Source [^1]
- (predicate logic, first-order logic) A fundamental notation for representing and reasoning with logical statements. It extends propositional calculus by introducing the quantifiers, and by allowing predicates and functions of any number of variables. The syntax involves terms, atoms, and formulas. An atom (or atomic formula) has the form $P\left(t_{1}, \ldots, t k\right)$, where $P$ is a predicate symbol and $t_{1}, \ldots, t k$ are terms. Formulas may be built from these atoms in the following ways:

(a) any atom is a formula;

(b) formulas can be combined by the usual propositional connectives (negation, conjunction, disjunction, etc.);

  

(c) if $F$ is a formula, then $\forall v . F$ and $\exists v . F$ are also formulas (see QUANTIFIER).

  

A sentence is a formula with no free variables. An example of a sentence is

  

$$

\forall x . G(x, c) \leftrightarrow \forall y . G(f(x, y), y)

$$

  

where $\leftrightarrow$ signifies the biconditional and $G$ is a predicate symbol, $f$ is a function symbol, $x$ and $y$ are variables, and $c$ is a constant symbol. The overall meaning of a sentence (true or false) depends on the interpretation given to the symbols occurring in it. For example, let $G$ be interpreted as the predicate 'greater than', $f$ as the operation of multiplication, and $c$ as the number 1 . Then the above sentence says that a number $x$ is greater than 1 if and only if it has the property that, for all $y, x y$ is greater than $y$. This is true if the domain of interpretation is the natural numbers, but not if it is the integers (because of the possibility of negative $y$ ).

  

Predicate calculus can claim to be a fundamental logical language since all the more complicated logics can, in some sense, be reduced to it. A simple but practically important extension is many-sorted predicate calculus. Here there are several sorts of variables, and the operations and relations come from a many-sorted signature.

  

Another possible extension is second-order logic, which allows predicate and function variables, such as $P$ in the following:

  

$$

\begin{aligned}

& \forall P .\{P(a) \wedge \forall k . P(k) \Rightarrow P(s(k))\} \\

& \Rightarrow \forall n . P(n)

\end{aligned}

$$

  

( $\wedge$ and $\Rightarrow$ signify conjunction and conditional.) This example, given the appropriate interpretation of $a$ and $s$, expresses a principle of induction: if $P$ is true for zero, and true for $k+1$ whenever it is true for $k$, then it is true for all $n$. Again this sentence holds for natural numbers but not integers.

  

Applications of predicate calculus in computer science are commonplace and include formal specification, program correctness, logic programming, and databases. See also MODAL LOGIC.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]