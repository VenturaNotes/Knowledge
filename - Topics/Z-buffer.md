---
aliases:
  - depth buffer
---
## Synthesis
- 
## Source [^1]
- A method for hidden-surface removal. For each object in a scene, pixels are generated with colour and depth information. The Z-buffer is an array that stores the current Z-depth of each pixel. As objects are sent to the Z-buffer only those nearest the viewer are retained. Each pixel is set to the new light intensity only if the depth of the point is less than the value stored at the corresponding position in the Z-buffer. The method is simple but costly in processing and storage, hence hardware or low-level implementations are common. See also A-BUFFER.
## References

[^1]: [[Home Page - A Dictionary of Computer Science by Oxford Reference]]