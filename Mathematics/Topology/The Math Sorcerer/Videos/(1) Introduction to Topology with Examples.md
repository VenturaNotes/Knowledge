[Video](https://youtube.com/watch?v=Q_1dmoUhYBo)

## General Definition of topology
- Let $X$ be a set, and $\uptau$ a collection of subsets of $X$. The collection $\uptau$ is called a topology for $X$ provided $\uptau$ satisfies the following (conditions, axioms, criteria)
	- (i) $\varnothing$ and $X$ are elements of $\uptau$ 
	- (ii) If $O_1$ $\in$ $\uptau$ and $O_2 \in \uptau$, then $O_1 \cap O_2 \in \uptau$  
	- (iii) if {$O_i$ } $\subseteq$ $\uptau$, then $\cup O_i \in \uptau$
		- This is any union, non necessarily finite
- If all 3 of the above conditions are true, then $\uptau$ is a topology for $X$ 
- The elements of $\uptau$ are called open sets

## Example 1: Discrete Topology
- $X$ = set
	- $\mathbb{P}(X)$ = "power set of $X$ "
		- All subsets of $X$ 
	- This collection of subsets is a topology for x
		- $\uptau$ = $\mathbb{P}(X)$ is a topology for $X$ 

## Example 2: Trivial topology
- $X$ = set (any set)
- $\uptau$ = {$\varnothing$ ,$X$ } is a topology on $X$

## Example 3
- $X$ $\ne$ $\varnothing$, $a \in X$, $\uptau =$ {$\varnothing$, {a}, $X$}
	- {a} $\cap$ $X$ = {a}


## Example 4
- $X$ = {a, b, c, d}
	- $\uptau$ = {{a}, {a, b}, {a, c}, {a, b, c}, $X$,$\varnothing$ }

## Example 5
- $X$ is a set of real numbers
	- $\uptau$ = {$\varnothing$} $\cup$ {$X$ $\backslash$ C | C is a countable subset of $X$ }
