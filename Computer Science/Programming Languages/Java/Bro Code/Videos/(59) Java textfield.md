---
Source:
  - https://youtube.com/watch?v=dyDDUndlMnU
---
```java
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JTextField;

// *******************************************************
public class Main{

	public static void main(String[] args) {

		
		// JTextField = A GUI textbox component that can be used to add, set, or get text

		new MyFrame();
	}
}
// *******************************************************


class MyFrame extends JFrame implements ActionListener{

	JButton button;
	JTextField textField;
	
	MyFrame(){
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setLayout(new FlowLayout());
		
		button = new JButton("Submit");
		//Since class is implementing an ActionListener interface
		//we can simply pass in "this"
		button.addActionListener(this);
		
		textField = new JTextField();
		textField.setPreferredSize(new Dimension(250,40));
		textField.setFont(new Font("Consolas",Font.PLAIN,35));
		textField.setForeground(new Color(0x00FF00));
		textField.setBackground(Color.black);

		//This makes it so you can't edit the text anymore
		//textField.setEditable(false);

		//Blinking line is called caret
		textField.setCaretColor(Color.white);
		textField.setText("username");
		
		
		this.add(button);
		this.add(textField);
		//Size of frame will adjust based on components you add
		this.pack();
		this.setVisible(true);
	}
	@Override
	public void actionPerformed(ActionEvent e) {
		if(e.getSource()==button) {
			System.out.println("Welcome "+ textField.getText());

			//Disables text field as well as button after using it
			button.setEnabled(false);
			textField.setEditable(false);
		}
		
	}
}
// *******************************************************
```

>[!Output]
>![[Screenshot 2022-11-21 at 8.19.15 AM.png|400]]
>