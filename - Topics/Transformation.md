---
aliases:
  - transformations
---
## Synthesis
- In linear algebra, a transformation is an operation that takes an input vector and produces an output vector.
	- #question Is it not able to take a matrix as an input or output too? Or are vectors considered to be matrices? 
	- Geometrically
		- Given a vector (an arrow) in a coordinate system, a transformation might modify the vector by rotating, stretching, shrinking or reflecting it across an axis. 
			- #question Show examples of each
		- Example
			- Given a vector from the origin to (1,1), a transformation could rotate it to point to `(-1,1)` or stretch it to (2,2)
				- #question Show how this is possible
	- Mathematically
		- Given vector $v$, transformation $T$ produces a new vector $T(v)$. When represented by a matrix $A$, this looks like $Av = v'$. 
		- Example
			- $\begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}\begin{pmatrix} 1 \\ 1 \end{pmatrix}=\begin{pmatrix} 3 \\ 3 \end{pmatrix}$
				- $A$ transforms $v$ into $v'$. The original vector was stretched by a factor of 3 along original direction
					- #question How do we know it was along original direction?
## Source [^1]
- (1) Another name for function, used especially in geometry. 
- (2) (of programs) See PROGRAM TRANSFORMATION. 
- (3) (of statistics data) A change of scale used to improve the validity of statistical analyses. For data in which small values have smaller variance than large values a logarithmic or square-root transformation is often recommended. For data in the form of proportions, a transformation from the scale $(0,1)$ to an infinite scale is advisable before performing analysis of variance or regression analysis. Several transformations exist for proportions, such as the logistic or log-odds-ratio that is used in the analysis of generalized linear models. Appropriate transformations may be suggested by studying residuals in a regression analysis.
## Source[^2]
- (1) A permanent heritable change in a cell, particularly a bacterial cell, that occurs as a result of its acquiring foreign DNA. For example, nonvirulent bacterial cells can be transformed into virulent forms if cultured in a medium containing killed virulent bacteria. In cloning, the host cells are transformed by the insertion of recombinant DNA. See GENE Cloning. 
- (2) The conversion of a normal cell into a malignant cell (see CANCER), which is brought about by mutation of genes and consequent cellular changes, sometimes through the action of carcinogens or oncogenic viruses.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Biology 8th Edition by Oxford Reference]]