## Synthesis
- 
## Source [^1]
- (functional cohesion) A measure of the degree to which parts of a program module are closely functionally related. High cohesion means that each part is directed toward and essential for that module to perform its required function, and that the module performs only that function. Low cohesion might be due to convenience grouping of functions that are unrelated by function, timing, logic, procedure, or by sequence.
- [[Temporal cohesion]] occurs where a module contains several functions that must be performed at the same time, but are not closely related by function.
- [[Logical cohesion]] is where several logically related functions are placed in the same module. For example a unit may handle all input to a program irrespective of its source being from disk, communications port, keyboard, etc.
- [[Procedural cohesion]] is where functions that must be performed in a certain order are grouped together in the same module.
- [[Sequential cohesion]] occurs when the output from one part of a module is the input to the next part, but if the module is not constructed for functional cohesion it is possible that not all the related parts will occur in the one module.
- High functional cohesion might be seen as one characteristic of good design. See also COUPLING.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]