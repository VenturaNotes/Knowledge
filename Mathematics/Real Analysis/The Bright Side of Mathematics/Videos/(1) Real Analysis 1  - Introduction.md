---
Source:
  - https://www.youtube.com/watch?v=842rgQP_OgI
Reviewed: false
---
- ![[Screenshot 2024-12-17 at 8.29.02 PM.png]]
	- Analysis that we can do with the [[real numbers]]
	- The topic of [[real analysis]] is also known as [[calculus]]
		- Other names are analysis, infinitesimal calculus
	- Goal: Understanding [[differential]] and [[integral]] calculations
		- Will understand $\frac {df}{dx}$ and $\int_a^bfdx$ 
	- Topics
		- [[Sequence|Sequences]] of [[real numbers]]
		- [[Limits]]
		- [[Continuity]] (will talk about functions that are continuous)
		- [[derivative|derivatives]]
		- [[integral|integrals]]
	- Foundation: [[Real numbers]]: $\mathbb{R}$
		- All you need to know is the real numbers
		- If you don't know about it, can do the "start learning reals" course in "start learning mathematics"
	- Axioms of the reals: A non-empty set $\mathbb{R}$ together with operations +, $\cdot$ and ordering $\le$ is called the real numbers if it satisfies:
		- (A) ($\mathbb{R}, +, 0$) is an [[Commutative group|Abelian group]]
		- (M) $(\mathbb{R}$$\backslash${0}, $\cdot$, 1) is an abelian group (1 $\ne$ 0)
		- (D) [[distributive law]] $x*(y + z) = x*y + x*z$
		- (O) $\le$ is a total order, compatible with + and $\cdot$, Archimedean property
		- (C) Every [[Cauchy sequence]] is a convergent sequence
			- $|x| := \begin{cases} x & \text {if } x \ge 0 \\ -x& \text{if } x < 0 \end{cases}$
				- This is the absolute value of a real number
				- Measures distance from 0 to point x
				- It's very important that we can measure distances to do real analysis
					- That's what the definition of a limit or the definition of a derivative needs
			- This is the [[completeness axiom]] which talks about sequences
		- Roughly it tells us that we have a field of numbers that are also nicely ordered. This simply means that we can visualize the real numbers as the number line
			- Complete number line
		- What to do when you have two numbers in the [[absolute value]]
			- Could be combined by multiplication or addition
			- Absolute value:
				- $|x*y| = |x|*|y|$
				- $|x+y| \le |x| + |y|$
					- This is called the [[triangle inequality]] and we will use that a lot
	- Will start real analysis course in the next video by considering sequences
- Questions
	- (1) Which of these implications for real numbers x $\in$ $\mathbb{R}$ is not correct?
		- $x^2 = 1 \implies x = 1$
			- Recall that $\mathbb{R}$ is a [[fields|field]] and that [[quadratic equation|quadratic equations]] can have two different solutions
				- $x = \pm 1$ 
	- (2) Which of these [[set relations]] is false?
		- The real numbers contain all the numbers $\mathbb{R}$ on the number line
		- This includes: $\pi, \sqrt{2}, 1, 0.\overline{9}, -5, \frac 59$ 
	- (3) Which of these statements for the absolute value |$\cdot$| and real numbers x, y $\in$ $\mathbb{R}$ is NOT correct?
		- $|x + y| = |x| + |y|$
			- The absolute value satisfies the triangle inequality but in general this is not an equality