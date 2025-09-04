## Synthesis
- 
## Source [^1]
- A method of managing virtual memory. The logical address is subdivided into two fields: the low-order bits indicate a word or byte within a page and the high-order bits indicate a particular page. Active pages are held in main memory and a page that is not active may be transferred out to the swapping device. An associative memory indicates the physical location within memory of those pages that are present. For pages that are not in memory the associative memory will contain a pointer to the backing-store home for that particular page. When reference occurs to a page, an interrupt is generated if the page is not in main memory and the operating system will transfer the relevant page from the swapping device into main memory.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]