---
aliases:
  - Partitions
---
## Synthesis
- 
## Source [^1]
- (1) The term used in some operating systems to refer to a static area of memory for use by jobs, and also applied by association to the jobs executed in that area. 
- (2) (of a set) See COVERING. 
- (3) A logical division of a hard disk. Each partition is usually treated as a different disk by the operating system. Partitioning information is held on the disk itself and remains in force until changed.
## Source[^2]
- If a substance is in contact with two different phases then, in general, it will have a different affinity for each phase. Part of the substance will be absorbed or dissolved by one and part by the other, the relative amounts depending on the relative affinities. The substance is said to be partitioned between the two phases. For example, if two immiscible liquids are taken and a third compound is shaken up with them, then an equilibrium is reached in which the concentration in one solvent differs from that in the other. The ratio of the concentrations is the partition coefficient of the system. The partition law states that this ratio is a constant for given liquids.
## Source[^3]
- A logical distribution on a computer's hard disk drive that allows for operating system specific formatting to be applied. Partitioning may be applied to:
	1. separate different uses, e.g. swap areas from file systems;
	2. reduce the effects of disk corruption;
	3. prevent overrunning files from filling up all available disk space, e.g. log files;
	4. allow for historical file systems that have size limits smaller than the drive.
## Source[^4]
### Of An Interval
- Let $[a, b]$ be a closed interval. A set of $n + 1$ points $x_0, x_1, \dots, x_n$ such that$$a = x_0 < x_1 < x_2 < \dots < x_{n-1} < x_n = b$$is a partition of the interval $[a, b]$. A partition divides the interval into $n$ subintervals $[x_i, x_{i+1}]$. The norm (or mesh) of the partition $P$ is equal to the length of the largest subinterval and is denoted by $\|P\|$. Such partitions are used in defining Riemann sums (see INTEGRAL).

### Of A Number
- A partition of the positive integer $n$ is obtained by writing$$n = n_1 + n_2 + \dots + n_k,$$where $n_1, n_2, \dots, n_k$ are positive integers, and the order in which $n_1, n_2, \dots, n_k$ appear is unimportant. The number of partitions of $n$ is denoted by $p(n)$. For example, the partitions of 5 are$5, 4 + 1, 3 + 2, 3 + 1 + 1, 2 + 2 + 1, 2 + 1 + 1 + 1, 1 + 1 + 1 + 1 + 1,$and hence $p(5) = 7$. The values of $p(n)$ for small values of $n$ are as follows:

| $n$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| $p(n)$ | 1 | 2 | 3 | 5 | 7 | 11 | 15 | 22 | 30 | 42 |
- Table of values of $p(n)$
- The asymptotic approximation (see ASYMPTOTICALLY EQUAL)$$p(n) \sim \frac{1}{4n\sqrt{3}} \exp\left(\pi \sqrt{\frac{2n}{3}}\right),$$for large $n$, was famously obtained by Hardy and Ramanujan in 1918.
- Compare COMPOSITION (of a number).
### Of A Set
- A partition of a set $S$ is a collection of non-empty disjoint subsets of $S$ whose union is $S$. Equivalently, every element of $S$ belongs to exactly one of the subsets in the collection. Given a partition of a set $S$, an equivalence relation $\sim$ on $S$ can be obtained by defining $a \sim b$ if $a$ and $b$ belong to the same subset in the partition. Conversely, given any equivalence relation on $S$, the equivalence classes partition $S$.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Chemistry 8th Edition by Oxford Reference]]
[^3]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]
[^4]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]