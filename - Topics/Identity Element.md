---
aliases:
  - neutral element
---
## Synthesis
- An identity element is a special element within a set that, when combined with any other element in the set using a specific binary operation, leaves the other element unchanged
- More formal definition: 
	- Given a set $S$ and a binary operation $*$ on $S$, an element $e \in S$ is called an identity element if for every element $a \in S$:
		- $a * e = a$ (right identity)
			- #question What is right identity?
		- $e * a = a$ (left identity)
			- #question What is left identity?
	- If an element satisfies both conditions, it's simply called an identity element. In many common algebraic structures, the identity element is unique.
		- #question Which algebraic structures do they have when the identity element is not unique? Are they natural or man-made structures?
- Examples
	- Addition of numbers:
		- For $\mathbb{R}$ and operation of addition $(+)$, the identity element is 0. 
			- Because $a + 0 = a$ and $0 + a = a$ for any real number $a$
	- Multiplication of numbers
		- For $\mathbb{R}$ and operation of multiplication $(*)$, the identity element is 1. 
			- Because $a*1 = a$ and $1*a = a$ for any real number $a$
	- String concatenation
		- For set of all finite strings and operation of concatenation, the identity element is empty string ("")
			- Because concatenating any string with the empty string results in the original string
		- #question Can you use concatenation on numbers? 
## Source [^1]
- (of a set $S$ on which some dyadic operation ${ }^{\circ}$ is defined) An element $e$ with the property that

  

$$

a^{} e=e^{} a=a

$$

  

for all elements $a$ in $S$. It can be shown that $e$ is unique. In normal arithmetic, 0 and 1 are the identity elements associated with addition and multiplication respectively. In a Boolean algebra, 0 and 1 are the identities associated with the OR and the AND operations respectively.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]