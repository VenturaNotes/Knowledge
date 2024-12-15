---
Source:
  - https://youtube.com/watch?v=Hr8tLlj32BQ
---
```java
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class Main {

	public static void main(String[] args) {
		
		// FileReader = read the contents of a file as a stream of characters. One by one
		//				read() returns an int value which contains the byte value
		//				when read() returns -1, there is no more data to be read
		
		try {
			//This is considered dangerous code so need a try/catch block for reader
			FileReader reader = new FileReader("art.txt");
			int data = reader.read();
			while(data != -1) {
				System.out.print((char)data);
				//reads the next character
				data = reader.read();
			}
			reader.close();
			
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
```

Output (Reads a file called "art.txt")
```
Roses are red 
Violets are blue 
Booty booty booty booty 
Rockin' everywhere!
(A poem by Bro)%   
```