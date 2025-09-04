---
aliases:
  - real
  - real number
---
## Synthesis
- 
## Source [^1] [^2]
### Definition
- Denoted $\mathbb{R}$

## Source[^3]
- (reals) The numbers that allow a numerical quantity to be assigned to every point on an infinite line or continuum. Real numbers are thus used to measure and calculate exactly the sizes of any continuous line segments or quantities. The development of a number system that meets these requirements has proved to be a long and complex process that reached a conclusion only in the 19th century. Establishing theoretical foundations for mathematical developments such as the calculus have involved sorting out subtle, conflicting, and inconsistent ideas about the reals (such as infinitesimals). The set of reals is infinite and not countable: there does not exist a method of making finite representations or codings of real numbers. Research on the foundations of the continuum continues-for instance on computation with the reals and on the uses of infinitesimals.

  

The real numbers, like the natural numbers, are one of the truly fundamental data types. Unlike the natural numbers, however, reals cannot be represented exactly in computations. They can be approximated to any degree of accuracy by rational numbers.

  

A real number can be defined in several ways, for example as the limit of a sequence of rational numbers. A real $x$ is represented by a sequence $q(0), q(1), \ldots$ of rational numbers that approximates $x$ in the sense that for any degree of accuracy $\varepsilon$ there exists some natural number $n$ such that

  

$$

\text { for all } k>n,\{q(k)-x\}<\varepsilon

$$

  

A real number is a computable real number if there is an algorithm that allows us to

  

compute an approximation to the number to any given degree of accuracy. A real $x$ is computable if (a) there is an algorithm that lists a sequence $q(0), q(1), \ldots$ of rational numbers that converges to $x$, and (b) there is an algorithm that to any natural number $k$ finds a natural number $p(k)$ such that

  

$$

\text { for all } n>p(k), \mid q(n)-x \mid<2^{-k}

$$

  

Most of the real numbers that we know and use come from solving equations (e.g. the algebraic numbers) and evaluating equationally defined sequences (e.g. e and П) and are computable. However, most real numbers are noncomputable.

  

The approximations to real numbers used in computers must have finite representations or codings. In particular, there are gaps and separations between adjacent pairs of the real numbers that are represented (see MODEL NUMBERS). The separation may be the same between all numbers (fixed-point) or may vary and depend on the size of the adjacent values (floating-point). Some programming languages ignore this difference, describing floating-point numbers as 'real'. Calculations with real numbers on a computer must take account of these approximations.
## References

[^1]: [[(Home Page) Building Blocks for Theoretical Computer Science by Margaret M. Fleck#^m6l8g4]]
[^2]: [[(5) Start Learning Sets - Part 1 - Overview and Element Relation]]
[^3]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]