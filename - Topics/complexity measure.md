## Synthesis
- 
## Source [^1]
- A means of measuring the resources used during a computation. A general definition is contained in Blum's axioms. In the special case of Turing machines, during any Turing machine computation various resources will be used, e.g. space and time. These can be defined formally as follows.

  

Given a Turing machine program $M$ and an input string $x$, then $\operatorname{Time}(M, x)$ is defined as the number of steps in the computation of $M$ on $x$ before $M$ halts. Time is undefined if $M$ does not halt on $x$. The [[time complexity]] of $M$ is defined to be the integer function $T_{\mathrm{M}}$ where

  

$$

T_{\mathrm{M}}(n)=\max (\operatorname{Time}(M, x): 1 \times 1=n)

$$

  

for nonnegative integer $n$.

$\operatorname{Space}(M, x)$ is similarly defined as the number of tape squares used by $M$ on $x$, and the

  

[[space complexity]] $\mathbf{S}_{\mathbf{M}}$ is defined by

  

$$

S_{\mathrm{M}}(n)=\max (\operatorname{Space}(M, x):|x|=n)

$$

  

However, in order to distinguish the space required for working as opposed to the space for the input string $x$, the machine is sometimes considered as having a read-only input tape, and Space $(M, x)$ is defined as the number of squares used by $M$ on $x$.

  

The more general measures of complexity share many of the common properties of time and space (see Blum's AXIOMS).

  

An algorithm for which the complexity measure $T_{\mathrm{M}}(n)$ or $S_{\mathrm{M}}(n)$ increases with $n$ no more rapidly than a polynomial in $n$ is said to be polynomially bounded; one in which it grows exponentially is said to be exponentially bounded.

  

See also COMPLEXITY CLASSES.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]