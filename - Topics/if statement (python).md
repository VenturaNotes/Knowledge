## Synthesis
### Multiline Conditional Statements
- For very long conditions in an `if` statement, you must use either parentheses `()` or a backslash `\` to make the condition itself span multiple physical lines
```python
a, b, c, d = 1, 2, 3, 4

# Example with \
if a == 1 and \
   b == 2 and \
   c == 3 and \
   d == 4: # Each backslash explicitly continues the line
    print("All conditions are true.")
    
# Unconventional example (indent or backslash placement does not matter)
if a == \
   1 \
and \
   b == 2 and \
   c == 3 and \
   d == 4: # Each backslash explicitly continues the line
    print("All conditions are true.")

# Example with ()
if (a == 1 and
    b == 2 and
    c == 3 and
    d == 4): # The condition is wrapped in parentheses
    print("All conditions are true.")
```
## Source [^1]
- 
## References

[^1]: 