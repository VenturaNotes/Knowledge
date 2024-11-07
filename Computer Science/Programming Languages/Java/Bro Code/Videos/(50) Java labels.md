[Video](https://youtube.com/watch?v=FR2UptJyaSM)

```java
// You might want to add frame.setVisible(true) to be the very last line. 
// Sometimes with Mac, the components won't appear until you resize the window
import java.awt.Color;
import java.awt.Font;
import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.border.Border;

public class Main {

	public static void main(String[] args) {

		// JLabel = a GUI display area for a string of text, an image, or both
		
		ImageIcon image = new ImageIcon("dude.png");
		Border border = BorderFactory.createLineBorder(Color.green,3);

		//Puts image icon and text
		// Looking at our label with Java's swing graphical user interface,
		//it likes to take a string of text and put it on righthand side of image
		// when creating a label. You can move the text around relative to the image

		//image and text likes to be in the center vertically and to the left horizontally
		

		//You could also pass in text like this when
		// creating the instance variable
		//JLabel label = new JLabel("Bro, do you even code?"); //create a label
		JLabel label = new JLabel(); //create a label
		label.setText("bro, do you even code?"); //set text of label
		label.setIcon(image);

		//Thhe horizontal and vertical helps move text relative to the image icon
		//There is JLabel.LEFT or JLabel.RIGHT
		//JLabel.Center will overlap the image
		label.setHorizontalTextPosition(JLabel.CENTER); //set text LEFT,CENTER, RIGHT of imageicon
		label.setVerticalTextPosition(JLabel.TOP); //set text TOP,CENTER, BOTTOM of imageicon
		label.setForeground(new Color(0x00FF00)); //set font color of text
		label.setFont(new Font("MV Boli",Font.PLAIN,100)); //set font of text

		//A negative number will set text closer to image
		label.setIconTextGap(-25); //set gap of text to image

		//You need SetBacground and setOpaque methods to show background
		label.setBackground(Color.black); //set background color
		label.setOpaque(true); //display background color

		//adds a green border around the window
		label.setBorder(border); //sets border of label (not image+text)
		label.setVerticalAlignment(JLabel.CENTER); //set vertical position of icon+text within label
		label.setHorizontalAlignment(JLabel.CENTER); //set horizontal position of icon+text within label

		//This will always stay in the same place when resizing the frame
		//label.setBounds(100, 100, 250, 250); //set x,y position within frame as well as dimensions
			
		JFrame frame = new JFrame();
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

		//This is the default size of the frame
		//frame.setSize(500,500);

		//The layout manager is usally border layout xdd
		//frame.setLayout(null);
		frame.setVisible(true);	 

		//Make sure to add all components first, and then you can pack
		frame.add(label);

		//Pack method will resize the size of the frame to accommodate all of the components we have
		frame.pack();
	}
}
```

- ![[Screenshot 2023-08-07 at 6.16.19 AM.png]]
	- Output