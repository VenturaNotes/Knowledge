## Synthesis
- 
## Source [^1]
- A special-purpose data type introduced by E. W. Dijkstra (1965). Apart from creation, initialization, and annihilation, there are only two operations on a semaphore: wait ( P operation or down operation) and signal ([[V operation]] or up operation). The letters P and V derive from the Dutch words used in the original description.
- A semaphore has an integer value that cannot become negative. The [[signal operation]] increases the value by one, and in general indicates that a resource has become free. The [[wait operation]] decreases the value by one when that can be done without the value going negative, and in general indicates that a free resource is about to start being used. This therefore provides a means of controlling access to critical resources by cooperating sequential processes.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]