---
Source:
  - https://youtube.com/watch?v=bn2KdCLqHlg
---
```java
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;


public class Main{

	public static void main(String[] args) {
	
	 // JRadioButton = One or more buttons in a grouping in which only 1 may be selected per group
	 
	 new MyFrame();
   
	}
   }

class MyFrame extends JFrame implements ActionListener{
   
	//Need this to be a global variable to access it
	JRadioButton pizzaButton;
	JRadioButton hamburgerButton;
	JRadioButton hotdogButton;

	//The circles will be replaced with the image
	ImageIcon pizzaIcon;
	ImageIcon hamburgerIcon;
	ImageIcon hotdogIcon;
	
	MyFrame(){
	 this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	 this.setLayout(new FlowLayout());
	 
	 pizzaIcon = new ImageIcon("pizza.png");
	 //hamburgerIcon = new ImageIcon("hamburger.png");
	 //hotdogIcon = new ImageIcon("hotdog.png");
	 
	 pizzaButton = new JRadioButton("pizza");
	 hamburgerButton = new JRadioButton("hamburger");
	 hotdogButton = new JRadioButton("hotdog");
	 
	 //This ensures you can only click each button once
	 //When clicking a button, it actually triggers an event
	 ButtonGroup group = new ButtonGroup();
	 group.add(pizzaButton);
	 group.add(hamburgerButton);
	 group.add(hotdogButton);
	 
	 pizzaButton.addActionListener(this);
	 hamburgerButton.addActionListener(this);
	 hotdogButton.addActionListener(this);
	 
	 pizzaButton.setIcon(pizzaIcon);
	 //hamburgerButton.setIcon(hamburgerIcon);
	 //hotdogButton.setIcon(hotdogIcon);
	 
	 this.add(pizzaButton);
	 this.add(hamburgerButton);
	 this.add(hotdogButton);
	 this.pack();
	 this.setVisible(true);
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
	 if(e.getSource()==pizzaButton) {
	  System.out.println("You ordered pizza!");
	 }
	 else if(e.getSource()==hamburgerButton) {
	  System.out.println("You ordered a hamburger!");
	 }
	 else if(e.getSource()==hotdogButton) {
	  System.out.println("You ordered a hotdog!");
	 }
	}
   }
```

>[!Output]
>![[Screenshot 2022-11-21 at 8.45.08 AM.png|400]]