---
aliases:
  - internationalization
  - i18n
---
## Synthesis
- 
## Source [^1]
- Process of designing and developing software applications that can be easily adapted to support multiple languages, regions, and cultural conventions. 
- Make applications accessible and usable by users from diverse linguistic and cultural backgrounds without requiring significant code changes or modifications.
### Key Aspects
- Text Translation
- Date and time formatting
- Number and Currency Formatting
- [[Locale]] Management
	- #question what is the meaning of locale?
- Character encoding

### Examples
- The libraries below can be used individually or in combination. They offer various levels of support for internationalization and localization
	- [[gettext (python)|gettext]]
	- [[babel (python)|babel]]
	- [[pytz (python)|pytz]]
	- [[polib (python)|polib]]
	- [[iso639 (python)|iso639]]
### Practical Example
- Use the `gettext` library. We will demonstrate how to se up your application to support multiple languages

## Source[^2] (Translating to Multiple Languages)
### (1) Write demo.py 
```python
# Import gettext module
import gettext

# Asks user what language they speak
locale = input("Please enter the preferred locale (en, fr, lv):")

# Set the local directory
appname = 'lokalise'
localedir = './locales'

# Set up Gettext
translations = gettext.translation(appname, localedir, fallback=True, languages=[locale.strip()])

# Create the "magic" function
translations.install()

# Translating messages below
print(_("Hello World"))
print(_("Learn Python i18n"))
```

### (2) Set up Directory
![[Screenshot 2024-06-12 at 1.16.44 AM.png|200]]

### (3) Write snippet in terminal
```
xgettext -d base -o locales/lokalise.pot demo.py
```
- A `lokalise.pot` file will be created
### (4) lokalise.pot
- Copy each `.pot` file to `/LC_MESSAGES` with the `.po` extension
- In each `.po` file:
```
Change Language header to: "Language: {language abbreviation here}\n"
Change Content-Type header to: "Content-Type: text/plain; charset=UTF-8\n"
```
- Fill in the `msgstr` for each language
- Result
	- ![[Screenshot 2024-06-12 at 1.29.05 AM.png]]
### (5) Generate MO files
#question What is a MO file?
```
#Paste each line below in terminal
msgfmt -o locales/fr/LC_MESSAGES/lokalise.mo locales/fr/LC_MESSAGES/lokalise.po
msgfmt -o locales/en/LC_MESSAGES/lokalise.mo locales/en/LC_MESSAGES/lokalise.po
msgfmt -o locales/lv/LC_MESSAGES/lokalise.mo locales/lv/LC_MESSAGES/lokalise.po
```

### (6) Running demo.py
```
Please enter the preferred locale (en, fr, lv):en
Hello and welcome to this tutorial on Lokalise!
In this article you'll learn how to use Python i18n
```

## Source[^3]
- The reason it is called `i18n` is because there are 18 letters between the first `i` and final `n` in internationalization
## References

[^1]: ChatGPT
[^2]: https://lokalise.com/blog/beginners-guide-to-python-i18n/
[^3]: https://locize.com/blog/what-is-i18n/#:~:text=The%20number%2018%20stands%20for,quicker%20and%20more%20efficient%20writing.


