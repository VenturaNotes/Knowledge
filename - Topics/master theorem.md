## Synthesis
- The Master Theorem provides a method for solving recurrence relations of the form $T(n) = aT(n/b) + f(n)$, where $a \ge 1, b > 1$ are constants and $f(n)$ is an asymptotically positive function 
	- #question What do the variables stand for? How can I come up with this equation on my own?
	- #question What is a recurrence relation? Could you give an example of this?
	- #question How do we determine if a function is asymptotically positive?
- The theorem is useful for analyzing the time complexity of divide-and-conquer algorithms
	- #question Could you show an example of the master theorem being used for this? Does the master theorem use big O notation?
- The theorem has three cases, which compares $f(n)$ with $n^{log_b a}$
	- #question Why do we care about comparing with $n^{log_ba}$?
	- Case 1
		- If $f(n) = O(n^{log_ba - \epsilon})$ for some constant $\epsilon > 0$, then $T(n) = \Theta(n^{log_ba-\epsilon})$ 
			- This case applies when $f(n)$ grows polynomially slower than $n^{log_b{a}}$
			- #question What does epsilon exactly mean in this case? 
			- #question  I would like to see an example where this is true
	- Case 2
		- If $f(n) = \Theta(n^{log_ba}log^kn)$ for some constant $k \ge 0$, then $T(n) = \Theta(n^{log_ba}log^{k+1}n).$ 
			- This case applies when $f(n)$ grows at a similar rate to $n^{log_ba}$ (possibly with a polylogarithmic factor)
				- #question What does a polylogarithmic factor look like?
		- #question  I would like to see an example where this is true
	- Case 3
		- $f(n) = \Omega(n^{\log_b a + \epsilon})$ for some constant $\epsilon > 0$, and if $a f(n/b) \le c f(n)$ for some constant $c < 1$ and all sufficiently large $n$ (the "regularity condition"), then $T(n) = \Theta(f(n))$
			- This case applies when $f(n)$ grows polynomially faster than $n^{log_ba}$.
		- #question  I would like to see an example where this is true
		- #question What does $\Omega$ mean in this case?
		- #question What is the regularity condition?
- The master theorem simplifies the process of determining the asymptotic bounds for many common recurrence relations without needing to use methods like recursion trees or substitution
	- #question What does $\Theta$ mean?
	- #question What would using methods like recursion trees and substitution look like?
	- #question Could you give me an example of a recurrence relation?
- #question An example of the master theorem in action would be helpful
## Source [^1]
- 
## References

[^1]: