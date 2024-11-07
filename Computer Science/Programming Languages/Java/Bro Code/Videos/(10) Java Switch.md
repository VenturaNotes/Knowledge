[Video](https://youtube.com/watch?v=Om3qzMoaIUo)

```java
public class Main {

	public static void main(String[] args) {
		
		// switch = statement that allows a variable to be tested for equality against a list of values
		
        // We are compaing variable to the cases
		String day = "Friday";
		
		switch(day) {
			case "Sunday": System.out.println("It is Sunday!");
            //breaks are important because otherwise each case afterwards would run
			break;
			case "Monday": System.out.println("It is Monday!");
			break;
			case "Tuesday": System.out.println("It is Tuesday!");
			break;
			case "Wednesday": System.out.println("It is Wednesday!");
			break;
			case "Thursday": System.out.println("It is Thursday!");
			break;
			case "Friday": System.out.println("It is Friday!");
			break;
			case "Saturday": System.out.println("It is Saturday!");
			break;
			default: System.out.println("That is not a day!");
		}
				
	}
}
```

- Output
```
It is Friday!
```


[[Switch]]:
- Unlike if-then and if-then-else statements, the switch statement can have a number of possible execution paths. A switch works with the byte, short, char and int primitive data types. It also works with enumerated types (discussed in Enum Types), the String class, and a few special classes that wrap certain primitive types: Character, Byte, Short, and Integer (discussed in Numbers and Strings)

