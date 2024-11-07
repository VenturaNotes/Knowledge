---
aliases:
  - gettext
---
## Synthesis
- 
## Source [^1]
- A built-in module that provides internationalization and [[localization (python)|localization]] support for your python applications using [[GNU]] gettext message catalogs
	- #question What is localization?
	- #question What is meant by GNU gettext message catalogs? 

```python
import gettext
gettext.bindtextdomain('myapp', 'locale')
gettext.textdomain('myapp')
_ = gettext.gettext

print(_("Hello, World!"))

```
- #question I don't understand this code
## References

[^1]: ChatGPT