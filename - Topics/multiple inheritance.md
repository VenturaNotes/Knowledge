## Synthesis
- A class inherits from more than one parent class
## Source [^1]
- A class inherits from more than one parent class
- Can be powerful, but requires caution due to complexity (e.g., method resolution order - MRO)
	- #question what is method resolution order?
```python
class Flyer:
    def fly(self): pass

class Swimmer:
    def swim(self): pass

class Duck(Flyer, Swimmer):  # Multiple inheritance
    pass
```
- #question For `def fly(self): pass` why is `pass` on the same line as the definition of the method? 
- Summary
	- Inherits from multiple parent classes
## References

[^1]: ChatGPT