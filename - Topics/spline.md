## Synthesis
- 
## Source [^1]
- Interpolating with polynomials of high degree, as is necessary with Lagrangian interpolation for many data points, can be computationally difficult, and the interpolating polynomial can fluctuate significantly between data points. Instead, it may be better to interpolate using different low-degree polynomials between the different data points. Given data points $(x_0,y_0), \dots, (x_n,y_n)$, where $a=x_0 < \dots < x_n=b$, a cubic spline is a function $f(x)$ satisfying
	- $f(x)$ is defined by some cubic polynomial $p_i(x)$ on each interval $[x_i, x_{i+1}]$;
	- $f(x_i)=y_i$ at each data point;
	- $f(x)$ has a continuous (see CONTINUOUS FUNCTION) second derivative.
- Higher-degree splines can be similarly defined.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]