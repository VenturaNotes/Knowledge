---
aliases:
  - PDA
---
## Synthesis
- 
## Source [^1]
- A finite-state automaton augmented by a stack of symbols that are distinct from the symbols allowed in the input string. Like the finite-state automaton, the PDA reads its input string once from left to right, with acceptance or rejection determined by the final state. After reading a symbol, however, the PDA performs the following actions: change state, remove top of stack, and push zero or more symbols onto stack. The precise choice of actions depends on the input symbol just read, the current state, and the current top of stack. Since the stack can grow unboundedly, a PDA can have infinitely many different configurations$\textemdash$unlike a finite-state automaton.
- A nondeterministic PDA is one that has a choice of actions for some conditions. The languages recognized by nondeterministic PDAs are precisely the context-free languages. However not every context-free language is recognized by a deterministic PDA.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]