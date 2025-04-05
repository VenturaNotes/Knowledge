## Synthesis
- 
## Source [^1]
- (bistable) An electronic circuit element that is capable of exhibiting either of two stable states and of switching between these states in a reproducible manner. When used in logic circuits the two states are made to correspond to logic 1 and logic 0 . Flipflops are therefore one-bit memory elements and are frequently used in digital circuits.

  

The simplest form is the RS flip-flop; an implementation using NAND gates is shown in the diagram together with the flip-flop's truth table. A logic 1 on one of the two inputs either sets the Q output to logic 1 or resets Q to logic 0 . Output $\mathrm{Q}^{\prime}$; is the logical complement of Q . When $\mathrm{R}^{\prime}$ and $\mathrm{S}^{\prime}$ are both logic 1 (which is equivalent to R and S both logic 0 ), Q does not change state. The situation of both $\mathrm{R}^{\prime}$ and $\mathrm{S}^{\prime}$ at logic 0 is ambiguous and is avoided in more complex flip-flop implementations (see JK FLIP-FLOP). The outputs of this (and other) flip-flops are not just functions of the inputs but depend on both inputs and outputs. The device is thus a simple sequential circuit.

  

Extra logic gating may be included in the RS device, and in more complex flip-flops, to allow a clock signal to be input to the flip-flop, so producing a clocked flip-flop (see CLOCK). The Q output will not then change state until an active edge of the clock pulse occurs (edge-triggered device) or a complete clock cycle has occurred (pulse-triggered device). Provision may also be made to set up a given output regardless of the state of the inputs.

  

![[A Dictionary of Computer Science [part 6]_img_3.jpeg]]

![[A Dictionary of Computer Science [part 6]_img_4.jpeg]]

  

Flip-flop. RS flip-flop, logic diagram, and truth table

Various forms of flip-flop are available to perform specific functions; these include JK, D, T, and master-slave flip-flops. Flip-flops are important as memory devices in digital counters. The RS flip-flop is often considered to be the [[universal flip-flop]] since it forms the basic building block for more sophisticated implementations. JK, master-slave, and D flip-flops are all
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]