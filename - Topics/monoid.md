## Synthesis
### Description / Definition
- A monoid is an [[algebraic structure]] from [[abstract algebra]] that consist of
	- A set M: A non-empty collection of elements
		- A monoid cannot be an empty set, as its definition requires the existence of an identity element, which implies at least one element must be present (and an empty set has no elements)
	- A [[binary operation]] $*$ (or $\cdot$, +): An operation that combines any two elements from $M$ to produce another element within $M$. This is known as the [[closure property]]
		- The symbol $\cdot$ is typically pronounced "dot" or "times" (especially in the context of multiplication). You can say "operation" when speaking generally about a binary operation.
	- Axioms: The operation and set must satisfy the following
		- #question Are these axioms below? Where do they come from and why are they agreed upon?
		- [[Associativity]]: For all elements $a, b, c$ $\in$ $M$, the operation must be associative: $(a*b)*c = a*(b*c)$. 
			- Addition is an associative operation
				- Example: (2 + 3) + 4 = 2 + (3 + 4) = 9
		- [[Identity element]]: There exists a specific element e $\in$ M such that $e*a=a*e=a$
			- #question Does the identity element need to be unique or is that true specifically for just monoids?
			- This property is distinct from the [[commutative property]], which states that the order of operands doesn't matter (a*b=b*a). Monoids do not require commutativity. 
				- #question How would monoids not require commutativity of the identity element appears to rely on this commutative property? Could you give me a counterexample to this?
### Monoids in Relation to Other Structures
- A monoid is essentially a semigroup (a set with an associative binary operation) that also possesses an identity element. The difference is precisely the presence of this identity element
	- #question Difference of what? You mean the difference between a monoid and a semigroup is that a monoid has an identity element while a semigroup does not? 
	- #question What is an associative binary operation? 
- Monoids are distinguished from groups because they are not required to have [[inverse|inverses]] for every element. 
	- #question What is a group? 
- Other algebraic structures like groups, rings, or fields, build upon these concepts by adding more operations (a ring has both addition and multiplication) or additional axioms (a group adds the inverse axiom)
	- #question Can you have something more than a binary operation?
### Examples of Monoids
- #question What is a free monoid? 
1. Natural numbers under addition
	- Set: $\mathbb{N} = \{0, 1, 2, 3, ...\}$
		- #question Would the natural numbers not be considered a monoid if 0 was not included since then there would be no identity element?
	- Operation: Addition (+)
	- Identity element: 0 (since $0 + a = a + 0 = a$)
2. Strings under Concatenation
	- Set: All strings over some alphabet. An alphabet in this context is a finite, non-empty set of symbols or characters (e.g., {0, 1} for binary strings, or {a, b, c}). A string is a finite sequence of symbols from this alphabet. 
		- #question So given binary strings, would an example be 01100 and 010? 
	- Operations: [[concatenation]]
	- Identity element: The empty string $\epsilon$ (or sometimes $\lambda$), which is a unique string containing no symbols. It acts as the identity because concatenating it with any other string $s$ results in $s$ itself
		- $\epsilon * \text{"abc"} = \text{"abc"} * \epsilon = \text{"abc"}$ 
3. Square Matrices under Multiplication
	- Sets: All $n \times n$ matrices over a field
		- #question What is a field?
	- Operation: Matrix multiplication
	- Identity element: The identity matrix $I$ or ($I_n$), which is a square matrix with 1s on the main diagonal and 0s elsewhere. It satisfies $I * A = A*I = A$ 
### Applications of Monoids
- Computer Science
	- Monoids are widely used in theoretical computer science, particularly in [[automata theory]] and formal languages, where strings and concatenation form a monoid
- Programming
	- [[Functional programming]] often uses monoids for structuring data transformations and aggregations
		- Examples of transformations and aggregation
			- Transformation: Mapping a list of numbers to their squares
				- $[1, 2, 3] -> [1, 4, 9]$
			- Aggregation: Summing a list of numbers
				- $[1, 2, 3] -> 6$ 
				- Finding the maximum value in a list, or concatenating a list of strings
				- Monoids are useful here because their [[associativity]] allows for efficient parallel or distributed processing of operations
					- #question what does this mean and I need an example
					- #question What is parallel processing and what does it look like?
					- #question What is distributed processing and what does it look like?
- [[Category Theory]]: Monoids relate closely to categories with a single object. Category theory is a branch of mathematics that studies abstract structures and the relationships between them. In this context, the single object represents the monoid's set, and the morphisms (arrows) from that object to itself represents the monoid's elements. The composition of morphisms corresponds to the monoid's binary operation, and the identity morphism is the monoid's identity element
	- #question What is an example of a single object?
	- #question What is a morphism and I need an example
	- #question What is composition of morphisms? I just need an example of this category theory concept in action
### Organize
- A monoid is an algebraic structure because it consists of a set equipped with a binary operation that satisfies specific axioms. 
	- A set: a monoid is defined over a non-empty set, often denoted as $M$
	- A binary operation: There is a single binary operation, typically denoted by $*$ (or sometimes $+$ or $\cdot$), which takes two elements from the set $M$ and combines them to produce another element within $M$. This property is called closure
	- Axioms: The operation and the set must satisfy the following axioms
		- Associativity: For all elements $a, b, c$ in $M$, the operation must be associative $(a*b)*c =a*(b*c)$.
		- Identity Element: There must exist a unique element $e$ in $M$, called the identity element, such that for every element $a$ in $M$, $a*e = e*a = a$
	- These three components (a set, binary operation, and the satisfaction of associativity and identity axioms are precisely what define a monoid as an algebraic structure).
		- #question Isn't there a 3rd thing though? 
## Source[^1]
- A semigroup that possesses an identity element, $e$. If $S$ is a semigroup on which there is defined a dyadic operation , then$$x^{} e=e^{} x=x$$for all elements $x$ in $S$. Monoids play an important role in various areas of computing, especially in the study of formal languages and parsing.
## Source[^2]
1. A monoid is a set with a [[binary operation]]
2. Commutativity is not a requirement for a monoid; it only needs closure, associativity, and identity element
	- #question What is commutativity, closure, associativity and identity element?
3. Closure means that performing the binary operation on any two elements of the set will result in another element from the same set
4. Natural numbers under addition, natural numbers under multiplication, and strings under concatenation are all examples of a monoid (because they satisfy the properties of a monoid: closure, associativity, and an identity element)
	- #question II would like to see a practice problem for this
5. The identity element for natural numbers under addition is 0 because adding 0 to any number does not change its value
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: https://www.tutorialspoint.com/discrete_mathematics/quiz_on_discrete_mathematics_monoid.htm