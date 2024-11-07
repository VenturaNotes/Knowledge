[Video](https://youtube.com/watch?v=Rn16ugyorX0)

```java
public class Main {

	public static void main(String[] args) {
		
		// for loop = executes a block of code a limited amount of times

		/*
		 * 3 separate statements of for loop 
		 * 1. Declare counter or index
		 * 2. Create a condition
		 * 3. Incerment or decrement our index
		 */
		
		//i stands for index
		//Can do i-=2 to decrement by 2 per iteration
		for(int i=10; i>=0; i--) {
			System.out.println(i);
		}

		//Alternative method
		for(int i=10; i>=0;) {
			System.out.println(i);
			i-=2;
		}

		System.out.println("Happy new year!");
		
	}
}
```

- Output
```
10
9
8
7
6
5
4
3
2
1
0
10
8
6
4
2
0
Happy new year!
```
- [[Java]] for loop