---
Source:
  - https://youtube.com/watch?v=ohNqQagkDDY
Reviewed: false
---
```java
import java.awt.GridLayout;
import javax.swing.JButton;
import javax.swing.JFrame;

public class Main{

	public static void main(String[] args) {

		// Layout Manager = Defines the natural layout for components within a container
		
		// GridLayout = 	places components in a grid of cells. 
		//					Each component takes all the available space within its cell, 
		//					and each cell is the same size. 

		JFrame frame = new JFrame();
		//With frames by default, they use a BorderLayout manager
		// so the components like to take up as much room as possible
		// the 9 button is taking up the entire frame and all the other
		// buttons are hidden underneath
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setSize(500, 500);
		//The grid layout can show 3 rows and 3 columns
		//They would all be stacked vertically if you wrote new GridLayout(9,1)
		//They will then expand to fit the size of the frame, but all
		//of the components will always stay the same size as each other. 
		//A tic tac toe program would work perfectly for this grid layout
		//3rd argument is amount of pixel spacing between components horizontally
		//4th argument is amount of pixel spacing between components horizontally
		//If you tried creating a 3x3 but you had 10 buttons, then it would create
		//a 3x4 to try and create the components as evenly as possible
		frame.setLayout(new GridLayout(9,1,0,0));
		
		frame.add(new JButton("1"));
		frame.add(new JButton("2"));
		frame.add(new JButton("3"));
		frame.add(new JButton("4"));
		frame.add(new JButton("5"));
		frame.add(new JButton("6"));
		frame.add(new JButton("7"));
		frame.add(new JButton("8"));
		frame.add(new JButton("9"));

		
		frame.setVisible(true);

	}
}
```

- ![[Screenshot 2023-08-07 at 6.21.58 AM.png|400]]
	- Output