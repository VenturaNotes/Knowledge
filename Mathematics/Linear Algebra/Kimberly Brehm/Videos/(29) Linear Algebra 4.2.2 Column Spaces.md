---
Source:
  - https://youtube.com/watch?v=2L0qOtgu9eE
Reviewed: false
---
 - ![[Screenshot 2024-12-26 at 7.55.06 AM.png]]
	 - [[Column space]]
	 - What is it?
		 - The column space of an $m \times n$ matrix A is the set of all linear combinations of the columns of A (meaning it's the span of those columns )
		 - If A = $[a_1 a_2...a_n]$, then col A = span $[a_1 a_2 ... a_n]$
			 - $Col A = \{b | b = Ax \text{ for some } x \in \mathbb{R}^n\}$
				 - So it's every single value that provides us with a solution meaning it's in the span
		 - If A is an $m \times n$ matrix, Col A is a [[subspace]] of $\mathbb{R}^m$ 
			 - A theorem in our textbook says this
			 - We know that the span of vectors is in fact a column space of $\mathbb{R}^m$
	 - Practice
		 - Is vector in the [[null space]] of matrix A (True)
			 - For this to be true it simply means $A \vec u = 0$ needs to be true
		 - Is vector in the column space of A? (False)
			 - For column space, we'll take A and augment it with $\vec u$. Then we'll do row reduction and determine if it's a consistent system or inconsistent. If system is consistent, you'd be in the column space of A. If inconsistent, then it's not.
				 - No right or wrong way to do row operations. Just trying to get it to point where it's in [[Reduced Row Echelon Form|RREF]] or we find out not enough pivots and it's inconsistent.
				 - Clear no pivot in second column meaning not enough pivots meaning inconsistent meaning $\vec u$ does not belong to column space of A
	 - Practice
		 - Find a matrix A such that $w = col A$ 
			 - w can be rewritten as a [[linear combination]], then we find [[span]]
	 - Practice
		 - Find a nonzero vector in Col A
			 - Can just choose any column in A
		 - Find a nonzero vector in Nul A
			 - Requires to take A and row reduce it and augment it with zero 
			 - Found $x_4$ to be the [[free parameter|free variable]]
			 - Could have a solution for any value of $x_4$ that we chose
 - ![[Screenshot 2024-12-26 at 8.47.13 AM.png|500]]
	 - Practice
		 - Is $\vec u \in$ Nul A? Could $\vec u \in$ Col A? (not in Nul A, not in Col A)
			 - The column space of A would be one of the vectors
			 - $\vec u$ not in col A because col A is a subspace of $\mathbb{R}^3$ 
		 - Is $\vec v \in$ Col A? Could $\vec v \in$ Nul A?  (not in Col A
			 - None of the columns of A match $\vec v$ so not in Col A
			 - The null space of A is a [[subspace]] of $\mathbb{R}^4$ (the number of columns). So $\vec v$ could not be in the null space of A as it would need to be a subspace of $\mathbb{R}^4$ and $\vec v$ is in $\mathbb{R}^3$  
	 - [[Linear Transformation|Linear transformations]]
		 - A linear transformation T from a [[vector space]] V to a vector space W is a rule that assigns a unique vector T(x) to each vector x such that:
			 - i) $T(\vec u + \vec v) = T(\vec u) + T(\vec v)\qquad \forall \vec u, \vec v \in V$ 
			 - ii) $T(c \vec u) = cT(\vec u) \qquad \forall \vec u \in V \text { and } c \in \mathbb{R}$ 
		 - Null space of T is called the [[kernel (linear algebra)|kernel]] { $u \in V | T(\vec u) = 0$}. The [[range]] of T is the set of all vectors in W of the form $T(\vec x)$ for some $\vec x \in v$. $\{T(\vec x) \in W | \vec x \in v$\}
			 - #comment I think professor spelled `kernal` incorrectly[^1]
			 - For the null space, $A \vec x = 0$ so notice we're saying all the $\vec u$ in the vector space such that the transformation of $\vec u$ is equal to 0. So that is called the kernel
			 - The range is what is going to map back to our original x
		 - We had some set and that linear transformation is just a transformation onto another set. So this is a function. 
			 - Left circle shown as domain and right circle shown as range

## References

[^1]: https://en.wikipedia.org/wiki/Kernel_(linear_algebra)#:~:text=In%20mathematics%2C%20the%20kernel%20of,linear%20subspace%20of%20the%20domain.