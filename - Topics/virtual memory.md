## Synthesis
- 
## Source [^1]
- When data is in virtual memory, it is stored on a secondary storage device such as a [[Hard Disk Drives|hard disk drive]]
- Virtual memory is slower than [[RAM]]

## Source[^2]
- A system in which a process's workspace is held partly in high-speed memory and partly on some slower, and cheaper, backing-store device. When the process refers to a memory location the system hardware detects whether or not the required location is physically present in memory, and generates an interrupt if it is not; this allows the system supervisor to transfer the required data area from backing store into memory. For this purpose the address space is subdivided into pages typically holding 4 kilobytes of data. Addresses within a page are defined by the 12 low-order bits in the address. The high-order bits can be thought of as the page number; they are used to search an associative memory that shows either the physical location within memory of word zero of the page, or indicates that the page is not present in memory$\textemdash$at which point an interrupt is generated. The system supervisor then locates the page on backing store and transfers it into memory, updating the associative memory as it does so.
## References

[^1]: https://computerscienced.co.uk/site/ocr-computer-science-gcse-j277/1-2-memory-and-storage-quizzes/ks4-ocr-j277-1-2-memory-quiz/
[^2]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]