## Synthesis
- 
## Source [^1]
- The combination of two or more companies under the same control for their mutual benefit, by reducing competition, saving costs by reducing overheads, capturing a larger market share, pooling resources, cooperating on research and development, enhancing competitive advantage, etc. In horizontal (or lateral) integration the businesses carry out the same stage in the value chain or produce similar products or services; they are therefore competitors. In a monopoly, horizontal integration is complete, while in an oligopoly there is considerable horizontal integration. In vertical integration a company obtains control of its suppliers (sometimes called backward integration) or of the concerns that buy its products or services (forward integration). Conglomerate integration takes place between firms in different value chains.
## Source[^2]
- (1) The combination of different economic activities under unified control. This may involve vertical integration, that is, either backward integration, where a business is combined with one supplying its inputs, or forward integration, where a business is combined with one using its outputs. It may also involve horizontal integration, where a business is combined with another which may use the same suppliers or sell in the same markets. See also BACKWARD INTEGRATION; FORWARD INTEGRATION; HORIZONTAL INTEGRATION; VERTICAL INTEGRATION.
- (2) The organization of economic activities so that national boundaries do not matter. The European Union and the North American Free Trade Agreement are examples of integration. Complete economic integration would imply free trade in all goods and services, perfect capital mobility, complete freedom of migration, complete freedom of establishment for businesses, and an unhindered flow of information and ideas. It would also imply the elimination of national differences in taxation, in the financing of social services, in the rules governing competition and monopoly, and in environmental regulation; and arguably a single currency.
- (3) In time series analysis, stationary increments in a time series process. See also ORDER OF INTEGRATION.
## Source[^3]
- $n$. the blending together of the nerve impulses that arrive through the thousands of synapses at a nerve cell body. Impulses from some synapses cause excitation, and from others inhibition; the overall pattern decides whether an individual nerve cell is activated to transmit a message or not.
## Source[^4]
- (in neurophysiology) The coordination within the brain of separate but related nervous processes. For example, sensory information from the inner ear and the eye are both necessary for the sense of balance. These stimuli must be integrated by the brain not only with each other but also with various motor nerves, which coordinate the muscles that control posture.
## Source[^5]
- The process of finding an antiderivative of a given function $f$. 'Integrate $f$' means 'find an antiderivative of $f$'. Such an antiderivative may be called an indefinite integral of $f$ and be denoted by$$\int f(x) \, dx$$
- Such antiderivatives are only defined up to addition of an arbitrary constant.
- The term 'integration' is also used for any method of evaluating a definite integral. The definite integral$$\int_a^b f(x) \, dx$$can be evaluated if an antiderivative $\phi$ of $f$ can be found, because then its value is $\phi(b) - \phi(a)$. (This is provided that $a$ and $b$ both belong to an interval in which $f$ is continuous.) However, for many functions $f$, it can be shown there is no antiderivative expressible in terms of elementary functions, and other methods of evaluation have to be employed such as numerical integration.
- What ways are there, then, of finding an antiderivative? If the given function can be recognized as the derivative of a familiar function, an antiderivative is immediately known. For some standard integrals, see APPENDIX 8; more extensive tables of integrals are available. Certain techniques of integration may also be tried, among which are the following:
### Change of variable/Substitution
- If it is possible to find a suitable function $g$ such that the integrand can be written as $f(g(x))g'(x)$, it may be possible to find an indefinite integral using the change of variable $u = g(x)$; this is because$$\int f(g(x))g'(x) \, dx = \int f(u) \, du$$a rule derived from the chain rule for differentiation. For example, in the integral$$\int 2x(x^2 + 1)^8 \, dx$$let $u = g(x) = x^2 + 1$. Then $g'(x) = 2x$ (this can be written '$\text{d}u = 2x \, \text{d}x$'), and, using the rule above with $f(u) = u^8$, the integral equals$$\int (x^2 + 1)^8 2x \, dx = \int u^8 \, du = \frac{1}{9}u^9 = \frac{1}{9}(x^2 + 1)^9$$
- Commonly, it may seem more natural to treat $x$ as a function of $u$ and 'substitute' $x = g(u)$ according to$$\int f(x) \, dx = \int f(g(u))g'(u) \, du$$
- Note in the following example of a definite integral that it is necessary to change from $x$-limits to $u$-limits.
- Let $x = g(u) = \tan u$. Then $g'(u) = \sec^2 u$ (this can be written '$\text{d}x = \sec^2 u \, \text{d}u$'), and recalling $1 + \tan^2 u = \sec^2 u$, the integral becomes$$\int_{x=0}^{x=\infty} \frac{dx}{(1 + x^2)^{3/2}} = \int_{u=0}^{u=\pi/2} \frac{\sec^2 u \, du}{(1 + \tan^2 u)^{3/2}} = \int_{u=0}^{u=\pi/2} \cos u \, du = \sin \frac{\pi}{2} - \sin 0 = 1$$
### Integration by parts

- The rule for integration by parts,$$\int f(x)g'(x) \, dx = f(x)g(x) - \int g(x)f'(x) \, dx$$is derived from the rule for differentiating a product $f(x)g(x)$, and is useful when the integral on the right-hand side is easier to find than the integral on the left. For example, in the integral$$\int x \cos x \, dx$$let $f(x) = x$ and $g'(x) = \cos x$. Then $g(x)$ can be taken as $\sin x$ and $f'(x) = 1$, so the method gives$$\int x \cos x \, dx = x \sin x - \int \sin x \cdot 1 \, dx = x \sin x + \cos x$$
- See also INTEGRABLE, LEBESGUE INTEGRAL, PARTIAL FRACTIONS, REDUCTION FORMULA, SEPARABLE FIRST-ORDER DIFFERENTIAL EQUATIONS.

## References

[^1]: [[(Home Page) A Dictionary of Business and Management 6th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Economics 5th Edition by Oxford Reference]]
[^3]: [[(Home Page) Concise Medical Dictionary 10th Edition by Oxford Reference]]
[^4]: [[(Home Page) A Dictionary of Biology 8th Edition by Oxford Reference]]
[^5]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]