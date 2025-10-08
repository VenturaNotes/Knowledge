## Synthesis
- Creates a progress bar for loops that use `range().`
- Comes from the `tqdm` library which is widely used to display progress bars
	- Great for long loops or computations.
### Tutorial
#### Installation
- `pip3 install tqdm` in terminal
	- #question What exactly is pip?
#### Example
```python
from tqdm import trange
from time import sleep

for i in trange(10):
    sleep(0.3)  # Simulate work
```
#### Explanation
- A progress bar appears in your terminal
- It updates each time the loop iterates
#### Output in Terminal (when finished loading)
```
100%|█████████████████████████████████████████████████████████████████████████████████| 10/10 [00:03<00:00,  3.27it/s]
```
- #question Does the left side tell you the number of seconds passed and the right side the estimated time remaining?
- #question What does it/s mean? Is it like loops per second? 

## Source [^1]
- 
## References

[^1]: 