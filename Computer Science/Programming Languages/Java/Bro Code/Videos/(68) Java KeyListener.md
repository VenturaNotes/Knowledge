[Video](https://youtube.com/watch?v=BJ7fr9XwS2o)

```java
import java.awt.Color;
import java.awt.event.*;
import javax.swing.*;

public class Main{

	public static void main(String[] args) {
			
		new MyFrame();
	}
}

class MyFrame extends JFrame implements KeyListener{

	
	JLabel label;
	ImageIcon icon;
	
	MyFrame(){		
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setSize(500,500);

		//Important since we'll be moving components with keystrokes
		this.setLayout(null);
		this.addKeyListener(this);
		
		icon = new ImageIcon("rocket.png");
		
		label = new JLabel();
		label.setBounds(0, 0, 100, 100);
		label.setIcon(icon);
		//Creates a red label that can be moved
		//Need opaque so that it will actually be painted red
		//label.setBackground(Color.red);
		//label.setOpaque(true);
		//Sets background to black
		this.getContentPane().setBackground(Color.black);
		this.add(label);
		this.setVisible(true);
	}

	@Override
	public void keyTyped(KeyEvent e) {
		//keyTyped = Invoked when a key is typed. Uses KeyChar, char output
		//The Dvorak keyboard keys are also mapped, but not in the WASD arrangement as QWERTY is
		switch(e.getKeyChar()) {
			case 'a': label.setLocation(label.getX()-10, label.getY());
				break;
			case 'w': label.setLocation(label.getX(), label.getY()-10);
				break;
			case 's': label.setLocation(label.getX(), label.getY()+10);
				break;
			case 'd': label.setLocation(label.getX()+10, label.getY());
				break;
		}
		
	}

	@Override
	public void keyPressed(KeyEvent e) {
		//keyPressed = Invoked when a physical key is pressed down. Uses KeyCode, int output

		//e.getKeyChar(); will return the key released (case-sensitive)
		//e.getKeyCode(); returns the button number
		//shift doesn't produce any key characters (?) but it does produce a key code (16)

		//The numbers give the directional arrow keys
		switch(e.getKeyCode()) {
		case 37: label.setLocation(label.getX()-10, label.getY());
			break;
		case 38: label.setLocation(label.getX(), label.getY()-10);
			break;
		case 39: label.setLocation(label.getX()+10, label.getY());
			break;
		case 40: label.setLocation(label.getX(), label.getY()+10);
			break;
	}
	}

	@Override
	public void keyReleased(KeyEvent e) {
		//keyReleased = called whenever a button is released
		System.out.println("You released key char: " + e.getKeyChar());
		System.out.println("You released key code: " + e.getKeyCode());
	}
}
```

>[!Output]
>![[Screenshot 2022-11-21 at 5.08.57 PM.png|300]]

You can move the rocket around by pressing the directional arrows.