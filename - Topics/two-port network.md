## Synthesis
- 
## Source [^1]
- (four-terminal network; quadripole) A network that has only four terminals, i.e. a pair of input terminals (the input port) and a pair of output terminals (the output port). The behavior of a two-port network is usually described by the impedances presented at its terminals at specified frequencies. If the electrical properties are unchanged when the input and output ports are reversed the two-port network is symmetric; otherwise it is asymmetric. The network is described as balanced if its electrical properties are unchanged when both the input and output ports are interchanged simultaneously; otherwise it is unbalanced.
- A very common arrangement, used particularly for attenuators and filters, is a ladder network consisting of a number of series and shunt impedances (Fig. a). This arrangement may be broken down for analysis into identical sections each with the same characteristic impedance. In order to avoid power dissipation in the load by reflections, a ladder network must be terminated by an impedance equal in value to the iterative impedance of the sections. The ladder filter shown in Fig. a may be analysed as a series of T-sections (Fig. b) terminated in the iterative impedance $Z_{\mathrm{T}}$. The same network may be considered as a series of $\pi$-sections (Fig. c.) that must be terminated in the iterative impedance $Z_{\pi}$. Comparison of the two shows that the half-section or L-section (Fig. d) acts as an impedance transformer from $Z_{\pi}$ to $Z_{\mathrm{T}}$. Such half-sections may be used to match a two-port network to a load; they are especially important when composite networks are being designed. It can be shown that if the impedances used in the ladder are $Z_{1}$ and $Z_{2}$, as shown in Fig. b, then$$Z _ {T} Z _ {\pi} = Z _ {1} Z _ {2}$$
- ![[Pasted image 20260511035034.png|400]]
	- (a) Generalized ladder filter
- ![[Pasted image 20260511035100.png|400]]
	- (b) T-section
- ![[Pasted image 20260511035122.png|400]]
	- (c) $\pi$-section
- ![[Pasted image 20260511035143.png|400]]
	- (d) L-sections
- In general $Z_{1}$ and $Z_{2}$ and hence $Z_{\mathrm{T}}$ and $Z_{\pi}$ will be dependent on frequency. If the product $Z_{\mathrm{T}}Z_{\pi}$ is substantially independent of frequency the network is a constant-R network.
- Other arrangements of elements used to form ladder filters or attenuators are the O-network, H-network, bridged-T, bridged-H, and twin-T networks, which are shown in Figs. e, f, g, h, and i.
- ![[Pasted image 20260511035224.png|300]]
	- (e) O-network
- ![[Pasted image 20260511035252.png|400]]
	- (f) H-network
- ![[Pasted image 20260511035308.png|400]]
	- (g) Bridged-T network
- ![[Pasted image 20260511035325.png|300]]
	- (h) Bridged-H network
- ![[Pasted image 20260511035342.png|300]]
	- (i) Twin-T network
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]