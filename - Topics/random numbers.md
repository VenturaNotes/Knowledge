## Synthesis
- 
## Source [^1]
- Numbers that are drawn using a random sampling technique from a set of permissible numbers. True random numbers are difficult to obtain, and programs using them are difficult to debug.

  

Attempts to produce random numbers using the arithmetic properties of a computer result in [[pseudorandom numbers]], since in principle the numbers generated depend on their predecessors. However, their frequency distribution may be assumed to correspond to a given theoretical form, and they may be assumed to be independent of each other. Basic pseudorandom numbers are uniformly distributed in the range $(0,1)$, and may be transformed to provide other distributions.

  

Many methods for their generation have been proposed over the years, one of the earliest being the middle square method proposed by von Neumann: the previous random number is squared and the middle digits extracted from the result to form the next number in the sequence. More successful methods are based upon the linear congruential method in which a sequence of numbers is generated using the formula

  

$$

X_{n+1}=a X_{n}+c(\bmod m)

$$

  

for particular choices of $a, c$ and $m$.

Pseudorandom numbers are used in a number of applications: in Monte Carlo methods of numerical integration, to sample a large set and so gain insight into the set, and to simulate natural phenomena such as the collision of nuclear particles.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]