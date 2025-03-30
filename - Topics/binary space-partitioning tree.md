---
aliases:
  - BSP tree
---
## Synthesis
- 
## Source [^1]
- (BSP tree) A description of a scene obtained by recursive binary splitting. The BSP tree formed the basis of an algorithm developed by Henry Fuchs et al in 1980 to generate realistic images of scenes composed of polygons (planes) where many images of the same static environment are required. The BSP tree's root node defines a chosen polygon in the image. The two subtrees define the set of polygons on either side of the root plane. At each level, this process is repeated. If polygons straddle the specified plane at any stage, the polygon is split into two parts. Node polygons are chosen to minimize the number of polygons that are split.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]