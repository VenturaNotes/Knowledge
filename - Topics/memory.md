## Synthesis
- You can swap the contents of two memory locations using bitwise XOR operator
```python
a = 10
b = 20
a = a^b
b = a^b
a = a^b
print(a,b)
```
## Source [^1]
- The electronic holding place for the instructions and data a computer needs to reach quickly
## Source[^2]
- A device or medium that can retain information for subsequent retrieval. The term is synonymous with storage and store, although it is most frequently used for referring to the internal storage of a computer that can be directly addressed by operating instructions. See also CACHE, MAIN MEMORY, MEMORY HIERARCHY, MEMORY MANAGEMENT, SEMICONDUCTOR MEMORY.
## Source[^3]
- The means by which information is stored in the brain. The exact mechanism of processing and storing information is not known but is thought to involve the construction of circuits of neurons in the cerebral cortex, which are strengthened by repeated use (see SYNAPTIC PLASTICITY). Various models of memory have been proposed, with different types of information and levels of processing. One model proposes three principal forms of memory based on duration. Sensory memory is the fleeting retention of stimuli perceived by the senses. These memories are almost immediately lost unless attention is paid to them, when they enter short-term memory (or 'working memory'). This lasts for up to a minute or so. With effort, for example repetition of a phone number, the information may then enter long-term memory, where it can remain for hours, days, or even years. The subsequent conscious recollection of things or facts involves explicit (declarative) memory, whereas implicit memory concerns motor skills, such as the ability to ride a bike, and conditioned reflexes. The transfer of short-term memory to long-term memory involves the limbic system, in particular the hippocampus. It is thought that connections in the hippocampus are necessary for consolidating and accessing short-term memory but not for recalling long-term memories. The amygdala is instrumental in producing fear and fear memories. Memory is essential to the processes of learning and recognition of individuals and objects.
- https://plato.stanford.edu/entries/memory/
	- Comprehensive account of concepts and models of memory, from the Stanford Encyclopedia of Philosophy
## Source[^4]
- $n$. The psychological function of preserving information, involving the processes of encoding, storage, and retrieval. Human memory consists of a series of interconnected systems serving different functions, one of the most basic divisions being into declarative memory for factual information about the world and procedural memory for information about how to carry out sequences of operations; another basic division being between long-term memory for information stored for more than a few seconds, short-term memory for temporary storage of information for briefer periods, and sensory memory (including the iconic store) for very brief storage of visual and possibly other sensory information; and a third basic division being into episodic memory for events and experiences and semantic memory for information about the world, although perceptual memory may not fall into either category. The power of the chemical senses to reawaken distant memories is discussed under redintegration. See also amnesia, blocking memory, conrabulation, CONSTRUCTIVE MEMORY, CUED RECALL, DEFERRED ACTION, DUAL-CODE THEORY (2), dUAL-PROCESS MODEL, ENCODING SPECIFICITY, FREE RECALL, HÖFfDING STEP, HYPERTHYMESIA, LEVELS OF PROCESSING, MEMORY DRUM, MEMORY OPERATING CHARACTERISTIC, MEMORY ORGANIZATION PACKET, MEMORY TRACE, METHOD OF SAVINGS, MNEMONIC, RECALL, RECOGNITION, REPRESENTATIONAL MOMENTUM, SCREEN MEMORY, STATE-DEPENDENT MEMORY, TIP-OF-THE-TONGUE PHENOMENON, UGLY SISTER EFFECT, WORKING MEMORY. \[From Latin memoria memory, from memor mindful]
## Source[^5]
- You can swap the contents of two memory locations using the bitwise XOR operator. 
```python
a = 10
b = 20
a = a^b
b = a^b
a = a^b
print(a,b)
```
## Source[^6]
- (store) Any device or physical medium associated with a computer and used to store information for subsequent retrieval. The information may, for example, be computer programs or the data on which programs operate. The information is stored in digital form as sequences of bits. The location of each item of information (usually in the form of a word or byte) can be identified by a unique address, which allows a particular item to be stored (or written) and retrieved (or read). The time taken to retrieve an item of information from memory is known as the access time. The memory capacity is the total amount of information, usually in terms of the number of bits or bytes, that can be stored in any given memory, or in a computer system as a whole.
- A computer system contains several types of memory that differ markedly in access time and capacity, and also in the amount of information that can be read or written on a given occasion and the cost of storing a given amount of information. For efficient and economical use of computer memory, the various types are organized into a hierarchy according to performance and cost. The highest performance and in general most expensive type is at the top level of the hierarchy, and is the internal register storage under the direct control of the central processing unit (CPU) used to assist in the execution of machine instructions. The main working data and code of a running program, and intermediate or partial results too large to fit into registers are stored in RAM (random-access memory), composed of solid-state electronic circuitry with access times of tens of nanoseconds; the stored information can be readily altered. To speed up program execution, relatively small-capacity solid-state cache memory with extremely short access time is often inserted between the CPU and the main memory. In modern multicore processors there are routinely three levels of cache between the processor registers and RAM.
- Backing store is below solid-state memory in the hierarchy. It is nonvolatile memory on which information is held for reference but not for direct execution. Permanently connected (online) backing store is usually in the form of magnetic disk memory, and the information is transferred to and from the main memory by means of a disk drive. The capacity of disk memory is very much larger than solid-state memory and it is much less expensive, but the access time is reckoned in milliseconds. Information is also held offline on, for example, floppy disks, CD-ROM, or magnetic tape, and these storage devices are at the lowest levels of the hierarchy. More recent developments have backing store implemented using solid-state flash memory configured to mimic the behavior of magnetic disk drives.
- http://computer.howstuffworks.com/computer-memory1.htm
	- Computer memory basics, on the `howstuffworks` website
## References

[^1]: https://www.techtarget.com/whatis/definition/memory
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^3]: [[(Home Page) A Dictionary of Biology 8th Edition by Oxford Reference]]
[^4]: [[(Home Page) A Dictionary of Psychology 4th Edition by Oxford Reference]]
[^5]: [[(Home Page) Python MCQ by Sanfoundry]]
[^6]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]