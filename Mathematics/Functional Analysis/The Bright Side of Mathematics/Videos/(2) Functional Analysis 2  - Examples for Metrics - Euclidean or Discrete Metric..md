---
Source:
  - https://www.youtube.com/watch?v=5hhhLaDb09E
Reviewed: false
---
- ![[Screenshot 2024-12-07 at 11.14.11 PM.png]]
	- Going deeper into topic of [[metric space|metric spaces]]
	- X set + d: $X \times X \to [0, \infty)$ metric = metric space (X, d)
		- If we have a set $X$ and we have a metric for this set, we call this a metric space
		- Within a metric space, can now generalize many notions we may know from a real analysis course
			- Can define [[Sequence|sequences]], [[limits]], and [[accumulation points]]
	- Examples
		- (a) $X = \mathbb{C}$, d(x, y) = $| x - y |$
			- Set is the complex numbers and [[metric]] should be usual notion of measuring distances in the complex numbers (which means absolute value where we look at difference of both points)
				- #comment I think this would apply to real numbers too
			- Visualization in [[complex plane]] gives us normal geometry we have in plane
			- Calculating the difference of two complex numbers is a complex number. The length of this new complex number is exactly the distance we want
			- This normal geometry we have for measuring distances can also be done in higher dimensions
		- (b) $X = \mathbb{R}^n, d(x,y)$ = $\sqrt{(x_1-y_1)^2+(x_2-y_2)^2 + ... + (x_n-y_n)^2}$
			- Above is the euclidean metric
			- If we have the set above, we would have the standard metric we can choose. This would be called the [[euclidean metric ]]or [[euclidean distance]]
				- With [[Pythagoras Theorem]], we also know the definition of `d`
			- The euclidean metric is the common but also the only possible choice of a metric in $\mathbb{R}^n$ 
			- For a [[metric]], we only need 3 properties
				- It should be [[positive definite]], [[symmetric]], and fulfill the [[triangle inequality]]
		- Since the above metrics fulfill the 3 properties, so they are metrics on $\mathbb{R}^n$ and $\mathbb{C}$ respectively
		- (c) $X = \mathbb{R}^n$, $d(x, y)$ = $max\{|x_1 - y_1|, |x_2 - y_2|, ..., |x_n-y_n|\}$ 
			- Another distance function we could define for $\mathbb{R}^n$ 
			- Use the normal absolute value or modulus in $\mathbb{R}$
				- #question What is modulus here?
				- #question What is meant by "normal" absolute value here?. What is a non-normal absolute value?
			- By writing it down for all components, it means we want the maximum of all these differences
			- It's a metric as well as it fulfills all 3 properties although the triangle inequality may need some work to show is true
			- Of course you could have different points that have the same distance from a chosen x
				- $d(x, y) = d(x,z)$
				- This would just be a circle around x
				- However, with another metric, such a thing we might call a circle might look completely different
					- Keep that in mind whenever we use circles to visualize things
		- (d) X any set ($\ne$ $\varnothing$), d(x, y) = $\begin{cases} 0 & \text {for } x = y \\ 1& \text{for } x \ne y \end{cases}$  (known as [[discrete metric]])
			- More abstract one.
			- Any set X that is not the empty set
			- We define a metric by distinguishing two cases
			- For $x \ne y$, most of the time we can choose whatever we want, so we just choose 1 in this case.
			- Checking if $d$ is a metric: It is [[positive definite]] and whole definition is symmetric
			- To show [[triangle inequality]], we write 3 points in set
				- Need to show $d(x, y) \le d(x, z) + d(z,y)$ for two different cases
					- When $d(x,y) = 0$, we know the first case is satisfied since the values on the right will always be 0 or positive
				- For second case
					- In terms of $d(x,z)$ or $d(z,y)$, one of them has to be exactly one. Otherwise, both of them would be 0 which means $z = x$ and $z=y$ which then would not be the second case
					- Therefore, if we add both of them together, we would get 1 or 2
			- To close this example, let's recall that this definition defines a metric. It works on any set, and it's called the discrete metric
			- To visualize this metric space, it's a little strange because there are no neighbors around a given point simply because there's a fixed distance from one point to all the other ones. This means all the points are [[isolated points]]
	- In next video, will talk about other objects we find in metric spaces