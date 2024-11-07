---
aliases:
  - function
---
## Synthesis
- 
## Source [^1]

### Example
```rust
#[test]
fn test_gcd() {
	assert_eq!(gcd(14, 15), 1);

	assert_eq!(gcd(2*3*5*11*17,3*7*11*13*19), 3*11);
}
```
- The `#[test]` defines the function `test_gcd` as a [[test function (rust)|test function]]. During normal compilations, this function will be skipped but is included and called automatically if we run our program with the [[cargo]] `test` command

## References

[^1]: [[Home Page - Programming Rust 2nd Edition by O'Reilly#2 3 Writing and Running Unit Tests]]