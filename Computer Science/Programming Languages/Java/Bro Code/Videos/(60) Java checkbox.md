---
Source:
  - https://youtube.com/watch?v=GwxvLzQoMYM
Reviewed: false
---
``` java
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JFrame;

//***********************************
public class Main{

	public static void main(String[] args) {
	
		// JCheckBox = A GUI component that can be selected or deselected
		
		new MyFrame();

	}
}
//***********************************

class MyFrame extends JFrame implements ActionListener{

	JButton button;
	JCheckBox checkBox;
	ImageIcon xIcon;
	ImageIcon checkIcon;
	
	MyFrame(){
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setLayout(new FlowLayout());
		
		xIcon = new ImageIcon("X.png");
		checkIcon = new ImageIcon("checkmark.png");
		
		button = new JButton();
		button.setText("submit");
		button.addActionListener(this);
		
		checkBox = new JCheckBox();
		checkBox.setText("I'm not a robot");

		//Gets rid of annoying box around button
		checkBox.setFocusable(false);
		checkBox.setFont(new Font("Consolas",Font.PLAIN,35));

		//You can use an image to change the checkbox appearance
		//checkBox.setIcon(xIcon);
		//checkBox.setSelectedIcon(checkIcon);
		
		this.add(button);
		this.add(checkBox);
		this.pack();
		this.setVisible(true);
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		if(e.getSource()==button) {
			System.out.println(checkBox.isSelected());
		}
	}
}
```

>[!Output]
>![[Screenshot 2022-11-21 at 8.33.12 AM.png|400]]