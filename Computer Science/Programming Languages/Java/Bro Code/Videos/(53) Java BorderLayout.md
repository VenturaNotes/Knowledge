---
Source:
  - https://youtube.com/watch?v=PD6pd6AMoOI
Reviewed: false
---
```java
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import javax.swing.JPanel;
import javax.swing.JFrame;

public class Main{

	public static void main(String[] args) {

		// Layout Manager = Defines the natural layout for components within a container
		
		// 3 common managers
		
		// BorderLayout = 	A BorderLayout places components in five areas: NORTH,SOUTH,WEST,EAST,CENTER. 
		//					All extra space is placed in the center area.

		JFrame frame = new JFrame();
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setSize(500, 500);
		//Creates 10 pixels of margin in all panels
		frame.setLayout(new BorderLayout(10,10));
		frame.setVisible(true);


		//with these panels, they can also act as a container with
		//their own layout manager. Uses something called FlowLayout manager
		//by default
		JPanel panel1 = new JPanel();
		JPanel panel2 = new JPanel();
		JPanel panel3 = new JPanel();
		JPanel panel4 = new JPanel();
		JPanel panel5 = new JPanel();
		
		panel1.setBackground(Color.red);
		panel2.setBackground(Color.green);
		panel3.setBackground(Color.yellow);
		panel4.setBackground(Color.magenta);
		panel5.setBackground(Color.blue);
		
		panel5.setLayout(new BorderLayout());
		
		///Will expand horizontally but not vertically
		panel1.setPreferredSize(new Dimension(100,100));
		panel2.setPreferredSize(new Dimension(150,100));
		//Will expand vertically but not horizontally
		panel3.setPreferredSize(new Dimension(150,100));
		panel4.setPreferredSize(new Dimension(100,100));
		//The center panel will expand proportionally to the size of the frame
		panel5.setPreferredSize(new Dimension(100,100));
		
		//------------- sub panels --------------------
		
		JPanel panel6 = new JPanel();
		JPanel panel7 = new JPanel();
		JPanel panel8 = new JPanel();
		JPanel panel9 = new JPanel();
		JPanel panel10 = new JPanel();
		
		panel6.setBackground(Color.black);
		panel7.setBackground(Color.darkGray);
		panel8.setBackground(Color.gray);
		panel9.setBackground(Color.lightGray);
		panel10.setBackground(Color.white);
		
		panel5.setLayout(new BorderLayout());
				
		panel6.setPreferredSize(new Dimension(50,50));
		panel7.setPreferredSize(new Dimension(50,50));
		panel8.setPreferredSize(new Dimension(50,50));
		panel9.setPreferredSize(new Dimension(50,50));
		panel10.setPreferredSize(new Dimension(50,50));
	

		///Will expand horizontally but not vertically
		panel5.add(panel6,BorderLayout.NORTH);
		panel5.add(panel7,BorderLayout.SOUTH);
		//Will expand vertically but not horizontally
		panel5.add(panel8,BorderLayout.WEST);
		panel5.add(panel9,BorderLayout.EAST);
		//The center panel will expand proportionally to the size of the frame
		panel5.add(panel10,BorderLayout.CENTER);
		
		//------------- sub panels --------------------
	
		frame.add(panel1,BorderLayout.NORTH);
		frame.add(panel2,BorderLayout.WEST);
		frame.add(panel3,BorderLayout.EAST);
		frame.add(panel4,BorderLayout.SOUTH);
		frame.add(panel5,BorderLayout.CENTER);

		//the below is required so we can see everything
		frame.revalidate();
		frame.repaint();
	}
}
```

- ![[Screenshot 2023-08-07 at 6.19.35 AM.png|400]]
	- Output