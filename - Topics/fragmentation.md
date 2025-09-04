## Synthesis
- 
## Source [^1]
- The creation of many small areas of memory, which may arise as a side effect when memory is allocated to and then released by processes. When a process requests a memory allocation, it is assigned the use of a contiguous area, often part of a larger area none of which is currently assigned to any process. The fragments of unallocated memory thus generated can in time become so small that they are not capable of meeting the requests of any process, and they then lie idle. Defragmentation is a process that, by consolidating memory which is in use, creates larger contiguous areas of unused memory, of a size that allows them to be allocated to meet requests by processes. See also EXTERNAL FRAGMENTATION, INTERNAL FRAGMENTATION.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]