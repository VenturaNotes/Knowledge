---
Source:
  - https://youtube.com/watch?v=G0mFJUFMzjs
---
```java
public class Main {

	public static void main(String[] args) {
		
		String x = "water";
		String y = "Kool-Aid";
		String temp;
		
        //Think of the water glass example (though not completely accurate)
		temp = x;
		x=y;
		y=temp;
		
		System.out.println("x: "+x);
		System.out.println("y: "+y);
	}
}
```

- Output
```
x: Kool-Aid
y: water
```