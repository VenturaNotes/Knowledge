---
Source:
  - https://www.youtube.com/watch?v=pii3hAksya0
tags:
  - type/video
  - status/incomplete
Reviewed: false
---
```python
class Language:
    def say_hello(self):
        print("Plase use say_hello class in child class")

class French(Language):
    def say_hello(self):
        print("Salut")

class Chinese(Language):
    def say_hello(self):
        print("NiHao")

class Spanish(Language):
    pass

def intro(lang):
    lang.say_hello()

test1 = Spanish()
test2 = French()
test3 = Chinese()

intro(test1)
intro(test2)
intro(test3)

""" Output
Plase use say_hello class in child class
Salut
NiHao
"""
```
- Example of polymorphism and inheritance
	- Polymorphism is being used with the `intro(lang)` method so that as long as a function has the `say_hello()` method, it'll work. Inheritance is used here where the classes `Chinese` and `French` make an "is a" relationship with the `Language` class. So if a Language does not have a `say_hello` method, then the superclass `Language` will give the default "Please use say_hello class in child class"