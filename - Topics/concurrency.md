## Synthesis
- 
## Source [^1]
- The progressing of two or more activities (processes, programs) in parallel. It is a term that describes the general topic of parallelism in computer systems, specifically multiprocessing systems. Specification of concurrency, and the consequent problems of interlock and synchronization, requires special features in the programming language, and is a feature of the class of real-time languages.
- The usual method of describing parallelism is Flynn's classification, which does so in terms of parallelism in the instruction stream and in the data stream of a system. Thus there are four categories:
	- SISD, single instruction, single data;
	- SIMD, [[single instruction, multiple data]];
	- MISD, multiple instruction, single data;
	- MIMD, [[multiple instruction, multiple data]].
- The first of these, SISD, is the conventional serial processor. The third of these, MISD, does not really occur in current systems. The other two are of most interest in multiprocessor systems. The SIMD is suited to operating upon data of the sort that exists in vectors and matrices by taking advantage of the inherent parallelism in that data. Thus the array processor is one such system. Another is represented by the supercomputer with parallel and different arithmetic units that overlap arithmetic operations. The MIMD system represents a wide range of architectures from the large symmetrical multiprocessor system to the small asymmetrical minicomputer/DMA channel combination.
- Shared-memory systems form a distinct group within the MIMD category. They are general-purie multiprocessor systems that share common memory, and are thus also called closely coupled or tightly coupled systems. Distributed systems$\textemdash$wide area, metropolitan area, and local area networks$\textemdash$form another MIMD group, sometimes referred to as loosely coupled systems.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]