## Synthesis
- 
## Source [^1]
- A function that maps streams to streams. If $[T \rightarrow A]$ is the set of all streams of elements of set $A$ indexed by time $T$ then, for example, a stream transformer that maps a pair of streams into one stream is a function of the form$$F:[T \rightarrow A]^{2} \rightarrow[T \rightarrow A]$$Stream transformers are often defined in the equivalent but logically simpler form$$G:[T \rightarrow A]^{n} \times T \rightarrow A$$where $G(a, t)=F(a)(t)$ for stream $a$ and time $t$, i.e. $G(a, t)$ is the element on the output stream $F(a)$ at time $t$.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]