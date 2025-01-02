---
Source:
  - https://youtube.com/watch?v=MwYRVKfb2M0
Reviewed: false
---
```java
import java.io.File;

public class Main {

 public static void main(String[] args) {
  
  // file = An abstract representation of file and directory pathnames
  
  //to list the full file path on windows, right click on txt file,
  //go to properties, and copy location. You could use / for file location as well
  //if your file within project folder, you only need file name
  //if your file is any place else, you need to list the file path
  File file = new File("secret_message.txt");
  
  if(file.exists()) {
   System.out.println("That file exists! :O!");
   //This is whatever is listed within constructor of file class
   System.out.println(file.getPath());
   System.out.println(file.getAbsolutePath());
   //can determine if it's a file or folder
   System.out.println(file.isFile());
   //deletes file
   file.delete();
  }
  else {
   System.out.println("That file doesn't exist :(");
  }  
 }
}
```

Output
```
That file exists! :O!
secret_message.txt
/Users/julianventura/Desktop/VSCode/Java/src/secret_message.txt
true
```