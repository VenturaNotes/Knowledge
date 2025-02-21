---
Source:
  - https://www.youtube.com/watch?v=1YGw1nZF0YE
Reviewed: false
---
- ![[Screenshot 2025-02-20 at 12.12.04 PM.png]]
	- Proof by induction
		- Prove for each natural number $n \ge 1$ that $1 + 2 + 3 + \cdots + n = \frac {n(n+1)}{2}$
			- First, let's think inductively about this equation. In fact, we know this is true for other reasons (reverse and add comes to mind). But why might induction be applicable? The left-hand side adds up the numbers from 1 to n. If we know how to do that, adding just one more term (n+1) would not be that hard. For example, if $n = 100$, suppose we know that the sum of the first 100 numbers is 5050 (so 1 + 2 + 3 + ... + 100 = 5050, which is true). Now to find the sum of the first 101 numbers, it makes more sense to just add 101 to 5050, instead of computing the entire sum again. We would have 1 + 2 + 3 + ... + 100 + 101 = 5050 + 101 + 5151. In fact, it would always be easy to add just one more term. This is why we should use induction