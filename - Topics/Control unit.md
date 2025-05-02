---
aliases:
  - CU
---
## Synthesis
- 
## Source [^1]
- The portion of a central processor that contains the necessary registers, counters, and other elements to provide the functionality required to control the movement of information between the memory, the ALU, and other portions of the machine.
- In the simplest form of the classical von Neumann architecture, the control unit contains a program counter, an address register, and a register that contains and decodes the operation code. The latter two registers are sometimes jointly called the [[instruction register]]. This control unit then operates in a two-step fetch-execute cycle. In the fetch step the instruction is obtained (fetched) from memory and the decoder determines the nature of the instruction. If it is a memory reference instruction the execute step carries out the necessary operation(s) and memory reference(s). In some cases, e.g. a nonmemory reference instruction, there may be no execute step. When the instruction calls for indirect addressing, an additional step, usually called ‘defer’, is required to obtain the indirect address from the memory. The last action during the execute step is to increment the program counter or, in some cases—e.g. a conditional branch instruction—to set the program counter to a value determined by the instruction register, depending on the status of the accumulator or qualifier register (condition-code register).
- In more complex machines and non von Neumann architectures, the control unit may contain additional registers such as index registers, arithmetic units to provide address modifications, registers, stacks, or pipelines to contain forthcoming instructions, and other functional units. Control units in supercomputers have become powerful and complex; they may contain specialized hardware that allows for parallel processing of instructions which are issued sequentially.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]