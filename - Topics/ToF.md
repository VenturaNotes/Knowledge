---
aliases:
  - Time-of-Flight
---
## Synthesis
- 
## Source [^1]
[[(Assignment 4) (2024-05-07) Mozart Paper Review|Mozart Paper Review]]
- Refers to a specific technology used in depth cameras to measure the distance to objects in a scene
- Cameras emit infrared light pulses and then measuring the time it takes for the light to travel to the object and back to the sensor.
- Steps
	1. **Emission:** The ToF camera emits a pulse of infrared light.
	2. **Reflection:** The light travels to the object and reflects back towards the camera.
	3. **Reception:** The camera's sensor receives the reflected light pulse.
	4. **Time Calculation:** The camera measures the time difference between the emitted and received light pulses. This time difference is directly proportional to the distance the light traveled.
	5. **Depth Calculation:** Using the known speed of light, the camera calculates the distance to the object based on the measured time-of-flight.
- The ToF camera generates a depth map, which represents the distance of each point in the scene from the camera
## References

[^1]: Gemini