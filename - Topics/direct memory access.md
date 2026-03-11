---
aliases:
  - DMA
---
## Synthesis
- 
## Source [^1]
- A method whereby I/O processes can obtain access to the CPU's memory while a program is running. This is accomplished by permitting the I/O controller or channel that has been previously instructed to move a block of data to or from the memory to temporarily take control of the memory for (usually) one memory cycle by specifying the memory address, thus allowing a single word (or group of words if the memory is so organized) to be read or written. The method is therefore also referred to as cycle stealing. The timing requirement is normally that of the slower external device and is prompted by the ability of that device to receive or provide desired data, hence the alternative synonym data break.
## Source[^2]
- (DMA) A type of computer input/output (I/O) in which a special DMA controller (DMAC) transfers data between main memory and the I/O devices. Under normal circumstances, an I/O device requires the central processing unit (CPU) to take an active role in the data transfer (Fig. a). The transfer rate is then limited by the bus read-write cycles, and furthermore involves the CPU in essentially a data movement role rather than a data processing role. The throughput of a bus, in terms of its electrical characteristics, is greatly underutilized and memory components themselves can respond at a far greater speed than that imposed by the bus read-write cycle.
- ![[Screenshot 2026-03-11 at 6.35.12 AM.png]]
	- (a) Data transfer without direct memory access controller
	- Parts
		- Data Read
		- Data Write
		- Memory
		- CPU
		- I/O
- DMA attempts to circumvent this bottleneck by allowing data transfer directly between a predetermined peripheral device and memory, without the direct intervention of the CPU during the transfer (Fig. b). It requires the use of special circuits $\textendash$ the DMA controller $\textendash$ that can force the CPU to relinquish its role as bus master and can then control the bus to permit a much higher data transfer rate.
- ![[Screenshot 2026-03-11 at 6.36.58 AM.png]]
	- (b) Data transfer with DMA controller
	- Parts
		- Command
		- CPU
		- I/O
		- DMAC
		- Data transfer
		- Memory
- The DMAC is directly connected to the I/O device and controls its activity; the DMAC provides all the signals, using the control bus, that the memory device requires to carry out memory read-write activities, but at the speed dictated by the DMAC rather than the CPU read-write cycles. When the transfer is from I/O device to memory, the I/O device places data on the data bus under the control of the DMAC; the memory reads from the data bus without modification of its normal control signals. For transfer to I/O device from memory, the memory writes to the data bus without modification of its normal control signals; the I/O device reads data from the data bus under the control of the DMAC. In general, when the DMAC is not commanded to carry out DMA activities, normal programmed data-transfer activity proceeds unimpeded between the two components. The DMAC is connected to the system address, data, and control bus like any other peripheral device, and contains internal registers that the CPU can read from and write to.
- There are two common forms of DMA transfer. In cycle stealing mode, the DMAC returns control of the bus to the CPU after a single data transfer. In burst mode, the DMAC retains control of the bus until it has completed its transfer, without any intervening CPU cycles.
- DMA controllers are embedded within many specialized peripheral equipment controllers, such as disk drives.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]