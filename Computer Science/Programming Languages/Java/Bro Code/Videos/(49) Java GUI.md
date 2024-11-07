[Video](https://youtube.com/watch?v=7GaAW-DdPuI)

Mac does not support frame icons [^1]
```java
import java.awt.Color;
import javax.swing.ImageIcon;
import javax.swing.JFrame;

//This is part of java swing tutorial series
//Learn how to create simple JFrame, and add components to it
public class Main {

 public static void main(String[] args) {

	/* 

  // JFrame = a GUI window to add components to
  
  //2 different ways to create frame
  //First is to create instance of a frame and give it a name
  //Then you can change all members and properties of frame by 
  //saying name of frame(dot) whatever change you want to make 

  //The second way is to make a jframe as a parent class to a child class
  JFrame frame = new JFrame(); //creates a frame
  frame.setTitle("JFrame title goes here"); //sets title of frame
  //HIDE_ON_CLOSE is default which doesn't actually close application
  //DO_NOTHING_ON_CLOSE prevents someone from actually closing the application
  frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); //exit from application
  //Can no longer make it full screen either
  frame.setResizable(false); //prevent frame from being resized
  frame.setSize(420,420); //sets the x-dimension, and y-dimension of frame
  frame.setVisible(true); //make frame visible
  
  ImageIcon image = new ImageIcon("logo.png"); //create an ImageIcon
  //Mac does not support frame icons
  frame.setIconImage(image.getImage()); //change icon of frame
  //You could do Color.green as well
  //You need to use java.awt.Color;
  //You can put rgb values or some hexadecimal values
  //Color(0,0,0) is black and Color(255,255,255) is white
  //First value is amount of red, second value is green, and last is blue
  //This is on a range from 0 to 255
  //Color(0x000000) is black and Color(0xFFFFFF) is white
  //Those are hexadecimal color values
  frame.getContentPane().setBackground(new Color(0x123456)); //change color of background
    
  */

  //One method using second class
  //MyFrame myFrame = new MyFrame();

  //For an even simpler solution
  //If you don't plan on using name for MyFrame
  //works but can't make changes to class
  new MyFrame();
 }
}

class MyFrame extends JFrame{

	//constructor
	MyFrame(){
		this.setTitle("JFrame title goes here");
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setResizable(false);
		this.setSize(420,420);
		this.setVisible(true);

		ImageIcon image = new ImageIcon("logo.png");
		this.setIconImage(image.getImage());
		this.getContentPane().setBackground(new Color(123,50,250));

	}
}
```

- ![[Screenshot 2023-08-07 at 6.15.20 AM.png|300]]
	- Output



## References

[^1]: https://stackoverflow.com/questions/23378119/setimageicon-doesnt-set-jframe-icon-on-mac-swing-window