---
aliases:
  - DRAM
  - dynamic RAM
---
## Synthesis
- DRAM stands for dynamic random access memory
	- Dynamic means the stored data must be periodically refreshed because it fades away with time
		- #question Why must it be periodically refreshed? What fades away with time?
	- It's the main memory type used in computers due to its high density (fit a lot of it in a small space) and relatively low cost
		- #question What other memory types are there which many not be as popular? 
- Each bit in DRAM is stored using a [[capacitor]] (tiny electrical cell) that holds a charge
	- Charged capacitor = 1
	- Discharged capacitor = 0
- However, capacitors are known to leak charge over time (milliseconds). Therefore, DRAM must periodically refresh the stored data by recharging the capacitors to their correct values
	- #question Is the reason it leaks charge over time because it's made from capacitors instead of transistors? What is the difference between a capacitor and a transistor?
	- This refresh process happens thousands of times per second.
	- During a refresh, those memory cells can’t be read or written, because the system is busy recharging them
		- #question How does that work? 
		- #question What does a refresh look like? A visual aid would be greatly helpful
	- #question How does DRAM know to charge capacitors to correct values? Where is that information stored? 
	- #question What is meant by milliseconds here?

### Examples
- The Apple M1 chip uses DRAM 
## Source [^1]
- 
## References

[^1]: