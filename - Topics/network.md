---
aliases:
  - networks
---
## Synthesis
- The [[TCP-IP model]] is a network model which simplifies OSI into four layers
## Source [^1]
- Hardware used to create a network
	- [[Hub]]
	- [[Wireless access point]]
	- [[Switch]]
## Source[^2]
- Types of networks
	- [[PAN]]
	- [[LAN]]
	- [[MAN]]
	- [[wide area network|WAN]]
## Source[^3]
- A [[printer]], [[CD drive]], and [[Hard Disk Drives|hard disk]] can all be shared in a network
- A [[mouse]] is unable to be shared on a network
## Source[^4]
- Advantages of networks
	- They enable data to be shared between different users and devices
	- Organizations can save money on buying hardware, as hardware devices can be shared on a network
## Source[^5]
- (1) In communications, a rather loosely defined term applied to a system that consists of terminals, nodes, and interconnection media that can include lines or trunks, satellites, microwave, medium- and long-wave radio, etc. In general, a network is a collection of resources used to establish and switch communication paths between its terminals. A given network may be classified as a local area network, a metropolitan area network, or a wide area network, the differences lying as much in their style of organization as in their technology or geographical or physical size. Networks and servers have now largely replaced centralized mainframe computers in most applications. See also MESSAGE SWITCHING, NETWORK ARCHITECTURE, NETWORK DELAY, PACKET SWITCHING. 
- (2) In electronic circuitry, an interconnection of various electrical elements. A passive network contains no active (amplifying or switching) elements such as transistors; a linear network is a passive network that contains no nonlinear elements such as diodes. 
- (3) (net) In mathematics, a connected directed graph that contains no cycles. Interconnections involving objects such as telephones, logic gates, or computers could be represented using a connected but not necessarily directed graph.
## Source[^6]
- (1) A group of consumers for whom the utility derived from the consumption of certain goods or services increases as additional consumers purchase the same goods and services. Networks emerge if these particular goods or services have little or no value in isolation, but generate more value when more consumers use the same goods and services. A market characterized by such properties is called a network market in which there exist positive consumption externalities termed network externalities. A typical example of a network market is telecommunications.
- (2) A model of the interconnections within a set of consumers or firms. A network is described by a set of links that determine which consumers or firms are connected. As examples, connections can describe which consumers know each other, or which consumers are customers of a firm. Networks can be used to describe any economic or social situation in which there is a structure to the interaction of individuals. See also PRIVATE NETWORK; PUBLIC NETWORK.
## Source[^7]
- (1) In electronics, a number of impedances connected together to form a system that consists of a set of interrelated circuits and that performs specific functions. The behavior of the network depends on the values of the components, such as the resistances, capacitances, and inductances, from which it is formed and the manner in which they are interconnected. The values of the components are termed the network parameters or network constants. The nomenclature of networks describes either the type of component, the method of interconnection, or the expected behavior of the network.
- Networks are described as resistive, resistance-capacitance (R-C), inductance-capacitance (L-C), inductance (L) networks, etc., depending on their components.
	- Lattice networks have the input and output terminals at a junction between two or more conductors (Fig. a); a bridge network is a particular type of lattice network (Fig. b).
	- Series networks and parallel networks have their elements connected in series and in parallel, respectively.
	- Linear networks have a linear relationship between the voltages and currents; otherwise they are nonlinear.
	- Bilateral networks conduct in both directions whereas those that conduct in only one direction are unilateral.
	- Passive networks contain no energy source or sink other than normal ohmic losses; those that do contain an energy source or sink are active.
	- All-pass networks attenuate all frequencies equally; other networks are described according to their frequency response (see FILTER).
- ![[Pasted image 20260404023113.png|600]]
	- (a) Lattice network
	- (b) Bridge network
	- Parts
		- Input
		- Output
- A point within a network at which three or more of the elements are joined is termed a node (or branch point); points 1-8 in Fig. c are nodes. A conducting path between two such points is termed a branch (1-2, 3-4, etc., in Fig. c). A voltage at a point in the network measured relative to the voltage at a designated node is termed a node voltage. A closed conducting loop in the network (e.g. 1, 3, 7, 5, 1) forms a mesh contour, and the portion of the network bounded by it is termed a mesh. Any branch that is common to two or more meshes is a mutual branch (e.g. 5-6). Two branches of a network are said to be conjugate if an e.m.f. in one of them does not produce a current in the other. The currents circulating in the meshes are known as mesh currents.
- ![[Pasted image 20260404023252.png|200]]
	- (c) Conducting paths of a network
