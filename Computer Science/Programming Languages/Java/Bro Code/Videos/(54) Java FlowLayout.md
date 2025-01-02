---
Source:
  - https://youtube.com/watch?v=pDqjHozkMBs
Reviewed: false
---
```java
import java.awt.FlowLayout;
import java.awt.Dimension;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import java.awt.Color;

public class Main{

	public static void main(String[] args) {

		// Layout Manager = Defines the natural layout for components within a container
		
		// FlowLayout = 	places components in a row, sized at their preferred size. 
		//					If the horizontal space in the container is too small,
		//					the FlowLayout class uses the next available row.
		
		JFrame frame = new JFrame();
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setSize(500, 500);
		//The default is CENTER
		//LEADING will keep it to the left
		//TRAILING sticks to the righthand side
		//First number is horizontal spacing and second number is vertical spacing
		frame.setLayout(new FlowLayout(FlowLayout.CENTER,0,0));

		//You can also use the FlowLayout in JPanel
		//and the layout will change based on the dimensions you give it
		JPanel panel = new JPanel();
		panel.setPreferredSize(new Dimension(250,250));
		panel.setBackground(Color.lightGray);
		panel.setLayout(new FlowLayout());

		panel.add(new JButton("1"));
		panel.add(new JButton("2"));
		panel.add(new JButton("3"));
		panel.add(new JButton("4"));
		panel.add(new JButton("5"));
		panel.add(new JButton("6"));
		panel.add(new JButton("7"));
		panel.add(new JButton("8"));
		panel.add(new JButton("9"));
		
		
		frame.add(new JButton("1"));
		frame.add(new JButton("2"));
		frame.add(new JButton("3"));
		frame.add(new JButton("4"));
		frame.add(new JButton("5"));
		frame.add(new JButton("6"));
		frame.add(new JButton("7"));
		frame.add(new JButton("8"));
		frame.add(new JButton("9"));
		
		frame.add(panel);
		frame.setVisible(true);
	}
}
```

- ![[Screenshot 2023-08-07 at 6.20.17 AM.png|400]]
	- Output