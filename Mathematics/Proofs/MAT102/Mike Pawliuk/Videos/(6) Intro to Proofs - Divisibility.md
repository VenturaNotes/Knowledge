---
Source:
  - https://youtube.com/watch?v=KUlSQ58-9zM
Reviewed: false
---
- ![[Screenshot 2023-07-28 at 12.34.32 PM.png]]
	- Slide 1 - Introduction to Proofs - Divisibility
	- Slide 2 - Learning Objectives (for this video)
		- By the end of this video, participants should be able to:
			- (1) State the definitions for [[integer divisibility]], [[prime|primes]], and [[Composite Number|composite numbers]]
			- (2) Make a [[conjecture]] about divisibility and then prove it by definition unwinding, or provide a [[counterexample]]
	- Slide 3 - Divisibility
			- Let d, n be integers. We say that d divides n if there is an integer k such that $n = dk$.
			- We also say d is a divisor of n, or that n is a multiple of d. We represent this as $d|n$
				- d "bar" n means d goes into n
		- Examples
			- 3|12 since 12 = 3 $*$ 4 and 4 is an integer
			- 5| -30 since -30 = 5$*$ (-6), and -6 is an integer
			- a is even if and only if 2|a. (Prove it!)
		- Non examples
			- We use $\huge\nmid$ to mean "does not divide"
				- 12 $\huge\nmid$ 3 since $3 = 12 \cdot k$ has no integer solution
				- 5 is not a multiple of 10
	- Slide 4 - [[Conjecture|Conjectures]]
		- Goal: Discover what is true about divisibility
			- (1) Play. Create 5 examples and 5 non-examples of divisibility
			- (2) Conjecture. Make a conjecture (guess) about how divisibility works for all integers
			- (3) Test. Try to break your conjecture by finding integers that make your conjecture false
			- (4) Modify. Play/conjecture/test again as needed
			- (5) Prove. Prove your conjecture by [[definition unwinding]]
				- Definition unwinding is a proof technique
	- Slide 5 - Example 1
		- After coming up with many examples, you notice the following pattern, and make a conjecture
		- Conjecture
			- Suppose a, b, n are integers and a|n and b|n, then (a+b)|n
		- Test. Now you should attempt to break your conjecture
			- After playing for a while, you discover: 1|4 and 2|4, but 3 $\huge\nmid$ 4.
		- Modify. One option for adjusting your conjecture is
			- Conjecture
				- Suppose d, a, b are integers and d|a and d|b, then d|(a + b)
	- Slide 6 - Example 2
		- After coming up with many examples, you notice the following pattern, and make a conjecture
		- Conjecture
			- Suppose a, b are integers and a|b and b|a, then a = b or a = -b
				- After proving, we have a nice conjecture and is actually a theorem now
		- Proof (something would go wrong if "b" was equal to 0. But if b is 0, you can check if a = 0)
			- Suppose that a, b are integers and that a|b and b|a
			- By definition (of divisibility) there are integers k, m such that $b$ $=$ $ak$ and $a$ $=$$bm$
			- Putting these together, $b = ak = (bm)k$ $$b = b(mk)$$
			- So then 1 = $mk$.
			- So then m = k = 1 (so a = b)
- ![[Screenshot 2023-07-28 at 12.36.36 PM.png]]
	- Slide 7 - Reflection
		- What are the main steps in making and proving a conjecture?
		- Do these steps apply to only divisibility, or can they apply to other definitions?
		- Is it okay to make false conjectures?
		- What is the role of play and creativity in math?