- The behavior of a network may be analyzed by applying Kirchhoff's laws to each mesh in the network in turn; both the real and imaginary parts of the complex impedances involved must be satisfied simultaneously. For a large network containing many meshes, as with many types of filter network, this method is very cumbersome. An alternative is to apply Thévenin's theorem or Norton's theorem to a linear network; these theorems however cannot be applied to nonlinear networks.
- Analysis of linear networks can most usefully be done by considering the network as a two-port network and deriving sets of equations relating the currents, voltages, and impedances at the input and output; this is known as two-port analysis. Fig. $d$ shows a passive two-port network with an input source consisting of a voltage generator $V_{s}$ of internal impedance $Z_{s}$. Fig. $e$ shows an active two-port network presenting an input impedance $z_{1}$ to the input source $V_{s}$ of internal impedance $Z_{s}$, and appearing as a current generator $g_{m}\nu_{1}$ shunted by a resistance $r_0$ and producing a voltage $\nu_{2}$ in the output circuit ($g_{m}$ being the transconductance).
- ![[Pasted image 20260404023404.png|600]]
	- (d) Passive two-port network
	- Part
		- Load impedence
- ![[Pasted image 20260404023533.png|400]]
	- (e) Active two-port network
	- Part
		- Load impedence
- Three different sets of equations can be written down: the impedance equations, the admittance equations, and derived from these the hybrid equations. The impedance equations can be written in the form of a matrix:
	- ![[Pasted image 20260404023607.png|300]]
- Equivalent matrices can be written for the hybrid and admittance equations. The constants in these equations are known as $z$ , $h$ , and $y$ parameters, respectively, or collectively as two-port parameters. Three-terminal devices, such as transistors, can be represented as two-port networks that have two terminals joined together (see TRANSISTOR PARAMETERS).
- In the case of nonlinear networks the matrix equations are only true for small changes of current and voltage. In such cases the two-port parameters are termed small-signal parameters and are quantities that change value according to the operating conditions of the device.
- The input and output impedances of a network, $\nu_{1} / i_{1}$ and $\nu_{2} / i_{2}$ , can be calculated from the matrix equations; it can be shown that $\nu_{1} / i_{1}$ depends on the load impedance $Z_{\mathrm{L}}$ connected to the output and conversely that $\nu_{2} / i_{2}$ depends on the impedance $Z_{\mathrm{s}}$ of the source connected to the input.
- The driving-point impedance is the impedance presented at a pair of terminals of a network of four or more terminals, under designated conditions at the other pair(s) of terminals. In the limiting case, for a two-port network, if the input (or output) is open circuit, the output (or input) impedance is the open-circuit impedance. The other limiting case is when the input (or output) is a short circuit in which case the output (or input) impedance is the short-circuit impedance. The quantities $\nu_{2} / i_{1}$ and $\nu_{1} / i_{2}$ are the transimpedances of the network under open-circuit conditions, i.e. when $i_{2} = 0$ and $i_{1} = 0$ , respectively. 
- (2) In communications, a collection of resources used by a group of users to exchange information. In a local area network (LAN), users generally belong to a single organization located on a single site or a small number of nearby sites. A wide area network (WAN) is also usually operated by a single organization but communications are over large distances. Communication paths in a network are established and switched between computer terminals following agreed procedures known as protocols. The communication lines may include cables, optical fibres, phone lines, or radio links. These communication lines are interconnected at points known as nodes. The nodal device may be an electrical interface or a computer. See also DIGITAL COMMUNICATIONS; BUS NETWORK; RING NETWORK; STAR NETWORK.
## References

[^1]: https://quizizz.com/admin/quiz/5da881f925473f001a69cc22/wireless-networks
[^2]: https://youtu.be/NRckVJk9n0k?si=tkx2bTZXgBj6WylX
[^3]: https://youtu.be/HGYOEeik844?si=r1XASyagzZFAMtoe
[^4]: https://computerscienced.co.uk/site/ocr-computer-science-gcse-j277/1-3-computer-networks-quizzes/ks4-ocr-j277-1-3-wired-and-wireless-networks-quiz/
[^5]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^6]: [[(Home Page) A Dictionary of Economics 5th Edition by Oxford Reference]]
[^7]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]