---
aliases:
  - re
---
## Synthesis
- Module provides support for [[regular expressions]] (regex).
	- #question What are regular expressions?
	- #question Is regex short for regular expressions?
- When you use the `re` module, you provide a regex pattern and a string to search within. The module then attempts to find occurrences of that pattern in the string.
	- #question What does this look like?
	- #question What is a regex pattern
	- #question What does the string look like?
	- #question Does it need to be a string? 
### Basic Regex Syntax

#### `.` (Matches any single character except newline)

#### `*` (Matches zero or more occurrences of the preceding character/group)

#### `+` (Matches one or more occurrences of the preceding character/group.)

#### `?` (Matches zero or one occurrence of the preceding character/group.)

#### `\d` (Matches any digit (0-9).)

#### `\w` (Matches any word character (alphanumeric + underscore))
#### `\s` (Matches any whitespace character.)

#### `[abc]`(Matches any one of the characters 'a', 'b', or 'c'.)

#### `[^abc]`(Matches any character _except_ 'a', 'b', or 'c'.)

#### `^` (Matches the beginning of the string.)

#### `$`(Matches the end of the string)


#### Organize

```python
import re

# . : Matches any single character (except newline).
text = "cat, cot, cut, c@t"
matches = re.findall(r"c.t", text)
print(f"'.': {matches}")
# Output: ['.': ['cat', 'cot', 'cut', 'c@t']]

# * : Matches zero or more occurrences of the preceding character/group.
text = "caat, ct, caaaat, cbt"
matches = re.findall(r"ca*t", text)
print(f"'*': {matches}")
# Output: ['*': ['caat', 'ct', 'caaaat']]

# + : Matches one or more occurrences of the preceding character/group.
text = "caat, ct, caaaat, cbt"
matches = re.findall(r"ca+t", text)
print(f"'+': {matches}")
# Output: ['+': ['caat', 'caaaat']]

# ? : Matches zero or one occurrence of the preceding character/group.
text = "color, colour, colr"
matches = re.findall(r"colou?r", text)
print(f"'?': {matches}")
# Output: ['?': ['color', 'colour', 'colr']]

# \d : Matches any digit (0-9).
text = "The year is 2023, not 1999."
matches = re.findall(r"\d+", text) # \d+ matches one or more digits
print(f"'\\d': {matches}")
# Output: ['\\d': ['2023', '1999']]

# \w : Matches any word character (alphanumeric + underscore).
text = "Hello_world 123! How are you?"
matches = re.findall(r"\w+", text) # \w+ matches one or more word characters
print(f"'\\w': {matches}")
# Output: ['\\w': ['Hello_world', '123', 'How', 'are', 'you']]

# \s : Matches any whitespace character.
text = "This has   multiple spaces\tand a tab."
matches = re.findall(r"\s", text)
print(f"'\\s': {matches}")
# Output: ['\\s': [' ', ' ', ' ', ' ', '\t', ' ']]

# [abc] : Matches any one of the characters 'a', 'b', or 'c'.
text = "apple, banana, cherry, date"
matches = re.findall(r"[abc]", text)
print(f"'[abc]': {matches}")
# Output: ['[abc]': ['a', 'b', 'a', 'n', 'a', 'n', 'a', 'c', 'e', 'r', 'r', 'y']]

# [^abc] : Matches any character _except_ 'a', 'b', or 'c'.
text = "apple, banana, cherry"
matches = re.findall(r"[^abc]", text)
print(f"'[^abc]': {matches}")
# Output: ['[^abc]': ['p', 'l', 'e', ',', ' ', 'n', 'n', ',', ' ', 'h', 'e', 'r', 'r', 'y']]

# ^ : Matches the beginning of the string.
text1 = "Hello world"
text2 = "world Hello"
match1 = re.search(r"^Hello", text1)
match2 = re.search(r"^world", text2)
print(f"'^' (text1): {match1.group() if match1 else 'No match'}")
print(f"'^' (text2): {match2.group() if match2 else 'No match'}")
# Output:
# '^' (text1): Hello
# '^' (text2): world

# $ : Matches the end of the string.
text1 = "Hello world"
text2 = "world Hello"
match1 = re.search(r"world$", text1)
match2 = re.search(r"Hello$", text2)
print(f"'$' (text1): {match1.group() if match1 else 'No match'}")
print(f"'$' (text2): {match2.group() if match2 else 'No match'}")
# Output:
# '$' (text1): world
# '$' (text2): Hello
```

## Organize

### Common `re` Module Methods

Here are some of the most frequently used methods in the `re` module:

