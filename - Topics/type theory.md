## Synthesis
- 
## Source [^1]
- A branch of mathematical logic and computer science that serves as an alternative foundation for mathematics and computation.
	- #question What other types of foundation for mathematics and computation are there? 
	- Instead of working with sets through [[set theory]], type theory organizes [[mathematical objects]] into types
		- #question what is a mathematical object?
		- #question what is meant by types? 
	- A [[type]] specifies a collection of values and operations that can be performed on those values, ensuring logical consistency and avoiding paradoxes like [[Russell's paradox]] in [[naive set theory]]
		- #question what are these two?
		- #question What is a type?
- Type theory provides a formal system where:
	- Every term has a type
		- This ensures that operations are only applied to terms where they make sense (can't add a number to a function)
			- #question what is meant by term?
	- Types prevent contradictions:
		- By restricting how objects can be combined, type theory avoids ambiguities and paradoxes
			- #question how does it do this?
### Key Ideas in Type Theory
- [[Dependent Types]]: Types that depend on values. For example, a type might represent vectors of a certain length, where the length is part of the type.

## Source[^2]
- In type theory, the basic object of study is a [[type (type theory)|type]]. Here are some types:
	- $\mathbb{N}$ ([[natural numbers]])
	- $\mathbb{Z}$ ([[integers]])
	- $\mathbb{S}^1$ ([[circle]])
	- $\pi_1$ ([[fundamental group]])
	- = ([[identity type]])
- Types can have [[term (type theory)|terms]]
	- 0 is a term of type $\mathbb{N}$, written as 0 : $\mathbb{N}$ 
		- This is an example of a [[type declaration]]
- Another example of a type declaration is $\mathbb{Z}$ : Type, saying that $\mathbb{Z}$ is a type. 
	- There is a "type of types" denoted $Type$, and it can cause inconsistencies if not careful
		- #question what is meant by "type of types?"
		- We can use [[universes]] to put this on solid formal ground, but won't do so until needed
			- #question what are universes in type theory? 
- Basic statements in type theory are known as [[judgements]]. Our judgements will look like:
	- $\Gamma \vdash A : Type$ 
	- $\Gamma \vdash x : A$ 
	- $\Gamma \vdash A \equiv B : Type$ 
	- $\Gamma \vdash x \equiv y : A$ 
- $\Gamma$ is a finite sequence of type declarations, known as a [[context (type theory)|context]]
	- These intuitively mean that the assumptions in the left-hand context imply the right-hand side. 
- The symbol $\equiv$ stands for [[judgmental equality]]
	- Need to differentiate it from the type = which we'll see later (this type represents [[propositional equality]])
- The [[context (type theory)|context]] can be empty
	- We can have the [[judgements|judgement]] $\vdash 0 : \mathbb{N}$ 
- We'll have certain [[inference rules (type theory)|inference rules]] saying how to derive judgements from other ones. 
	- A collection of such rules is known as [[type theory]]
- There are "obvious" judgements such as $x : A \vdash x : A$ which always hold
	- #question How is this an obvious judgement?
	- X $\vdash$ Y means "The Information in X lets you prove that Y is true". You can read this as "X says that Y is true"[^3]
	- The $\vdash$ is known as the [[turnstile symbol]][^4]
### Function Types (AKA Lambda Calculus)
- [[Function Types]]
## Source[^5]
- A [[type formation rule]] 
## References
[^1]: ChatGPT
[^2]: https://math.berkeley.edu/~forte/notes/type_theory.pdf
[^3]: https://cs.stackexchange.com/questions/41834/type-theory-notation-troubles
[^4]: https://en.wikipedia.org/wiki/Turnstile_(symbol)#:~:text=In%20Unicode%2C%20the%20turnstile%20symbol,assertion%20sign%20(%E2%8A%A6).)
[^5]: https://ncatlab.org/nlab/show/type+formation