[Video](https://youtube.com/watch?v=HgkBvwgciB4)

```java

import java.awt.*;
import javax.swing.*;
import javax.swing.JFrame;
import javax.swing.JButton;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/*
 * Summary:
 * If you want to open a new window, you'll want to create an instance of
 * the class that contains the window that you want to appear. You'll then
 * want to hook this up to some sort of event to trigger it (button)
 * When clicking the button, it will perform the action performed method
 * and then create an instance of our new window class.
 * 
 */

public class Main {

	public static void main(String[] args) {
	 
	 LaunchPage launchPage = new LaunchPage();
   
	}
   }

class LaunchPage implements ActionListener{
	
	JFrame frame = new JFrame();
	JButton myButton = new JButton("New Window");
	
	LaunchPage(){
	 
	 myButton.setBounds(100,160,200,40);
	 //Hepls prevent buttons from being highlighted
	 myButton.setFocusable(false);
	 myButton.addActionListener(this);
	 
	 frame.add(myButton);
	 
	 frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	 frame.setSize(420,420);
	 frame.setLayout(null);
	 frame.setVisible(true);
	 
	}
   
	@Override
	public void actionPerformed(ActionEvent e) {
	 
	 if(e.getSource()==myButton) {
	  //This gets rid of the launchpage
	  frame.dispose();
	  //creates a new window
	  NewWindow myWindow = new NewWindow();
	 }
	}

   }

class NewWindow {
   
	JFrame frame = new JFrame();
	JLabel label = new JLabel("Hello!");
	
	NewWindow(){
	 
	 label.setBounds(0,0,100,50);
	 label.setFont(new Font(null,Font.PLAIN,25));
	 
	 frame.add(label);
	 
	 frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	 frame.setSize(420,420);
	 frame.setLayout(null);
	 frame.setVisible(true);
	}
   }
```

- ![[Screenshot 2023-08-07 at 6.25.33 AM.png]]
	- Output