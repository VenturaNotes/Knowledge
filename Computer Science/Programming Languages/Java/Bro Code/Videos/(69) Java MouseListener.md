---
Source:
  - https://youtube.com/watch?v=jptf1Wd_omw
Reviewed: false
---
```java
import java.awt.Color;
import java.awt.event.*;
import javax.swing.*;

public class Main{

	public static void main(String[] args) {
			
		new MyFrame();
	}
}

class MyFrame extends JFrame implements MouseListener{

	JLabel label;

	//ImageIcon smile;
	//ImageIcon nervous;
	//ImageIcon pain;
	//ImageIcon dizzy;
	
	MyFrame(){		
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setSize(500,500);
		this.setLayout(null);	

		//This will have frame appear in middle of computer screen
		//this.setLocationRelativeTo(null);
		
		label = new JLabel();
		//Creates size of label at top-left corner
		label.setBounds(0, 0, 100, 100);
		label.setBackground(Color.red);
		label.setOpaque(true);
		//Because the mouseListener wass added to the label component
		//any activity recorded will only happen within the label
		//If we added it to the frame, then entering the frame with the
		//mouse will change the color
		label.addMouseListener(this);

		//smile = new ImageIcon("smile.png");
		//nervous = new ImageIcon("nervous.png");
		//pain = new ImageIcon("pain.png");
		//dizzy = new ImageIcon("dizzy.png");
		//label.setIcon(smile);
		
		this.add(label);
		this.setVisible(true);
	}

	@Override
	public void mouseClicked(MouseEvent e) {
		// Invoked when the mouse button has been clicked (pressed and released) on a component
		//System.out.println("You clicked the mouse");
	}

	@Override
	public void mousePressed(MouseEvent e) {
		// Invoked when a mouse button has been pressed on a component
			// This is when you hold down the mouse button
			//Applies to the center and right mouse buttons too
		System.out.println("You pressed the mouse");
		label.setBackground(Color.yellow);
		// label.setIcon(pain);

	}

	@Override
	public void mouseReleased(MouseEvent e) {
		// Invoked when a mouse button has been released on a component
		System.out.println("You released the mouse");
		label.setBackground(Color.green);
		// label.setIcon(dizzy);

	}

	@Override
	public void mouseEntered(MouseEvent e) {
		// Invoked when the mouse enters a component
		System.out.println("You entered the component");
		label.setBackground(Color.blue);
		// label.setIcon(nervous);

	}

	@Override
	public void mouseExited(MouseEvent e) {
		// Invoked when the mouse exits a component
		System.out.println("You exited the component");
		label.setBackground(Color.red);
		// label.setIcon(smile);

	}

}
```

>[!Output]
>![[Screenshot 2022-11-21 at 5.49.01 PM.png|300]]

Can also replace the label with an image
"Command + /" automatically comments lines out