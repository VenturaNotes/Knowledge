---
aliases:
  - ANOVA
---
## Synthesis
- 
## Source [^1]
- A general procedure for partitioning the overall variability in a set of data into components due to specified causes and random variation. It involves calculating such quantities as the 'between-groups sum of squares' and the 'residual sum of squares' and dividing by the degrees of freedom to give so-called 'mean squares'. The results are usually presented in an ANOVA table, the name being derived from the opening letters of the words 'analysis of variance'. Such a table provides a concise summary from which the influence of the explanatory variables can be estimated and hypotheses can be tested, usually by means of F-tests
- http://www.bmj.com/cgi/content/full/312/7044/1472
	- A description of the analysis and ins interpretation in a medical context (subscription)

## Source[^2]
- A statistical technique based on decomposing the total variance of some characteristic of a population into parts correlated with other characteristics, and residual variation. In particular, analysis of variance is used to test whether sections of a population appear to differ significantly in some property. For example, if $y_i$ is the personal income of individual $i$, analysis of variance can be used to test whether there are significant regional differences in mean income. The total variance of the population is decomposed into the part due to differences within regions, and the part due to differences between regional means. The larger the proportion of total variance due to differences between group means, the more likely it is that the groups are systematically different, whereas the higher the proportion of total variance due to within-group variance, the more likely it is that apparent differences between group means arise from sampling error.

## Source[^3]
- A technique, originally developed by R. A. Fisher, whereby the total variation in a vector of numbers $y_{1} \ldots y_{n}$, expressed as the sum of squares about the mean

  

$$

\sum\left(y_{i}-y_{i}\right)^{2}

$$

  

is split up into component sums of squares ascribable to the effects of various classifying factors that may index the data. Thus if the data consist of a two-way $m \times n$ array, classified by factors A and B and indexed by

  

$$

i=1, \ldots, m \quad j=1, \ldots, n

$$

  

then the analysis of variance gives the identity

  

$$

\begin{aligned}

& \sum_{\frac{\sum}{n}\left(y_{i j}-y\right)^{2} \equiv \sum_{\frac{\sum}{n}}\left(y_{i}-y\right)^{2}+} \\

& \text { Total A } \\

& \text { main effect } \\

& \sum_{\frac{\sum}{n}\left(y_{j}-y\right)^{2}+\sum_{\frac{\sum}{n}}\left(y_{i j}-y_{i}-y_{j}+y\right)^{2}} \\

& \text { main effect interaction }

\end{aligned}

$$

  

Geometrically the analysis of variance becomes the successive projections of the vector $\boldsymbol{y}$, considered as a point in $n$-dimensional space, onto orthogonal hyperplanes within that space. The dimensions of the hyperplanes give the degrees of freedom for each term; in the above example these are

  

$$

m n-1 \equiv(m-1)+(n-1)+(m-1)(n-1)

$$

  

A statistical model applied to the data allows mean squares, equal to (sum of squares)/(degrees of freedom), to be compared with an error mean square that measures the background 'noise'. Large mean squares indicate large effects of the factors concerned. The above processes can be much elaborated (see EXPERIMENTAL DESIGN, REGRESSION ANALYSIS).
## Source[^4]
- (ANOVA; variance analysis) 
- (1) A commonly used method for examining the statistically significant differences between the means of two or more populations. In its simplest form (one-way analysis of variance), it involves only one dependent variable (metric measurement level) and one or more independent variables (non-metric). For example, a researcher may be interested in establishing if there is a statistically significant difference in the average amount spent on alcohol per week between two samples of population (say, male and female). Here, the dependent variable is the amount spent and the independent variable is the gender of the participants. 
- (2) In standard costing and budgetary control, the analysis of variances in order to seek their causes. The total profit variance or production cost variance is analysed into sub-variances, based on such factors as direct labour, direct materials, fixed and variable overheads, and sales, in order to indicate the major reasons for the difference between budgeted figures and actual figures.
## References

[^1]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]
[^2]: [[Home Page - A Dictionary of Economics 5th Edition by Oxford Reference]]
[^3]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^4]: [[Home Page - A Dictionary of Business and Management 6th Edition by Oxford Reference]]