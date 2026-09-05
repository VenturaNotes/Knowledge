## Synthesis
- 
## Source [^1]
- An approach in numerical analysis to the approximation of integrals. The aim is to approximate integrals of the form$$I(f) = \int_a^b f(x)w(x) \, dx$$where $f, w$ are continuous functions and the weight function $w(x)$ is positive. Then$$\langle f, g \rangle = \int_a^b f(x)g(x)w(x) \, dx$$defines an inner product on the space of continuous functions, and an orthonormal sequence $p_n(x)$ of polynomials may be constructed such that $p_n(x)$ has degree $n$. Gauss then showed that $p_{n+1}(x)$ has $n+1$ distinct real roots $x_0, \dots, x_n$ in $(a, b)$ and that there are unique solutions $W_0, \dots, W_n$ to the equations$$\int_a^b x^k w(x) \, dx = \sum_{i=0}^n W_i x_i^k \text{ for } 0 \le k \le 2n+1.$$It is then the case that$$Q_n(f) = \sum_{i=0}^n W_i f(x_i)$$exactly equals $I(f)$ for polynomials of degree $2n+1$ or less, and more generally for continuous functions $Q_n(f)$ tends to $I(f)$ as $n \to \infty$.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]