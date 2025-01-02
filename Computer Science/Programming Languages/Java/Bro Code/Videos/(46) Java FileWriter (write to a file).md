---
Source:
  - https://youtube.com/watch?v=kjzmaJPoaNc
Reviewed: false
---
```java
import java.io.FileWriter;
import java.io.IOException;

public class Main {

	public static void main(String[] args) {
		
		try {
			FileWriter writer = new FileWriter("poem.txt");
			//overwrites what you have currently
			writer.write("Roses are red \nViolets are blue \nBooty booty booty booty \nRockin' everywhere!");
			//Adds text to end of file
			writer.append("\n(A poem by Bro)");
			writer.close();
		} 
		catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
```

Output (Created a poem.txt file with the following text)
```
Roses are red 
Violets are blue 
Booty booty booty booty 
Rockin' everywhere!
(A poem by Bro)
```