---
Source:
  - https://youtube.com/watch?v=rWCnZKF-U3Q
Reviewed: false
---
```java
/*
 * 
 * GUI is an acronym for graphical user interface
 * A visual program that we can see and interact with.
 * 
 */

 // Working with JOptionPane class
import javax.swing.JOptionPane;

public class Main {

	public static void main(String[] args) {
		
        
        //text asking for name
		String name = JOptionPane.showInputDialog("Enter your name");

        //text for displaying name
		JOptionPane.showMessageDialog(null, "Hello "+name);
		
        //Uses the integer wrapper class
        // Will return a string based on what the user types in
        // And then it will be parse a string argument returning an int
		int age = Integer.parseInt(JOptionPane.showInputDialog("Enter your age"));
		JOptionPane.showMessageDialog(null, "You are "+age+" years old");
		
		double height = Double.parseDouble(JOptionPane.showInputDialog("Enter your height"));
		JOptionPane.showMessageDialog(null, "You are "+height+" cm tall");
	}	
}
```

- ![[Screenshot 2023-08-07 at 3.37.22 AM.png]]
	- Output