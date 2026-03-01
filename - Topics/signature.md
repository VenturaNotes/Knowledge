## Synthesis
- 
## Source [^1]
- Sig is short for signature (for definition 2)
- (1) A collection of symbols intended to be associated with sets and with functions on and elements from the sets. Signatures provide names for the carrier sets, operations, and constants of algebras. They are central in the precise treatment of the syntax of many computer science concepts, including (a) abstract data types, (b) algebraic specifications, and (c) classes, modules, and objects. Typically, headers of modules are signatures. The specification of an Ada package is in effect a signature.
- In its simplest form a signature is a set $\Sigma$ of symbols with, for each $\Sigma \in \Sigma$, a natural number $\rho(\sigma)$ called the arity of $\Sigma$. A $\Sigma$-algebra consists of a set $A$ (called the carrier of the algebra) together with, for each $\sigma \in \Sigma$, an $n$-argument function over $A$, where $n=\rho(\sigma)$. As an example, suppose$$\begin{aligned}

& \Sigma=\left\{\text{`zero', `one', `plus', `times'}\right\} \\

& \text {with } \rho\left(\text {`zero'}\right)=\rho\left(\text {`one'}\right)=0 \\

& \text {and } \rho\left(\text {`plus'}\right)=\rho\left(\text { `times' }\right)=2

\end{aligned}$$Then one $\Sigma$-algebra results from taking the set of all integers as carrier, and associating the number 0 with 'zero', 1 with 'one', addition with 'plus', and multiplication with 'times'. As indicated by $\rho$, addition and multiplication are 2-argument functions while zero and one, being constants, expect no arguments and their arity is 0.
- It is important to realize that the above example describes only one possible $\Sigma$-algebra. For example, the carrier could be the real numbers; or, perversely multiplication could be associated with 'plus' and addition with 'times'; equally sets could be considered instead of numbers, associating, say, union and intersection with 'plus' and 'times'. The point is that an algebra can involve arbitrary sets and arbitrary functions: any choice is as much an algebra as any other and it need not reflect in any obvious way the names chosen for the symbols in the signature. Indeed the whole point of signatures is to make a distinction between the names and symbols and their possible interpretations.
- In computer science the more complex notion of many-sorted signature is used. This allows algebras to have many carriers. A signature now, in addition to function symbols, includes a set of sorts. These are symbols that, in an algebra, are associated with carrier sets. Instead of a natural number, $\rho(\sigma)$ is a sequence of sorts indicating which sets the arguments come from, together with an additional sort giving the set in which the result lies.
- Signatures are often displayed as shown in the diagram. Here real numbers and Booleans are equipped with their usual operations. 
- (2) That part of an email message in which the originator states his or her identity and claims authenticity. 
- (3) A bit pattern believed to be specific to a particular program and used to identify virus programs or unlicensed copies of proprietary software. 
- (4) See SIGNATURE ANALYSIS.

|            |                                                                                                                                                                                                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| signature  | real numbers                                                                                                                                                                                                                                                                                                |
| sorts      | real<br>bools                                                                                                                                                                                                                                                                                               |
| constants  | 0 :$\to$ real<br>1 :$\to$ real<br>tt :$\to$ bool<br>ff :$\to$ bool                                                                                                                                                                                                                                          |
| operations | \+ : real $\times$ real $\to$ real<br>\- : real $\to$ real<br>$\times$ : real $\times$ real $\to$ real<br>-1 : real $\to$ real<br>$\sqrt{}$ : real $\to$ real<br>^ : bool $\times$ bool $\to$ bool<br>$\lnot$ : bool $\to$ bool<br>< : real $\times$ real $\to$ bool<br>$=$ : real $\times$ real $\to$ bool |
| end        |                                                                                                                                                                                                                                                                                                             |

- Signature. A signature for real numbers
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]