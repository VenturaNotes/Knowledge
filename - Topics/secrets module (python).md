## Synthesis

### Choosing a Random number
```python
import secrets

lst = [1, 2, 3, 4]

# This is the closest to true randomness you'll get in python
choice = secrets.choice(lst)

```

## Source [^1]
- Used for generating cryptographically strong random numbers suitable for managing data such as passwords, account authentication, security tokens, and related secrets
	- #question What is an example of a security token? 
## References

[^1]: https://docs.python.org/3/library/secrets.html