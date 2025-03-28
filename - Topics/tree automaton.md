## Synthesis
- 
## Source [^1]
- A generalization of the notion of a finite-state automaton, applying to trees rather than strings (see TREE LANGUAGE). There are two versions. A top-down machine begins at the root of the tree; having read the symbol at a node it changes state accordingly and splits into $n$ machines to process separately the $n$ descendants. A bottom-up machine begins with several separate activations of itself$\textemdash$one at each leaf node of the tree. Whenever all the subtrees of a particular node have been processed, the machines that have processed them are replaced by a single one at that node. Its state is determined by the symbol at the node and the final states of the descendant machines.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]