1. **`re.search(pattern, string, flags=0)`**
    
    - **What it does:** Scans through `string` looking for the first location where the `pattern` produces a match.
    - **Returns:** A match object if a match is found, `None` otherwise. The match object contains information about the match, such as the matched string, its start and end positions.
    
    ```python
    import re
    
    text = "The quick brown fox jumps over the lazy dog."
    match = re.search(r"fox", text)
    
    if match:
        print(f"Found '{match.group()}' at position {match.start()} to {match.end()}")
    # Output: Found 'fox' at position 16 to 19
    ```
    
2. **`re.match(pattern, string, flags=0)`**
    
    - **What it does:** Attempts to match the `pattern` only at the _beginning_ of the `string`.
    - **Returns:** A match object if the pattern matches at the beginning of the string, `None` otherwise.
    
    ```python
    import re
    
    text = "Hello world"
    match1 = re.match(r"Hello", text)
    match2 = re.match(r"world", text)
    
    if match1:
        print(f"Match at start: {match1.group()}") # Output: Match at start: Hello
    if match2:
        print(f"Match at start: {match2.group()}")
    else:
        print("No match for 'world' at the beginning.") # Output: No match for 'world' at the beginning.
    ```
    
3. **`re.findall(pattern, string, flags=0)`**
    
    - **What it does:** Finds _all_ non-overlapping matches of `pattern` in `string` and returns them as a list of strings.
    - **Returns:** A list of strings containing all matches. If no matches are found, it returns an empty list.
    
    ```python
    import re
    
    text = "The price is $10.99 and another item is $5.50."
    prices = re.findall(r"\$\d+\.\d+", text)
    print(prices)
    # Output: ['$10.99', '$5.50']
    ```
    
4. **`re.finditer(pattern, string, flags=0)`**
    
    - **What it does:** Similar to `findall`, but returns an _iterator_ yielding match objects for all non-overlapping matches. This is more memory-efficient for large strings or many matches.
    - **Returns:** An iterator of match objects.
    
    ```python
    import re
    
    text = "apple banana cherry apple"
    for match in re.finditer(r"apple", text):
        print(f"Found '{match.group()}' at position {match.start()}")
    # Output:
    # Found 'apple' at position 0
    # Found 'apple' at position 20
    ```
    
5. **`re.sub(pattern, repl, string, count=0, flags=0)`**
    
    - **What it does:** Replaces occurrences of `pattern` in `string` with `repl`.
    - **Returns:** The modified string. `count` specifies the maximum number of pattern occurrences to replace.
    
    ```python
    import re
    
    text = "My phone number is 123-456-7890."
    new_text = re.sub(r"\d{3}-\d{3}-\d{4}", "[REDACTED]", text)
    print(new_text)
    # Output: My phone number is [REDACTED].
    
    text_multiple = "apple banana apple cherry"
    new_text_limited = re.sub(r"apple", "orange", text_multiple, count=1)
    print(new_text_limited)
    # Output: orange banana apple cherry
    ```
    
6. **`re.split(pattern, string, maxsplit=0, flags=0)`**
    
    - **What it does:** Splits the `string` by occurrences of `pattern`.
    - **Returns:** A list of strings resulting from the split. `maxsplit` specifies the maximum number of splits to perform.
    
    ```python
    import re
    
    text = "one, two; three. four"
    parts = re.split(r"[,;.]\s*", text) # Split by comma, semicolon, or period followed by optional space
    print(parts)
    # Output: ['one', 'two', 'three', 'four']
    ```
    
7. **`re.compile(pattern, flags=0)`**
    
    - **What it does:** Compiles a regular expression `pattern` into a regex object. This can improve performance when the same pattern is used multiple times, as it avoids recompiling the pattern repeatedly.
    - **Returns:** A regex object. Methods like `search`, `match`, `findall`, etc., can then be called directly on this compiled object.
    
    ```python
    import re
    
    compiled_pattern = re.compile(r"\bword\b") # \b for word boundary
    text1 = "This is a word."
    text2 = "Another_word_here."
    
    match1 = compiled_pattern.search(text1)
    match2 = compiled_pattern.search(text2)
    
    if match1:
        print(f"Found in text1: {match1.group()}") # Output: Found in text1: word
    if match2:
        print(f"Found in text2: {match2.group()}")
    else:
        print("No match in text2.") # Output: No match in text2.
    ```
    

These methods cover most common use cases for regular expressions in Python. The `re` module is incredibly versatile for text processing tasks.
## Source [^1]
- 
## References

[^1]: 