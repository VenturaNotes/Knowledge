---
aliases:
  - f-string
---
## Synthesis
- 
## Source[^1]
### Description
- F-string introduced in Python 3.6
	- Needed to use the `format()` method before
- Allows you to format selected parts of a string
- When formatting an f-string, add placeholders {}
	- A placeholder can contain variables, operations, functions, and modifiers to format the value

### Examples

### (1) Placeholder for Variable
Input
```python
price = 59
txt = f"The price is {price} dollars"
print(txt)
```

Output
```python
The price is 59 dollars
```


### (2) Placeholder Modifying a Variable
Input
```python
price = 59
txt = f"The price is {price:.2f} dollars"
print(txt)
```

Output
```
The price is 59.00 dollars
```
- The `.2f` means a [[fixed point number]] with 2 decimals

### (3) Modify Value Directly
Input
```python
txt = f"The price is {95:.2f} dollars"  
print(txt)
```

Output
```
The price is 95.00 dollars
```
### (4) Perform Operations
Input
```python
price = 59  
tax = 0.25  
txt = f"The price is {price + (price * tax)} dollars"  
print(txt)
```

Output
```
The price is 73.75 dollars
```

### (5) Logical Statements
Input
```python
price = 49
txt = f"It is very {'Expensive' if price>50 else 'Cheap'}"
print(txt)
```

Output
```
It is very Cheap
```

### (6) Built-in or Personal Functions
Input
```python
fruit = "apples"
txt = f"I love {fruit.upper()}"
print(txt)
```

Output
```
I love APPLES
```

### (7)More Modifiers

#### (a) Comma Separators (:,)
Input
```python
price = 5900000
txt = f"The price is {price:,} dollars"
print(txt)
```

```
The price is 5,900,000 dollars
```

#### (b) Left-align Text (:<)
Input
```python
align = 30

text = f"'{'The':<{align}}'"
text2 = f"'{'The World':<{align}}'"
text3 = f"'{'The World is':<{align}}'"
text4 = f"'{'The World is going':<{align}}'"
text5 = f"'{'The World is going to':<{align}}'"
text6 = f"'{'The World is going to rise':<{align}}'"

print(text)
print(text2)
print(text3)
print(text4)
print(text5)
print(text6)
```

Output
```
'The                           '
'The World                     '
'The World is                  '
'The World is going            '
'The World is going to         '
'The World is going to rise    '
```
- This will left-align all the text so anything after will be lined up properly
	- Align should be larger than the longest line of text

#### (c) Right-align Text (:>)
Input
```python
align = 30

text = f"'{'The':>{align}}'"
text2 = f"'{'The World':>{align}}'"
text3 = f"'{'The World is':>{align}}'"
text4 = f"'{'The World is going':>{align}}'"
text5 = f"'{'The World is going to':>{align}}'"
text6 = f"'{'The World is going to rise':>{align}}'"

print(text)
print(text2)
print(text3)
print(text4)
print(text5)
print(text6)
```

Output
```
'                           The'
'                     The World'
'                  The World is'
'            The World is going'
'         The World is going to'
'    The World is going to rise'
```
#### (d) Center-align Text (:^)
Input
```python
# Using f-strings to left-align text
align = 30

text = f"'{'The':^{align}}'"
text2 = f"'{'The World':^{align}}'"
text3 = f"'{'The World is':^{align}}'"
text4 = f"'{'The World is going':^{align}}'"
text5 = f"'{'The World is going to':^{align}}'"
text6 = f"'{'The World is going to rise':^{align}}'"

print(text)
print(text2)
print(text3)
print(text4)
print(text5)
print(text6)
``` 

Output:
```
'             The              '
'          The World           '
'         The World is         '
'      The World is going      '
'    The World is going to     '
'  The World is going to rise  '
```

#### (e) Alignment operator (:=)
Input
```python

```

## References
[^1]: https://www.w3schools.com/python/python_string_formatting.asp