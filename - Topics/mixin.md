---
aliases:
  - mixins
---
## Synthesis
- Small classes meant to be added to another class via [[multiple inheritance]], to extend behavior
	- #question What is meant by "small classes". What exactly defines a small class? 
- Not standalone - no [[Instantiate|instantiation]].
```python
class LogMixin:
    def log(self, msg):
        print(msg)

class Service(LogMixin):
    pass
```
- #question I don't understand. How is the above a `mixin`? What does mixin even mean? How is the small class adding to another class to extend behavior? 
- Summary
	- Reusable behaviors added via inheritance
		- #question Which class has the behaviors added to?
## Source [^1]
- 
## References

[^1]: 