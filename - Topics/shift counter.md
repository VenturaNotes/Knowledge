## Synthesis
- 
## Source [^1]
- A synchronous counter that consists of clocked flip-flops arranged as a shift register. Data is propagated from left to right (or from right to left) between the flip-flops by the application of a clock or count pulse. Counting is achieved by setting the contents of the shift register to logic 0 (or logic 1) and loading the leftmost (rightmost) flip-flop with a logic 1 (logic 0). An $m$-bit counter, which has $m$ flip-flops, will then require $m$ clock pulses to shift this 1 (or 0) to the rightmost (leftmost) flip-flop. The position in the register of the 1 (or 0) thus acts as a count of the number of pulses received since application of the load.
- The counter may be made to count continuously by arranging that the output of the rightmost (leftmost) flip-flop sets the input of the leftmost (rightmost) flip-flop. The counter is then known as a [[ring counter]].
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]