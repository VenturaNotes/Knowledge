---
Source:
  - https://youtube.com/watch?v=A6sA9KItwpY
Reviewed: false
---
```java
import java.awt.FlowLayout;
import java.awt.event.*;
import java.io.File;
import javax.swing.*;

public class Main{

	public static void main(String[] args) {
	
		// JFileChooser = A GUI mechanism that let's a user choose a file (helpful for opening or saving files)
		
		new MyFrame();
	}
}

class MyFrame extends JFrame implements ActionListener{

	JButton button;
	
	MyFrame(){		
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setLayout(new FlowLayout());
		
		//declared outside of constructor
		button = new JButton("Select File");
		button.addActionListener(this);
		
		this.add(button);
		this.pack();
		this.setVisible(true);
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		
		if(e.getSource()==button) {
			
			JFileChooser fileChooser = new JFileChooser();
			

			//sets current directory to project folder
			fileChooser.setCurrentDirectory(new File(".")); 

			//Sets default opening folder
			//fileChooser.setCurrentDirectory(new File("C:\\Users\\Cakow\\Desktop"));
			
			//It returs 0 if you select a file and 1 if you cancel
			int response = fileChooser.showOpenDialog(null); //select file to open
			//int response = fileChooser.showSaveDialog(null); //select file to save
			
			//0 typically means false and 1 is true in java

			//Could check if response equals 0 as well
			if(response == JFileChooser.APPROVE_OPTION) {
				File file = new File(fileChooser.getSelectedFile().getAbsolutePath());

				//Outputs the location of the file
				System.out.println(file);
			}
		}
	}
}
```

>[!Output]
>![[Screenshot 2022-11-21 at 10.33.00 AM.png|400]]