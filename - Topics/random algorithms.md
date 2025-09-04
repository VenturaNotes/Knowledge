## Synthesis
- 
## Source [^1]
- Algorithms that are fast but instead of always giving the correct answer give the correct answer with high probability. They have been devised because of the difficulty (impossibility?) of finding polynomial time algorithms for some problems (see $\mathrm{P}=\mathrm{NP}$ QUESTION).

  

An example is that of trying to test whether or not a number is prime. Given an integer $n$ there is a test that uses a 'guess' $i$, chosen at random between 1 and $n$, that takes

  

$\mathrm{O}\left(\log _{2} n\right)$ time to perform. If the test is successful $n$ is known to have factors; on the other hand if $n$ has factors then the test will be successful for at least half of the integers in the range 1 to $n$. Thus if the test fails $k$ times it can be said that $n$ is prime with probability $1-$ $2^{-k}$.

  

Several other examples of problems amenable to a similar approach have now been found. However, such examples are either already known to be solvable in polynomial time anyway (although the random algorithms are an order of magnitude faster) or, like prime-testing, under suspicion of so being.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]