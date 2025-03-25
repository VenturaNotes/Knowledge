## Synthesis
- 
## Source [^1]
- A method of public key encryption (see CRYPTOGRAPHY) devised by Rivest, Shamir, and Adleman. A message is encrypted by mapping it onto an integer, $M$ say, raising $M$ to a (publicly known) power $e$ and forming the remainder on division by a (publicly known) divisor, $n$, to give the encrypted message $S$. Decryption is achieved by similarly raising $S$ to a (secret) power $d$, and again forming the remainder on division by $n$; the result will be the value of $M$. The method relies on the choice of $n$ as the product of two large secret prime numbers, $p$ and $q$. The values of $e$ and $d$ are chosen such that$$e^{*} d \equiv 1 \bmod ((p-1)^{*}(q-1))$$Security is achieved largely by the difficulty of finding the prime factors of $n$.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]