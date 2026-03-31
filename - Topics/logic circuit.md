## Synthesis
- 
## Source [^1]
- An electric circuit concerned with logic systems. The term logic device is often used synonymously. A logic circuit is required to produce specified binary outputs as a result of specified binary inputs. This may be accomplished by using logic gates, producing what is called [[hardware circuitry]]. Alternatively the inputs may be associated with the address lines of a ROM and the outputs with the data lines of a ROM; this is called firmware circuitry.
- Hardware circuitry constructed from integrated-circuit packages on circuit boards requires two types of wiring. The first type carries the logic information between gates. The second type provides the power for the individual chips. The process of locating the power paths so that they do not interfere with the logic paths is called [[power routing]].
- Logic circuitry may be mathematically analyzed using Boolean (or switching) algebra. In this representation the binary 1 is associated with the identity element and the logic 0 is associated with the null element, i.e. zero.
- See also COMBINATIONAL CIRCUIT, DIGITAL LOGIC, MULTIVALUED LOGIC, SEQUENTIAL CIRCUIT.
## Source[^2]
- A circuit designed to perform a particular logical function based on the concepts of 'and', 'either-or', 'neither-nor', etc. Normally these circuits operate between two discrete voltage levels, i.e. high and low logic levels, and are described as binary logic circuits. Logic using three or more logic levels is possible but not common.
- The basic logic gates that implement the elementary logical functions are as follows.
	- AND gate: a circuit with two or more inputs and one output in which the output signal is high if and only if (sometimes written iff) all the inputs are high simultaneously;
	- NOT gate (or inverter): a circuit with one input whose output is high if the input is low and vice versa;
	- NAND gate: a circuit with two or more inputs and one output, whose output is high if any one or more of the inputs is low, and low if all the inputs are high;
	- NOR gate: a circuit with two or more inputs and one output, whose output is high if and only if all the inputs are low;
	- OR gate: a circuit with two or more inputs and one output whose output is high if any one or more of the inputs are high;
	- exclusive OR gate: a circuit with two inputs and one output whose output is low if both inputs are identical; otherwise it is high. It can be extended to having more than two inputs, in which case its behavior is to output high if an odd number of inputs are high.
- The graphical symbols for the logic gates are shown in the table. These circuits are for use with positive logic: that is, the high voltage level represents a logical 1 and low a logical 0. Negative logic has the high level representing a logical 0 and low a logical 1. The same circuits may be used in negative logic but become the complements of the positive logic circuits, i.e. a positive OR gate becomes a negative AND gate.
- Binary logic circuits are extensively used in computers to carry out instructions and arithmetical processes. Any logical procedure may be effected by using a suitable combination of the basic gates. See also TRUTH TABLE; BoOLEAN ALGEBRA.
- Binary circuits may be formed from discrete components or, more commonly, from integrated circuits. Families of integrated logic circuits exist based on bipolar junction transistors; these include emitter-coupled logic (ECL), $I^2L$, nonthreshold logic (NTL), and transistor-transistor logic (TTL). MOS logic circuits are based on MOSFETs. Typically, these are built using either the NMOS or CMOS MOSFET families.
- ![[Pasted image 20260331000130.png|400]]
	- Graphical symbols for logic gates
	- Parts
		- Popular (formerly BSI symbol)
		- Binary logic circuit : IEC approved symbol
			- AND gate (&)
			- NAND gate, negated output (&)
			- NAND gate, negated inputs (&)
			- OR gate ($\ge 1$)
			- NOR gate, negated output $\ge 1$
			- NOR gate, negated inputs $\ge 1$
			- Exclusive-OR gate $=1$
			- Inverter (NOT gate)
- Bipolar logic circuits are capable of very high-speed operation but have relatively complex structures compared to MOS logic circuits, and therefore a lower functional packing density. MOS logic circuits have thus been widely used for large-scale integration (LSI) despite their lower speed of operation, and bipolar logic circuits have been used for circuits demanding high performance and high speeds. Recent improvements in bipolar technology, however, have improved the packing densities that can be achieved with bipolar circuits. For VLSI (very large-scale integration) applications demanding high speeds of operation, bipolar circuits have great potential. $\mathrm{I}^2\mathrm{L}$ circuits offer the highest density and lowest power dissipation, approaching that of MOS circuits. ECL circuits have the highest performance at present. However, given their high noise immunity and low static power consumption, most modern VLSI devices are built using CMOS.
- https://logic.ly/lessons/
	- An introduction to logic circuits and gates
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]