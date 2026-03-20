---
aliases:
---
## Synthesis
- A term used in digital electronics and computer architecture
- A fundamental building block of sequential logic circuits, capable of storing one [[bit]] of binary data. In SRAM, each bit is typically stored in a flip-flop, which maintains its state (0 or 1) as long as power is supplied, without requiring periodic refreshing
	- #question What would periodic refreshing look like? This would occur in D-ram, right? 
## Source [^1]
- (bistable) An electronic circuit element that is capable of exhibiting either of two stable states and of switching between these states in a reproducible manner. When used in logic circuits the two states are made to correspond to logic 1 and logic 0 . Flipflops are therefore one-bit memory elements and are frequently used in digital circuits.

  

The simplest form is the [[SR flip-flop|RS flip-flop]]; an implementation using NAND gates is shown in the diagram together with the flip-flop's truth table. A logic 1 on one of the two inputs either sets the Q output to logic 1 or resets Q to logic 0 . Output $\mathrm{Q}^{\prime}$; is the logical complement of Q . When $\mathrm{R}^{\prime}$ and $\mathrm{S}^{\prime}$ are both logic 1 (which is equivalent to R and S both logic 0 ), Q does not change state. The situation of both $\mathrm{R}^{\prime}$ and $\mathrm{S}^{\prime}$ at logic 0 is ambiguous and is avoided in more complex flip-flop implementations (see JK FLIP-FLOP). The outputs of this (and other) flip-flops are not just functions of the inputs but depend on both inputs and outputs. The device is thus a simple sequential circuit.

  

Extra logic gating may be included in the RS device, and in more complex flip-flops, to allow a clock signal to be input to the flip-flop, so producing a clocked flip-flop (see CLOCK). The Q output will not then change state until an active edge of the clock pulse occurs (edge-triggered device) or a complete clock cycle has occurred (pulse-triggered device). Provision may also be made to set up a given output regardless of the state of the inputs.

  

![[A Dictionary of Computer Science [part 6]_img_3.jpeg]]

![[A Dictionary of Computer Science [part 6]_img_4.jpeg]]

  

Flip-flop. RS flip-flop, logic diagram, and truth table

Various forms of flip-flop are available to perform specific functions; these include JK, D, T, and master-slave flip-flops. Flip-flops are important as memory devices in digital counters. The RS flip-flop is often considered to be the [[universal flip-flop]] since it forms the basic building block for more sophisticated implementations. JK, master-slave, and D flip-flops are all
## Source[^2]
- The movement (transverse diffusion) of a lipid molecule from one surface of a lipid bilayer membrane to the other, which occurs at a very slow rate. This contrasts with the much faster rate at which lipid molecules exchange places with neighboring molecules on the same surface of the membrane (lateral diffusion).
## Source[^3]
- A bistable multivibrator circuit that usually has two inputs corresponding to the two stable states. It is so called because application of a suitable input pulse causes the device to 'flip' into the corresponding state and remain in that state until a pulse on the other input causes it to 'flop' into the other state.
- Flip-flops are widely used in computers as counting and storage elements and several types have been developed. Flip-flops as described above are unclocked and are triggered directly by the input pulses. Clocked flip-flops have a third input to which a clock pulse is applied. The output state of the device is determined by the state of the inputs at the moment a clock pulse is applied. The basic types of flip-flops are described below.
- A D-type flip-flop ('D' stands for delay) is a clocked flip-flop with a single input whose output is delayed by one clock pulse: if a logical 1 appears at the input, a logical 1 will appear at the output one clock pulse later.
- An R-S flip-flop is a flip-flop whose inputs are designated R and S. The outputs corresponding to the various input combinations are shown in the table of Fig. a. Logical 1s should not be allowed to appear on the inputs together.
- ![[Screenshot 2026-03-19 at 7.36.16 AM.png|400]]
	- (a) Clocked R-S flip-flop
	- Part
		- Clock input
- A J-K flip-flop is a flip-flop whose inputs are designated J and K (Fig. b). These devices are almost invariably clocked and their outputs are the same as the R-S type except when logical 1s appear together at the inputs. In these circumstances the device changes state. The J-K flip-flop together with the D-type flip-flop are the most useful types of flip-flop.
- ![[Screenshot 2026-03-19 at 7.37.14 AM.png|300]]

| J   | K   | Q         |
| --- | --- | --------- |
| 0   | 0   | no change |
| 0   | 1   | 0         |
| 1   | 0   | 1         |
| 1   | 1   | toggle    |
- (b) Clocked J-K flip-flop
- An R-S-T flip-flop has three inputs designated R, S, and T. The R and S inputs produce outputs as described above. Application of a pulse to the T input causes the device to change state.
- A T flip-flop has only one input. Application of a pulse to this input causes the device to change state.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Biology 8th Edition by Oxford Reference]]
[^3]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]