---
Source:
  - https://www.youtube.com/watch?v=rD_yO-I7Rhk
Reviewed: false
---
- ![[Screenshot 2025-02-20 at 12.27.56 PM.png]]
	- Proof by induction
		- Prove that $n^2 < 2^n$ for all integers $n \ge 5$ 
		- First, the idea of the argument. What happens when we increase $n$ by 1? One the left-hand side, we increase the base of the square and go to the next square number. On the right-hand side, we increase the power of 2. This means we double the number. So the question is, how does doubling a number relate to increasing to the next square? Think about what the difference of two consecutive squares looks like. We have $(n+1)^2 - n^2$.
		- This factors
			- $(n+1)^2-n^2 = (n+1-n)(n+1+n) = 2n+1$
		- But doubling the right-hand side increases it by $2^n$, since $2^{n+1}$ = $2^n+2^n$. When $n$ is large enough, $2^n > 2n+1$
		- What we are saying here is that each time $n$ increases, the left-hand side grows by less than the right-hand side. So if the left-hand side starts smaller (as it does when n = 5), it will never catch up. Now the formal proof
		- #question Why can you write $2^{n+1} = 2*2^n = 2^n+2^n$?
	- Proof by induction
		- Inductive Case: Let $k \ge 5$ be an arbitrary integer. Assume, for induction, that $P(k)$ is true. That is, assume $k^2 < 2^k$. We will prove that $P(k+1)$ is true, i.e., $(k+1)^2 < 2^{k+1}$. To prove such an inequality, start with the left-hand side and work towards the right-hand side.
	- Proof by Induction
		- #question might need to prove $2k + 1 < 2^k$ first? 