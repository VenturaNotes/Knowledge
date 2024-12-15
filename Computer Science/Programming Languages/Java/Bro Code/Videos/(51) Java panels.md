---
Source:
  - https://youtube.com/watch?v=dvzAuq-YDpM
---
Notes:
- label.setIcon(...); is supposed to automatically do revalidate() and repaint() for you, but I needed to manually add it for JPanel greenPanel. Then it worked [^1]
```java
import java.awt.BorderLayout;
import java.awt.Color;
import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class Main {

	public static void main(String[] args) {

		// JPanel = a GUI component that functions as a container to hold other components
	
		ImageIcon icon = new ImageIcon("thumbsup.png");


		//The panels use a FlowLayout Manager
		//with components that you add to a container that's using a flowlayout manager
		//will take all these components, stick them to the top, and center them. Will also add 
		//components until first row is filled. Then the second row will have components added to it

		//We'll just set the layout for our panel to a BorderLayout 
		
		JLabel label = new JLabel();
		label.setText("Hi");
		label.setIcon(icon);

		//Can move label around in the container using the below methods
		//No layout manager let's us set the coordinates manually
		//You use this for BorderLayout
		label.setVerticalAlignment(JLabel.TOP);
		label.setHorizontalAlignment(JLabel.LEFT);

		//We use the below command to set the coordinates manually within a panel
		//The panel must have a .setLayout(null) for this to work
		//First 2 coordinates give position, and last 2 coordinates gives size
		//label.setBounds(100, 100, 75, 75);
		
		JPanel redPanel = new JPanel();
		redPanel.setBackground(Color.red);
		//.setBounds is the topleft corner of the frame
		redPanel.setBounds(0, 0, 250, 250);

		//Places any components to the center vertically, and to the left horizontally
		redPanel.setLayout(new BorderLayout());

		//Only do this when you want to set label coordinates manually
		//redPanel.setLayout(null);
		
		JPanel bluePanel = new JPanel();
		bluePanel.setBackground(Color.blue);
		bluePanel.setBounds(250, 0, 250, 250);
		bluePanel.setLayout(new BorderLayout());
		
		JPanel greenPanel = new JPanel();
		greenPanel.setBackground(Color.green);
		greenPanel.setBounds(0, 250, 500, 250);
		greenPanel.setLayout(new BorderLayout());
		
		JFrame frame = new JFrame();
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setLayout(null);
		frame.setSize(750,750);
		frame.setVisible(true);	
		greenPanel.add(label);
		frame.add(redPanel);
		frame.add(bluePanel);
		frame.add(greenPanel);

		/*
		 * //You can either do this for frame or greenPanel. Both will work
		 * greenPanel.revalidate();
		 * greenPanel.repaint();
		 * 
		 */

		frame.revalidate();
		frame.repaint();
	}
}
```


- ![[Screenshot 2023-08-07 at 6.17.38 AM.png|400]]
	- Output

## References

[^1]: https://stackoverflow.com/questions/26455633/java-adding-image-to-jpanel-why-is-the-image-not-showing