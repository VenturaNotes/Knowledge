## Synthesis
- Be careful of online python interpreters. Some may give different results, especially when they don't specify the python version
- `Programiz`[^1]
	- Here, the website gives an incorrect output. It should not be computing as the `is_integer` attribute should not exist within an `int` object. 
```python
test = 5

print(type(test))
print(test.is_integer())

""" Output
<class 'int'>
True
"""
```
- Online Python[^2]
	- Here, this properly gives an error since there is no attribute `is_integer` which exists within the `int` object. 
```python
test = 5

print(type(test))
print(test.is_integer())

""" Output
<class 'int'>
Traceback (most recent call last):
  File "main.py", line 4, in <module>
    print(test.is_integer())
AttributeError: 'int' object has no attribute 'is_integer'
```
## References

[^1]: https://www.programiz.com/python-programming/online-compiler/
[^2]: https://www.online-python.com/
