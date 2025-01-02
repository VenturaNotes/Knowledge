---
Source:
  - https://youtube.com/watch?v=7nEal9SJ6oI
Reviewed: false
---
```java
import java.awt.FlowLayout;
import java.awt.event.*;
import javax.swing.*;

public class Main{

	public static void main(String[] args) {
	
		new MyFrame();
	}
}

class MyFrame extends JFrame implements ActionListener{

	JMenuBar menuBar;
	JMenu fileMenu;
	JMenu editMenu;
	JMenu helpMenu;
	JMenuItem loadItem;
	JMenuItem saveItem;
	JMenuItem exitItem;
	//ImageIcon loadIcon;
	ImageIcon saveIcon;
	//ImageIcon exitIcon;
	
	MyFrame(){		
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		this.setSize(500,500);
		this.setLayout(new FlowLayout());
		
		//loadIcon = new ImageIcon("load.png");
		saveIcon = new ImageIcon("save.png");
		//exitIcon = new ImageIcon("exit.png");
		
		menuBar = new JMenuBar();
		

		//Gives the menu items
		fileMenu = new JMenu("File");
		editMenu = new JMenu("Edit");
		helpMenu = new JMenu("Help");
		
		loadItem = new JMenuItem("Load");
		saveItem = new JMenuItem("Save");
		exitItem = new JMenuItem("Exit");
		
		loadItem.addActionListener(this);
		saveItem.addActionListener(this);
		exitItem.addActionListener(this);
		
		//loadItem.setIcon(loadIcon);
		saveItem.setIcon(saveIcon);
		//exitItem.setIcon(exitIcon);
		
		//Creates keyboard short cuts
		//Holding option works on mac, but unable to actually select menu with keys
		fileMenu.setMnemonic(KeyEvent.VK_F); // Alt + f for file
		editMenu.setMnemonic(KeyEvent.VK_E); // Alt + e for edit
		helpMenu.setMnemonic(KeyEvent.VK_H); // Alt + h for help

		//Works for mac
		//You need to see the items for the shortcuts to work
		loadItem.setMnemonic(KeyEvent.VK_L); // l for load
		saveItem.setMnemonic(KeyEvent.VK_S); // s for save
		exitItem.setMnemonic(KeyEvent.VK_E); // e for exit
		
		//adds items to filemenu
		fileMenu.add(loadItem);
		fileMenu.add(saveItem);
		fileMenu.add(exitItem);
		
		menuBar.add(fileMenu);
		menuBar.add(editMenu);
		menuBar.add(helpMenu);
		
		this.setJMenuBar(menuBar);
		
		this.setVisible(true);
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		
		if(e.getSource()==loadItem) {
			System.out.println("*beep boop* you loaded a file");
		}
		if(e.getSource()==saveItem) {
			System.out.println("*beep boop* you saved a file");
		}
		if(e.getSource()==exitItem) {
			System.exit(0);
		}
	}
}
```

>[!Output]
>![[Screenshot 2022-11-21 at 10.22.38 AM.png|400]]