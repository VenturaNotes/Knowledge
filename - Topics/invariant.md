---
aliases:
  - invariants
---
## Synthesis
- 
## Source [^1]
- A property or quantity that is not changed by one or more specified operations or transformations. For example, for a conic with equation $$Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0$$the quantity $B^2 - 4AC$ is invariant under a rotation of axes. The distance between two points and the angle between two lines are invariants under translations and rotations of the plane, but distance is not invariant under dilations, while angle is.

## Source[^2]
- A property that remains TRUE across some transformation or mapping. In the context of program correctness proofs, an invariant is an assertion that is associated with some program element and remains TRUE despite execution of some part of that element. For example, a loop invariant is an assertion that is attached at some point inside a program loop, and is TRUE whenever the attachment point is reached on each iteration around the loop. Similarly a [[module invariant]] is associated with a given module, and each operation provided by the module assumes that the invariant is TRUE whenever the operation is invoked and leaves the invariant TRUE upon completion.
- Note that invariants cannot accurately be described as TRUE AT ALL TIMES since individual operations may destroy and subsequently restore the invariant condition. However the invariant is always TRUE between such operations, and therefore provides a static characterization by which the element can be analyzed and understood.

## References

[^1]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]
[^2]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]