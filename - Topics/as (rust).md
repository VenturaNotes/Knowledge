---
aliases:
  - as
---
## Synthesis
- A keyword used for explicit type casting which allows you to convert a value from one type to another
	- #question what is meant by explicit type casting?
- Great for working with different numerical types or when interfacing with low-level code where specific types are required
	- #question what is meant by interfacing?

### Common Use Cases for "as"
- (1) [[Casting (rust)|casting]] between numeric Types
	- #question what is meant by casting?
	- Converting an integer type ([[u32]]) to another integer type ([[u8]])
		- #question what is an [[integer type (rust)|integer type]]? 
		- #question what are all the integer types in rust?
	- Converting an integer to a [[floating-point type (rust)|floating-point type]] or vice-versa
- (2) Casting Pointers
	- Converting a [[reference (rust)|reference]] (`&T`) to a [[raw pointer (rust)|raw pointer]] (`*const T` or `*mut T`)
		- #question what does [[const (rust)|const]] mean?
		- #question What does & and \* mean?
	- #question how can we cast pointers?
	- Converting between raw pointers and integer types ([[usize (rust)|usize]])
- (3) Casting Between [[Enums (rust)|enums]] and [[Integers (rust)|integers]]
	- Could convert an enum variant to its underlying integer value or vice versa
		- #question How would this work?
#### Examples
(1) Casting Between Numeric Types
```Rust
fn main() {
	let x: u32 = 42
	let y: u8 = x as u8; //Explicitly cast u32 to u8

	println!("x: {}, y: {}", x, y);
}
```

Standard Output
```
x: 42, y: 42
```
- the `as` keyword casts the [[u32]] value `42` to [[u8]]. It's safe because `42` fits within the range of `u8` (0 to 255)
	- #comment If I were to pass in 256, from `u32`, the `u8` value would output 0. 
(2) Casting between Pointers
```rust
fn main() {
    let x: i32 = 10;
    let x_ptr: *const i32 = &x as *const i32; // Cast reference to a raw pointer

    unsafe {
        println!("Value of x via pointer: {}", *x_ptr);
    }
}

```
Standard Output
```
Value of x via pointer: 10
```
- #question I don't understand how references and raw pointers work
- #question Why is an `unsafe` block needed when using a raw pointer?

(3) Casting Between Enums and Integers
```rust
#[repr(u8)]
enum MyEnum {
    A = 1,
    B = 2,
    C = 3,
}

fn main() {
    let a = MyEnum::A as u8; // Cast enum variant to its underlying integer value

    println!("Value of MyEnum::A: {}", a);
}

```
Standard Output
```
Value of MyEnum::A: 1
```
#question Why is `[repr(u8)]` required at the beginning?
#question What is the formatting called when you use `{}` for having an empty space?
#question How does [[println (rust)|println]] work?
#question do I need to do `MyEnum::A` to retrieve the inherent value of an enum?

#### Important Notes
- [[Lossy Conversion]]: Casting a value from a larger type to a smaller type may lose data if the value exceeds the range of the smaller type
	- For example: `u32 to u8`
- `as` does not check for [[overflows]]. There are no runtime checks for overflow or underflow conversion. It simply truncates or converts the value as specified
	- #question what kind of runtime checks are there
	- #question I need an example of an overflow
#### Conclusion
- Undefined behavior may occur with `as` if misused 
	- #question what kind of undefined behavior could occur?
## Source[^1]
- 
## References

[^1]: 