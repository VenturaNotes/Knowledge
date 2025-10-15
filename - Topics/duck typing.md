## Synthesis
- Python doesn't have formal interfaces like Java or C#
	- #question What is an interface?
- Instead, python uses duck typing: "If it walks like a duck and quacks like a duck..."
	- #question What does duck typing mean? Is the above sentence finished? 
```python
class FileLike:
    def read(self): ...
    def write(self): ...

# Any class with read/write methods can be used like FileLike
```
- #question What is meant by "any class with read/write methods can be used like FileLike"? Does this mean another class can also have read/write methods or does that mean another class can use the read/write methods from FileLike? 
- Summary
	- Behavior-based compatibility
		- #question What does duck typing have to do with protocols? 
## Source [^1]
- 
## References

[^1]: 