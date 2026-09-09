## Synthesis
- 
## Source [^1]
- (1) The maximum fluctuations (up or down) allowed in certain markets over a stated period (usually one day's trading; see INTRADAY LIMIT). In some volatile circumstances the market moves the limit up (or down). The movement of prices on the Tokyo Stock Exchange is limited in this way as it is on certain US commodity markets. In some markets, if the limit is reached trading is stopped for the day or for a cooling-off period. 
- (2) A restriction on a derivatives or commodity exchange on the number of contracts or positions one party can hold.
## Source[^2]
- (of a function) Informally, the limit, if it exists, of a real function $f(x)$ as $x$ tends to $a$ is a number $l$ with the property that, as $x$ gets closer to $a, f(x)$ gets closer to $l$. This is written$$\lim_{x \to a} f(x) = l.$$
- It is important to realize that this limit may not equal $f(a)$; indeed, $f(a)$ may not necessarily be defined.
- More precisely, $f(x)$ tends to $l$ as $x$ tends to $a$, written $f(x) \to l$, as $x \to a$, if, given any $\varepsilon > 0$ (however small), there exists $\delta > 0$ (which may depend on $\varepsilon$) such that, for all $x$, except possibly $a$ itself, lying between $a - \delta$ and $a + \delta, f(x)$ lies between $l - \varepsilon$ and $l + \varepsilon$.
- Notice that $a$ itself may not be in the domain of $f$. For example, let $f$ be the function defined by$$f(x) = \frac{\sin x}{x} \quad (x \neq 0).$$
- Then $0$ is not in the domain of $f$, but it can be shown that$$\lim_{x \to 0} \frac{\sin x}{x} = 1.$$
- If $a$ is in the domain of $f$, the $f$ is continuous (see CONTINUOUS FUNCTION) at $a$ if the limit of $f$ at $a$ is $f(a)$.
- In the above, $l$ is a real number. We write $f(x) \to \infty$ as $x \to a$ if, given any $K$ (however large), there is a positive number $\delta$ (which may depend on $K$) such that, for all $x$, except possibly $a$ itself, lying between $a - \delta$ and $a + \delta, f(x)$ is greater than $K$. For example, $1/x^2 \to \infty$ as $x \to 0$. There is a similar definition for $f(x) \to -\infty$ as $x \to a$.
- If $f: M \to N$ is a function between metric spaces, we write that $f$ has limit $l$ if given any $\varepsilon > 0$, there exists $\delta > 0$ such that whenever $0 < d_M(x, a) < \delta$, then $d_N(f(x), l) < \varepsilon$.
- See ALGEBRA OF LIMITS.
---
- (of a sequence) Informally, the limit, if it exists, of an infinite real sequence $a_1, a_2, a_3, \dots$ is a number $l$ with the property that $a_n$ gets closer to $l$ as $n$ gets indefinitely large.
- More precisely, the sequence $a_1, a_2, a_3, \dots$ has the limit $l$ if, given any $\varepsilon > 0$ (however small), there is a number $N$ (which may depend on $\varepsilon$) such that, for all $n > N, a_n$ lies between $l - \varepsilon$ and $l + \varepsilon$. This is written $a_n \to l$. A sequence’s limit, if it exists, is unique.
- For example, the sequence $0, \frac{1}{2}, \frac{3}{4}, \frac{7}{8}, \frac{15}{16}, \dots$, has limit $1$, and the sequence $-1, \frac{1}{2}, -\frac{1}{3}, \frac{1}{4}, -\frac{1}{5}, \dots$, has the limit $0$; since this is the sequence whose $n$th term is $(-1)^n/n$; this fact can be stated as $(-1)^n/n \to 0$.
- There are, of course, real sequences that do not have a limit. These can be classified into different kinds.
	- (i) $a_n$ tends to $\infty$, written $a_n \to \infty$ if, given any $K$ (however large), there is an integer $N$ (which may depend on $K$) such that, for all $n > N, a_n > K$. For example, $a_n \to \infty$ for the sequence $a_n = n^2$.
	- (ii) There is a similar definition for $a_n \to -\infty$, and an example is the sequence $-4, -5, -6, \dots$, in which $a_n = -n - 3$.
	- (iii) The sequence does not have a limit but is bounded, such as the sequence $-\frac{1}{2}, \frac{2}{3}, -\frac{3}{4}, \frac{4}{5} \dots$, in which $a_n = (-1)^n n/(n + 1)$.
	- (iv) The sequence is not bounded, but it is not the case that $a_n \to \infty$ or $a_n \to -\infty$. The sequence $1, 2, 1, 4, 1, 8, 1, \dots$ is an example. If a sequence $a_n$ converges to $l$, then all subsequences of $a_n$ also converge to $l$. More generally, a sequence $a_n$ in a metric space $M$ converges to a limit $l$ if $d(a_n, l) \to 0$ as $n \to \infty$. Thus a complex sequence (see COMPLEX NUMBER) $a_n$ converges to the complex number $l$ if $|a_n - l| \to 0$ as $n \to \infty$. This is equivalent to $\text{Re}(a_n) \to \text{Re}(l)$ and $\text{Im}(a_n) \to \text{Im}(l)$. Sequential convergence determines the topology of a metric space, in the sense that a point $x$ is in the closure of a set $A$ if there exists a sequence $a_n$ in $A$ which converges to $x$. This is not true more generally in topological spaces. See ALGEBRA OF LIMITS, BOLZANO-WEIERSTRASS THEOREM.
## References

[^1]: [[(Home Page) A Dictionary of Business and Management 6th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]