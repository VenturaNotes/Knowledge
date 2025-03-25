---
aliases:
  - collection
  - family
  - sets
---
## Synthesis
- 
## Source [^1]
- $A \backslash U$
	- The set of all elements in A not in U
## Source[^2]
- A set is a well-defined collection of objects
	- Allows us to determine for any given object `x` whether or not `x` belongs to the set
- Objects that belong to a set are called elements/members
- Sets typically denoted by capital letters such as `A` or `X`
- If `a` is an element of set A, we write 
	- $a \in A$ 
- Every set is a [[subset]] of itself
## Source[^3]
- A set is composed of elements or members where each element is a possible outcome
- A set is denoted by capital letters

## Source[^4]
- Sets and [[maps]] are considered basic building blocks of mathematical world

## Source[^5]
- ![[Screenshot 2024-12-12 at 9.49.29 AM.png|300]]
	- A set is a collection of distinct objects into a whole
		- Not necessarily a correct definition, but idea we have in mind
	- Such an object `x` inside a set M is called an [[members|element]] of M, written as: $x \in M$ 
	- If `x` is not such an object inside the set M, we write $x \notin M$ 
		- Which equivalently means: $\lnot (x \in M)$ 
- A set can be [[defined by]] giving all its elements
	- $A := \{2, 5, 6\}$
		- No order
		- Lefthand side is defined by the righthand side
### Examples of Sets
- [[Empty set]]
	- Has no elements
	- $\varnothing$ := {}
- [[Natural Numbers]]
	- $\mathbb{N}$ := {1, 2, 3, 4, 5, ...}
	- Explicitly including zero: $\mathbb{N}_0 := \{0, 1, 2, 3, 4, ...\}$
- [[Integers]]
	- $\mathbb{Z}:= \{..., -2, -1, 0, 1, 2, ...\}$
- [[Rational Numbers]]
	- $\mathbb{Q}$
- [[Real Numbers]]
	- $\mathbb{R}$
- [[Complex Numbers]]
	- $\mathbb{C}$

## Source[^6]
### Counting with Sets
- Can solve a problem using sets
- Given a restaurant offers 8 appetizers and 14 entrées, how many choices do you have if you will eat one dish, either an appetizer or an entrée.
	- This problem uses the [[additive principle]] so we can create two disjoint sets with [[Cardinality|cardinalities]] $|A| = 8$ and $|B| = 14$ where A contains 8 appetizers and B contains 14 entrees. 
	- This problem is the same thing as asking the [[union]] of both sets giving $|A \cup B| = |A| + |B| = 8 + 14 = 22$

## Source[^7]
- 1. A collection of distinct objects of any sort. The objects in the set are called its members or elements. An element can occur at most once in a set and order or arrangement is unimportant. If $x$ is a member of the set $S$ it is customary to write

  

If $x$ is not a member of $S$ this can be expressed as

  

$$

x \notin S

$$

  

and is equivalent to

  

$$

\operatorname{NOT}(x \in S)

$$

  

i.e. $\in$ and $\notin$ can be regarded as operators. When any element in set $S$ is also in set $T$, and vice versa, the two sets are said to be identical or equal.

  

A finite set has a fixed finite number of members and a notation such as

\{Ada, Pascal, Cobol, C\}

is possible; the members are separated by commas and here are just the names of various programming languages. When the number of elements is not finite, the set is said to be infinite and explicit enumeration of the elements is not then possible.

  

Infinite and finite sets can be described using a predicate or statement such as $p(x)$ that involves $x$ and is either true or false, thus

  

$$

\{x \mid p(x)\}

$$

  

This is read as 'the set of all elements $x$ for which $p(x)$ is true', the elements being characterized by the common property $p$. Examples of sets described in this way are (letting $R$ be the set of real numbers):

  

$$

\begin{aligned}

& \{(x, y) \mid x \in R, y \in R \text { and } x+y=9\} \\

& \{n \mid n \text { is a prime number }\} \\

& \{l \mid l \text { is the name of a language }\}

\end{aligned}

$$

  

There is an implicit assumption here that there is some algorithm for deciding whether $p(x)$ is true or false in any particular case.

  

The idea of a set is fundamental to mathematics. It forms the basis for all ideas involving functions, relations, and indeed any kind of algebraic structure. Authors differ considerably in the way they define sets. A mathematical logician will distinguish carefully between classes and sets, basically to ensure that paradoxes such as Russell's paradox cannot occur in sets. However, the informal definition is adequate for most purposes. See also OPERATIONS ON SETS. 2. Any data structure representing a set of elements. One example is a characteristic vector. 3. To cause the condition or state of a switch, signal, or storage location to change to the positive condition.
## References

[^1]: [[(28) Universal Set Example Problems - Set Builder Notation, Absolute Complement, Roster Notation#^19ae11]]
[^2]: [[Home Page - Abstract Algebra Theory and Applications 2022 Edition by Thomas W. Judson]]
[^3]: [[(2) Probability & Statistics (2 of 62) Definition of Sets and Elements]]
[^4]: [[(1) Start Learning Mathematics]]
[^5]: [[(5) Start Learning Sets - Part 1 - Overview and Element Relation]]
[^6]: [[(1) Introduction to Counting Using Additive and Multiplicative Principles]]
[^7]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]