---
aliases:
  - interface
  - interfaces
---
## Synthesis
- It's a programming construct that defines a set of methods that must be implemented by classes that adhere to that interface
- Python does not have a native `interface` keyword such as [[Java]] but interfaces can be emulated using [[abstract base class (Python)|abstract base classes]] or through conventions
	- By "conventions", we mean that interfaces can be defined using naming conventions without explicitly using ABCs
		- This approach relies on adhering to common naming conventions to signal that certain methods or behaviors are expected in classes.
		- For example, if a class follows a convention where it has methods with specific names, other parts of the codebase can interact with instances of that class assuming they support those methods. 
			- This is a form of informal interface definition based on naming conventions

### Example
```python
class Printable:
    def display(self):
        raise NotImplementedError("display method not implemented")

class Document(Printable):
    def __init__(self, content):
        self.content = content

    def display(self):
        print(self.content)

class Image(Printable):
    def __init__(self, image_path):
        self.image_path = image_path

    def display(self):
        print(f"Displaying image from {self.image_path}")

# Using objects that adhere to the Printable "interface"
doc = Document("Hello, World!")
img = Image("/path/to/image.jpg")

doc.display()  # Output: Hello, World!
img.display()  # Output: Displaying image from /path/to/image.jpg
```
- [[raise (Python)|raise]] keyword 
## Source[^1]
- 
## References

[^1]: 