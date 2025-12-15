## Synthesis
- `casefold()` is more aggressive than `lower()` in converting characters to a common case, especially for certain Unicode characters that have multiple case mappings.
	- #question What are some Unicode characters with multiple case mappings?
### Example
```python
s1 = "Straße" # German word for "street"
s2 = "ẞ"      # German Eszett (sharp S) in uppercase

print(f"lower() of 'Straße': {s1.lower()}")
print(f"casefold() of 'Straße': {s1.casefold()}")

print(f"lower() of 'ẞ': {s2.lower()}")
print(f"casefold() of 'ẞ': {s2.casefold()}")
```

```Output
lower() of 'Straße': straße
casefold() of 'Straße': strasse

lower() of 'ẞ': ẞ
casefold() of 'ẞ': ss
```
- #question Is it important that ẞ is considered a double s?
- 

## Source [^1]
- 
## References

[^1]: