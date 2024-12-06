---
Source:
  - zotero://open-pdf/library/items/966VW8RQ?page=1&annotation=S2NWHVJY
Length: "472"
Progress: "7"
tags:
  - status/incomplete
  - type/textbook
  - temp
---
## Preface
### About This Book
- “mostly reflecting the algorithmic content of our new required junior-level theory course.” ([pdf](zotero://open-pdf/library/items/966VW8RQ?page=5&annotation=HG68URXV))
### Prerequisites
- “a course on discrete mathematics and a course on fundamental data structures.” ([pdf](zotero://open-pdf/library/items/966VW8RQ?page=5&annotation=89B53MIV))
- Need familiarity with these topics
	- Discrete mathematics
		- [[algebra]]
		- [[logarithm identities]]
		- [[naive set theory]]
		- [[boolean algebra]]
		- [[first-order predicate logic]]
		- [[set|sets]]
		- [[functions]]
		- [[equivalences]]
		- [[partial orders]]
		- [[modular arithmetic]]
		- [[recursive definitions]]
		- [[trees]] (abstract objects)
		- [[graphs]] (vertices and edges, not function plots)
	- [[Proof techniques]]
		- [[Direct]]
		- [[Indirect]]
		- [[Contradiction]]
		- [[Exhaustive case analysis]]
		- [[Induction]] (especially "strong" and "structural" induction)
	- Iterative programming concepts
		- [[Variable|variables]], [[conditionals]], [[loops]], [[records]], [[indirection]], ([[addresses]]/[[pointers]]/[[references]]), [[subroutines]], [[recursion]].
	- Fundamental abstract data types:
		- [[scalars]], [[sequences]], [[vectors]], [[set|sets]], [[stacks]], [[queues]], [[maps]]/[[dictionaries]], [[ordered maps]] / [[ordered dictionaries]], [[priority queues]]
	- Fundamental data structures
		- [[arrays]]
		- [[linked lists]]
			- [[single linked list]]
			- [[double linked list]]
			- [[linear linked list]]
			- [[circular linked list]]
		- [[binary search tree]]
			- [[balanced binary search tree]]
				- [[AVL trees]]
				- [[red-black trees]]
				- [[treaps]]
				- [[skip lists]]
				- [[splay trees]]
			- [[Hash Table|hash tables]]
			- [[binary heaps]]
### Additional References
### About the Exercises
### Steal This Book!
### Acknowledgments
### Caveat Lector!

## (0) Introduction
### (0.1) What is an algorithm?
### (0.2) Multplication
### (0.3) Congressional Apportionment
### (0.4) A Bad Example
### (0.5) Describing Algorithms
#### (0.5.1) Specifying the Problem
#### (0.5.2) Describing the Algorithm
### Analyzing Algorithms
#### (0.6.1) Correctness
#### (0.6.2) Running Time
### (0.7) Exercises

## (1) Recursion
### (1.1) Reductions
### (1.2) Simplify and Delegate
### (1.3) Tower of Hanoi
### (1.4) Mergesort
#### (1.4.1) Correctness
#### (1.4.2) Analysis
### (1.5) Quicksort
#### (1.5.1) Correctness
#### (1.5.2) Analysis
### (1.6) The Pattern
### (1.7) Recursion Trees
#### (1.7.1) Ignoring Floors and Ceilings Is Okay, Honest
### (1.8) Linear-Time Selection
#### (1.8.1) Quickselect
#### (1.8.2) Good pivots
#### (1.8.3) Analysis
#### (1.8.4) Sanity Checking
### (1.9) Fast Multiplication
### (1.10) Exponentiation
### (1.11) Exercises

## (2) Backtracking
### (2.1) N Queens
### (2.2) Game Trees
### (2.3) Subset Sum
#### (2.3.1) Correctness
#### (2.3.2) Analysis
#### (2.3.3) Variants
### (2.4) The General Pattern
### (2.5) Text Segmentation (Interpunctio Verborum)
#### (2.5.1) Index Formulation
#### (2.5.2) Analysis
#### (2.5.3) Variants
### (2.6) Longest Increasing Subsequence
### (2.7) Longest Increasing Subsequence, Take 2
### (2.8) Optimal Binary Search Trees
#### (2.8.1) Analysis
### (2.9) Exercises
## (3) Dynamic Programming
### (3.1) Mātrāvṛtta
#### (3.1.1) Backtracking Can Be Slow
#### (3.1.2) Memo(r)ization: Remember Everything
#### (3.1.3) Dynamic Programming: Fill Deliberately
#### (3.1.4) Don't Remember Everything After All
### (3.2) Aside: Even Faster Fibonacci Numbers
#### (3.2.1) Whoa! Not so fast!
### (3.3) Interpunctio Verborum Redux
### (3.4) The Pattern: Smart Recursion
### (3.5) Warning: Greed is Stupid
### (3.6) Longest Increasing Subsequence
#### (3.6.1) First Recurrence: Is This Next?
#### (3.6.2) Second Recurrence: What's Next?
### (3.7) Edit Distance
#### (3.7.1) Recursive Structure
#### (3.7.2) Recurrence
#### (3.7.3) Dynamic Programming
### (3.8) Subset Sum
### (3.9) Optimal Binary Search Trees
### (3.10) Dynamic Programming on Trees
### (3.11) Exercises
## (4) Greedy Algorithms
### (4.1) Storing Files on Tape
### (4.2) Scheduling Clasess
### (4.3) General Pattern
### (4.4) Huffman Codes
### (4.5) Stable Matching
#### (4.5.1) Some Bad Ideas
#### (4.5.2) The Boston Pool and Gale-Shapely Algorithms
#### (4.5.3) Running Time
#### (4.5.4) Correctness
#### (4.5.5) Optimality!
### (4.6) Exercises
## (5) Basic Graph Algorithms
### (5.1) Introduction and History
### (5.2) Basic Definitions
### (5.3) Representations and Examples
### (5.4) Data Structures
#### (5.4.1) Adjacency Lists
#### (5.4.2) Adjacency Matrices
#### (5.4.3) Comparison
### (5.5) Whatever-First Search
#### (5.5.1) Analysis
### (5.6) Important Variants
#### (5.6.1) Stack: Depth-First
#### (5.6.2) Queue: Breadth-First
#### (5.6.3) Priority Queue: Best-First
#### (5.6.4) Disconnected Graphs
#### (5.6.5) Directed Graphs
### (5.7) Graph Reductions: Flood Fill
### (5.8) Exercises
## (6) Depth-First Search
### (6.1) Preorder and Postorder
#### (6.1.1) Classifying Vertices and Edges
### (6.2) Detecting Cycles
### (6.3) Topological Sort
#### (6.3.1) Implicit Topological Sort
### (6.4) Memoization and Dynamic Programming
#### (6.4.1) Dynamic Programming in Dags
### (6.5) Strong Connectivity
### (6.6) Strong Components in Linear Time
#### (6.6.1) Kosaraju and Sharir's Algorithm
#### (6.6.2) Tarjan's Algorithm
### (6.7) Exercises

## (7) Minimum Spanning Trees
### (7.1) Distinct Edge Weights
### (7.2) The Only Minimum Spanning Tree Algorithm
### (7.3) Borůvka's algorithm
#### (7.3.1) This is the MST Algorithm You Want
### (7.4) Jarník's ("Prim's") Algorithm
#### (7.4.1) Improving Jarník's Algorithm
### (7.5) Kruskal's Algorithm
### (7.6) Exercises
## (8) Shortest Paths
### (8.1) Shortest Path Trees
### (8.2) Negative Edges
### (8.3) The Only SSSP Algorithm
### (8.4) Unweighted Graphs: Breadth-First Search
### (8.5) Directed Acyclic Graphs: Depth-First Search
### (8.6) Best-First: Dijkstra's Algorithm
#### (8.6.1) No Negative Edges
#### (8.6.2) Negative Edges
### (8.7) Relax ALL the Edges: Bellman-Ford
#### (8.7.1) Moore's Improvement
#### (8.7.2) Dynamic Programming Formulation
### (8.8) Exercises
## (9) All-Pairs Shortest Paths
### (9.1) Introduction
### (9.2) Lots of Single Sources
### (9.3) Reweighting
### (9.4) Johnson's Algorithm
### (9.5) Dynamic Programming
### (9.6) Divide and Conquer
### (9.7) Funny Matrix Multiplication
### (9.8) (Kleene-Roy-) Floyd-Warshall(-Ingerman)
### (9.9) Exercises

## (10) Maximum Flows & Minimum Cuts
### (10.1) Flows
### (10.2) Cuts
### (10.3) The Maxflow-Mincut Theorem
### (10.4) Ford and Fulkerson's augmenting-path algorithm
#### (10.4.1) Irrational Capacities
### (10.5) Combining and Decomposing Flows
### (10.6) Edmonds and Karp's Algorithms
#### (10.6.1) Fattest Augmenting Paths
#### (10.6.2) Shortest Augmenting Paths
### (10.7) Further Progress
### (10.8) Exercises

## (11) Applications of Flows and Cuts
### (11.1) Edge-Disjoint Paths
### (11.2) Vertex Capacities and Vertex-Disjoint Paths
### (11.3) Bipartite Matching
### (11.4) Tuple Selection
#### (11.4.1) Exam Scheduling
### (11.5) Disjoint-Path Covers
#### (11.5.1) Minimal Faculty Hiring
### (11.6) Baseball Elimination
### (11.7) Project Selection
### (11.8) Exercises

## (12) NP-Hardness
### (12.1) A Game You can't Win
### (12.2) P versus NP
### (12.3) NP-hard, NP-easy, and NP-complete
### (12.4) Formal Definitions (HC SVNT DRACONES)
### (12.5) Reductions and SAT
### (12.6) 3SAT (from CIRCUITSAT)
### (12.7) Maximum Independent Set (from 3SAT)
### (12.8) The General Pattern
### (12.9) Clique and Vertex Cover (from Independent Set)
### (12.10) Graph Coloring (from 3SAT)
### (12.11) Hamiltonian Cycle
#### (12.11.1) From Vertex Cover
#### (12.11.2) From 3SAT
#### (12.11.3) Variants and Extensions
### (12.12) Subset Sum (form Vertex Cover)
#### (12.12.1) Caveat Reductor!
### (12.13) Other Useful NP-hard Problems
### (12.14) Choosing the Right Problem
### (12.15) A Frivolous Real-World Example
### (12.16) On Beyond Zebra
#### (12.16.1) Polynomial Space
#### (12.16.2) Exponential Time
#### (12.16.3) Excelsior!
### (12.17) Exercises


