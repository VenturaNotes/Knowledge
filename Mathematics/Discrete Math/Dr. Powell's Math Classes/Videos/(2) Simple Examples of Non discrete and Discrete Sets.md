[Video](https://www.youtube.com/watch?v=oTZ-QQVdCp8)

- ![[Screenshot 2023-10-11 at 12.57.22 AM.png]]
	- [[Topology]] and [[discrete topology]]
	- A topology on set A is a collection of subsets of A that are in the [[power set]] of A
		- So the topology itself is a collection of subsets 
			- We can pick any subsets as long as certain criteria are satisfied
			- The ones that we choose when we take finite intersections of them (topologies work for infinite sets as well)
			- Finite intersections and any kind of unions is great
	- For T
		- The two sets have an intersection at {3, 4}
			- Therefore, {3, 4} is also in the collection
		- For a topology, must always include the empty set and the full set itself
			- Contains all finite intersections and also contains all unions of any kind
		- Often times we call elements of the topology [[open set|open sets]]
	- Open intervals are considered open sets
		- Such as (1, 2)
			- All numbers [[strictly]] between 1 and 2
			- You can take intersections and unions of them and you'd get the full topology on $\mathbb{R}$
			- The [[open interval system]] (the open intervals themselves) is called a basis of topology
	- In [[discrete math]], we study structures that have the [[discrete topology]]
		- It's a type of topology
			- A type of collection where we choose things where we have a certain property holding
		- The [[real numbers]] are not discrete (there is a notion of closeness)
			- $(\frac 12, \frac 14, \frac 18, ..,)$ this is a [[sequence]]
				- 0 not in sequence
					-  If we take any [[open set]] that contains 0
						- Every open set that contains 0 will contain an [[open interval]] that contains 0
						- Any open interval that contains 0 will also need to contain one of the elements in the above set (sequence?)
							- This means that 0 is a [[limit point]] for the particular sequence
								- In fact, it is the limit of that sequence
							- We can do limit points for an arbitrary set which as lots of sequences in it. Can have lots of limit points
	- For something to have discrete topology, the only limit points that ever happen are contained in sets themselves
		- You never have a limit point that's outside of a set (that's what [[discrete]] means)
		- Plays off this idea that you don't want things to be too close together ever
- ![[Screenshot 2023-10-11 at 12.57.48 AM.png]]
	- Let's look at point 2 
		- Every open set (anything in the topology that contains 2)
		- All open sets that contain 2 non-trivially intersect with the set which doesn't have to be in the topology (just any subset of A) 
			- Non-trivially intersects with {1, 3}
				- This means 2 is a limit point of the set {1, 3}
				- In this case, there could be more than one limit point for different sets (because it's a funny finite example)
	- We see that T does not have the discrete topology just like $\mathbb{R}$ does not
- ![[Screenshot 2023-10-11 at 1.05.29 AM.png]]
	- To get a discrete topology on a finite set, you need everything to be its own distinct element
		- The topology would have to look like
			- T = {{1} {2} {3} {4} {5}{6}}
				- So the open sets themselves would have to look like that topology
	- Basically eliminating any notion of closeness in discrete topology and we throw that out so we're not doing calculus on things