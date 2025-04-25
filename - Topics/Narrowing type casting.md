---
aliases:
  - explicit type casting
  - narrowing conversion
---
## Synthesis
- 
## Source [^1]
- Narrowing type casting is also known as explicit type casting or narrowing conversion
- This occurs when you convert a value from a larger data type to a smaller data type.
	- In Java, narrowing conversions may lead to loss of data and therefore require explicit casting
		- #question Is there a difference between explicit type casting and explicit casting?

### Example
Code
```java
public class NarrowingExample {
    public static void main(String[] args) {
        double largeDouble = 1234.5678;
        int smallInt;

        // Narrowing conversion: double to int
        smallInt = (int) largeDouble;

        System.out.println("largeDouble: " + largeDouble);
        System.out.println("smallInt: " + smallInt);
    }
}
```
- We explicitly cast `largeDouble` to an `int` and assign it to `smallInt`. Since `int` cannot accommodate fractional values, the fractional part of `largeDouble` is truncated during the conversion. Therefore, a `double` to an `int` is a narrowing conversion

Output
```
largeDouble: 1234.5678
smallInt: 1234
```
## References

[^1]: https://www.geekster.in/articles/type-casting-java/#:~:text=Narrowing%20type%20casting%2C%20also%20known,to%20a%20smaller%20data%20type.