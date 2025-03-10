## Synthesis
- 
## Source [^1]
- The process by which one station on a multidrop line (the primary station) addresses another station (a secondary station), giving the secondary station access to the communication channel. The secondary station is then able to send status information and/or data to the primary. The primary station resumes control of the line and may send data of its own or poll another station.
- Polling is a form of time division multiplexing. The precise polling strategy used depends upon the application. In roll-call polling the primary station addresses each secondary station in turn. Some stations may be addressed more often than others if their response-time requirements or traffic loads are heavier. Hub polling is used to minimize line turnaround delays on half duplex multidrop lines. The primary station polls the station at the opposite end of the line, which transmits any data it has and polls the next closest station. This process is repeated until control reaches the primary station again. Since data is flowing in one direction only, from the outermost nodes toward the primary station, the only turnaround delays occur when the primary station wishes to transmit.
- Polling is not suitable for situations where the response delay time is fairly large, as is the case in satellite transmission systems.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]