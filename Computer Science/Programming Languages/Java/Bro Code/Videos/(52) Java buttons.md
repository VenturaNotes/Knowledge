[Video](https://youtube.com/watch?v=-IMys4PCkIA)

```java
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

public class Main{

	public static void main(String[] args) {

		// JButton = a button that performs an action when clicked on
			
		new MyFrame();

	}
}

class MyFrame extends JFrame implements ActionListener{

	//A feature available with buttons is that you can change components
	//within a frame on a button click
	JButton button;
	JLabel label;
	
	MyFrame(){
		
		ImageIcon icon = new ImageIcon("point.png");
		ImageIcon icon2 = new ImageIcon("face.png");
		
		label = new JLabel();
		label.setIcon(icon2);
		label.setBounds(150, 250, 150, 150);
		label.setVisible(false);
		
		button = new JButton();
		button.setBounds(100, 100, 250, 100);
		//This is required for the button to do something
		button.addActionListener(this);
		//You could also write a lambda expression which would remove need
		//for implementing ActionListener and actionPerformed function
		//button.addActionListener(e -> System.out.println("poo"));

		button.setText("I'm a button!");
		
		//removes the box surrounding the button
		button.setFocusable(false);
		button.setIcon(icon);
		button.setHorizontalTextPosition(JButton.CENTER);
		button.setVerticalTextPosition(JButton.BOTTOM);
		button.setFont(new Font("Comic Sans",Font.BOLD,25));
		//Makes the icon and text closer if negative
		button.setIconTextGap(-15);
		//Changes text color
		button.setForeground(Color.cyan);
		//changes backrgound color
		button.setBackground(Color.lightGray);
		button.setBorder(BorderFactory.createEtchedBorder());
		
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setLayout(null);
		this.setSize(500,500);
		this.setVisible(true);
		this.add(button);
		this.add(label);
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		if(e.getSource()==button) {

			//This makes it so you can only press the button once
			System.out.println("poo");
			button.setEnabled(false);
			//It then makes the label visible
			label.setVisible(true);
		}	
	}
}
```

- ![[Screenshot 2023-08-07 at 6.18.48 AM.png|400]]
	- Output
	- Console also prints out `poo`