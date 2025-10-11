---
aliases:
  - polib
---
## Synthesis
- A library to parse and handle gettext files (PO, MO)
	- #question what is (PO, MO)
	- #question What kind of files are gettext?
```python
import polib

po = polib.pofile('locale/fr_FR/LC_MESSAGES/myapp.po')
for entry in po:
    print(entry.msgid, '->', entry.msgstr)

```
#question I don't understand the code
## Source [^1]
- 
## References

[^1]: 