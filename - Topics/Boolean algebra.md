## Synthesis
- 
## Source [^1]
- A branch of algebra where the variables have one of two possible values — True or False. These values are often expressed as 1 and 0.
## Source[^2]
- An algebra that is particularly important in computing. Formally it is a complemented distributive lattice. In a Boolean algebra there is a set of elements $B$ that consists of only 0 and 1 . Further there will be two dyadic operations, usually denoted by $\Lambda$ and $v$ (or by. and + ) and called and and or respectively. There is also a monadic operation, denoted here by ', and known as the complement operation. These operations satisfy a series of laws, given in the table, where $x, y$, and $z$ denote arbitrary elements of $B$.

  

There are two very common examples of Boolean algebras. The first consists of the set

  

$$

B=\{\text { FALSE, TRUE }\}

$$

  

with the dyadic AND and OR operations replacing $\Lambda$ and $v$ respectively, and the NOT operation producing complements. Thus 1 and 0 are just TRUE and FALSE respectively. This idea can be readily extended to the set of all $n$-tuples

  

$$

\left(x_{1}, x_{2}, \ldots, x_{n}\right)

$$

  

where each $x_{i}$ is in $B$. The AND and OR operations are then extended to operate between

  

corresponding pairs of elements in each $n$-tuple to produce another $n$-tuple; the NOT operation negates each item of an $n$-tuple.

  

The second common example of a Boolean algebra is the set of subsets of a given set $S$, with the operations of intersection and union replacing $\Lambda$ and $\vee$ respectively; set complement fills the role of Boolean algebra complement.

  

Boolean algebras, named for George Boole, the 19th-century English mathematician, are fundamental to many aspects of computing-logic design, logic itself, and aspects of algorithm design. See table.

  

| idempotent laws: | distributive laws: |

| :-- | :-- |

| $x \vee x=x$ | $x \wedge(y \vee z)=(x \wedge y) \vee(x \wedge z)$ |

| $x \wedge x=x$ | $x \vee(y \wedge z)=(x \vee y) \wedge(x \vee z)$ |

| associative laws: | identity laws: |

| $x \vee(y \vee z)=(x \vee y) \vee z$ | $x \vee 0=x$ |

| $x \wedge(y \wedge z)=(x \wedge y) \wedge z$ | $x \wedge 1=x$ |

| commutative laws: | null laws: |

| $x \vee y=y \vee x$ | $x \vee 1=1$ |

| $x \wedge y=y \wedge x$ | $x \wedge 0=0$ |

| absorption laws: | complement laws: |

| $x \vee(x \vee y)=x$ | $x \vee x^{\prime}=1$ |

| $x \wedge(x \wedge y)=x$ | $x \wedge x^{\prime}=0$ |

  

# Boolean algebra. Laws

## Source[^3]
- A set of elements defined with two binary operations ( $\lor$ and $\land$ ), a unary operation $(\neg)$ and two elements 0 and 1 which possess the following properties:
	- (i) Both operations $\lor$ and $\land$ are commutative and associative.
	- (ii) 0 is an identity for addition and 1 is an identity for multiplication.
	- (iii) Each operation $\lor$ and $\land$ is distributive over the other.
	- (iv) $a \vee(\neg a)=1$ and $a \wedge(\neg a)=0$ for all $a$.
- For example, a power set $\wp(X)$, where $\lor$ is union, $\land$ is intersection, $\neg$ is complentation in $X$, and 0 is the empty set and 1 is $X$, is a Boolean algebra. Compare BOOLEAN RING; see also STONE SPACE.
## Source[^4]
- An algebra introduced by George Boole in 1854 originally to provide a symbolic method for analyzing human logic. Almost a century later it was also found to provide a means for analyzing logical machines. An algebra is a collection of sets together with a collection of operations over those sets. A Boolean algebra may be defined as a set $K$ of Boolean values or constants, along with a set $P$ of three operators AND, OR, and NOT, satisfying certain algebraic laws. The set $K$ contains $2^n$ elements, where $n$ is a nonzero integer, and includes two special elements denoted 0 and 1. Thus in the simplest two-valued Boolean algebra, $K = \{0,1\}$. This is the basis for all digital logic design, from the simplest logic functions to complex microprocessors and computers. The set of all subsets of a given set (S) also forms a Boolean algebra, with AND, OR, and NOT being represented by the set operations intersection, union, and complement, respectively.
- https://www.allaboutcircuits.com/textbook/digital/chpt-7/introduction-boolean-algebra/
	- An introduction to Boolean algebra for electronics engineers
## References

[^1]: [[(Home Page) Glossary by ada computer science]]
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^3]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]
[^4]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]