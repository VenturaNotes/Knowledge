## Synthesis
- 
## Source [^1]
- The process whereby one machine $M_{1}$ can be made to simulate or behave like a second machine $M_{2}$. There are a number of ways of formalizing simulation for each class of machines. For example, let there be functions $g$ and $h$ that perform encoding and decoding roles respectively:$$g: M_{1} \rightarrow M_{2}, \quad h: M_{2} \rightarrow M_{1}$$$g$ encodes information for machine $M_{1}$ and produces corresponding information for machine $M_{2} ; h$ is the inverse function. Machine $M_{2}$ is said to simulate machine $M_{1}$ if it is possible to specify a translation algorithm such that, when given a program $P_{1}$ for $M_{1}$, it produces a corresponding program $P_{2}$ for $M_{2}$; further, the effect of $P_{1}$ on $M_{1}$ should be equivalent to the effect of
	- applying function $g$
	- then executing $P_{2}$ on $M_{2}$
	- then applying function $h$.
- In symbols,$$P_{1}=h P_{2} g$$An equally useful formulation has functions$$g: M_{1} \rightarrow M_{2}, \quad h: M_{1} \rightarrow M_{2}$$and the simulation criterion$$h P_{1}=P_{2} g$$
- Machine simulation of this kind is generally discussed for idealized abstract machines, such as Turing machines, and for formal models of microprocessors. It provides a useful approach to defining the correctness of implementations. See also MACHINE EQUIVALENCE.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]