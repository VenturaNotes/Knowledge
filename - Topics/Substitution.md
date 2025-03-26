## Synthesis
- 
## Source [^1]
- 1. A particular kind of mapping on formal languages. Let $\Sigma_{1}$ and $\Sigma_{2}$ be alphabets. For each symbol $a$ in $\Sigma_{1}$ let $s(a)$ be a $\Sigma_{2}$-language. The function $s$ is a substitution. A homomorphism occurs where each $s(a)$ is a single word. $s$ is $\Lambda$-free if no $s(a)$ contains the empty word.

  

The function $s$ can be extended to map $\Sigma_{1}$-words to $\Sigma_{2}$-languages:

  

$$

s\left(a_{1} \ldots a_{n}\right)=s\left(a_{1}\right) \ldots s\left(a_{n}\right)

$$

  

i.e. the concatenation of the languages $s\left(a_{1}\right), \ldots, s\left(a_{n}\right) . s$ can then be further extended to map $\Sigma_{1}$-languages to $\Sigma_{2}$-languages:

  

$$

s(L)=\{s(w) \mid w \in L\}

$$

  

$s(L)$ is called the substitution image of $L$ under s. 2. See Substitution CIPHER.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]