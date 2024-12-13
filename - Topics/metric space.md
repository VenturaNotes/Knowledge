---
aliases:
  - metric spaces
---
## Synthesis
- 
## Source [^1]
- #question What is a metric space though? Below just seems to be an example
### Example
- Given a set X = {x, y}, we just know the elements are not equal
- We want to give X more structure which knows distance between points
	- To formalize this, we write a [[map]] which is called a [[metric]] and it measures distances
- A [[metric]]: $d: X \times {X} \to [0, \infty]$ 
	- This map can only be a metric if it fulfills three properties
		- (1) $d(x, y) = 0 \iff x = y$
			- Distance between 2 points if zero iff they're the same point
		- (2) $d(x, y) = d(y, x)$
			- Map is [[symmetric]] because since distance from x to y and y to x is the same, it does not matter which element is first
		- (3) $d(x,y) \le d(x,z) + d(z, y)$ 
			- [[Triangle inequality]] tells us that distance is longer when going on a detour
	- #question Do these 3 properties only apply to distances? What other kind of structures can we create for points in functional analysis?
- With this map, we can now measure all distances in the set X
	- Therefore, we call the set X with the metric `d` a metric space
		- Measuring distances lets us do a lot of analytical stuff
## References

[^1]: [[(1) Functional Analysis 1  - Metric Space - How to Measure Distances.]]