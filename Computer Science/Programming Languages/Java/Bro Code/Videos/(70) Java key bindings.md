---
Source:
  - https://youtube.com/watch?v=IyfB0u9g2x0
---
```java
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

//*************************************************
public class Main{
   
    public static void main(String[] args ){

    	// Key Bindings = 	bind an Action to a KeyStroke
    	//					don't require you to click a component to give it focus
    	//					all Swing components use Key Bindings
    	//					increased flexibility compared to KeyListeners
    	//					can assign key strokes to individual Swing components
    	//					more difficult to utilize and set up :(
    		
    	new Game();
    }
}
//*************************************************

class Game {

	JFrame frame;
	JLabel label;
	Action upAction;
	Action downAction;
	Action leftAction;
	Action rightAction;
	
	Game(){
	
		frame = new JFrame("KeyBinding Demo");
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setSize(420,420);
		frame.setLayout(null);
		
		label = new JLabel();
		label.setBackground(Color.red);
		label.setBounds(100, 100, 100, 100);
		label.setOpaque(true);
		
		upAction = new UpAction();
		downAction = new DownAction();
		leftAction = new LeftAction();
		rightAction = new RightAction();
		
		//Use "UP", "DOWN", "LEFT", and "RIGHT" for arrow keys
		label.getInputMap().put(KeyStroke.getKeyStroke('w'), "upAction");
		label.getActionMap().put("upAction", upAction);
		label.getInputMap().put(KeyStroke.getKeyStroke('s'), "downAction");
		label.getActionMap().put("downAction", downAction);
		label.getInputMap().put(KeyStroke.getKeyStroke('a'), "leftAction");
		label.getActionMap().put("leftAction", leftAction);
		label.getInputMap().put(KeyStroke.getKeyStroke('d'), "rightAction");
		label.getActionMap().put("rightAction", rightAction);
		
		frame.add(label);
		frame.setVisible(true);
	}
	
	//To move left we decrease x and to move right we increase x
	//To move up we decrease y and to move down we increase y
	public class UpAction extends AbstractAction{

		@Override
		public void actionPerformed(ActionEvent e) {
			label.setLocation(label.getX(), label.getY()-10);
		}		
	}
	public class DownAction extends AbstractAction{

		@Override
		public void actionPerformed(ActionEvent e) {
			label.setLocation(label.getX(), label.getY()+10);	
		}		
	}
	public class LeftAction extends AbstractAction{

		@Override
		public void actionPerformed(ActionEvent e) {
			label.setLocation(label.getX()-10, label.getY());	
		}		
	}
	public class RightAction extends AbstractAction{

		@Override
		public void actionPerformed(ActionEvent e) {
			label.setLocation(label.getX()+10, label.getY());
		}		
	}
}
//*************************************************
```

>[!Output]
>![[Screenshot 2022-11-21 at 5.59.29 PM.png|300]]

Able to move the red square with "W", "A", "S", and "D"