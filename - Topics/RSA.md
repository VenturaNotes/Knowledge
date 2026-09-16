## Synthesis
- 
## Source [^1]
- (public-key cryptography) Named after the mathematicians Ron Rivest, Adi Shamir, and Leonard Aldeman, a cryptographic algorithm which depends on the difficulty of factorizing large semiprimes and a commonly used form of encryption for Internet security.
- The public key consists of natural numbers $n$ and $e$, where $n$ is a product of two distinct large primes $p$ and $q$. As of 2020, most RSA keys have $2^{1024} < n < 2^{4096}$. The number $e$ needs to be coprime with $k = (p-1)(q-1)$. Then a message $M$ in the range $0 \le M < n$ is encrypted as $C = M^e \pmod n$. When received, the message is recovered by $M = C^d \pmod n$, where $d$ is the multiplicative inverse of $e \pmod k$. Knowledge of $d$ lies only with the receiver; finding $d$ is equivalent to factorizing $n$, which should not be practically possible, provided large enough primes are used.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]