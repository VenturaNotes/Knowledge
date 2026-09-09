## Synthesis
- 
## Source [^1]
- The explicit rule$$y_{n+2}=y_{n}+2 h f\left(x_{n+1}, y_{n+1}\right)$$for the solution of ordinary differential equations ( $h$ is the stepsize). It is an example of a linear multistep method, important for its use as the basis of Gragg's extrapolation method.
## Source[^2]
- Possibly the simplest version of numerical integration. If a definite integral $\int_a^b f(x) dx$ is to be calculated using $n$ strips of width $h = (b - a)/n$ then the area under the curve is replaced by a series of rectangles of width $h$ with height equal to the value of the function at its midvalue. Labeling the midpoints $m_1, m_2, \dots, m_n$ gives the approximation$$\int_a^b f(x) dx = h \times \{f(m_1) + f(m_2) + \dots + f(m_n)\}.$$
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]