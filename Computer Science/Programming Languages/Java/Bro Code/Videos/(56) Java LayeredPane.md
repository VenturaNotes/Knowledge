[Video](https://youtube.com/watch?v=CmK1nObLxiw)

```java
import javax.swing.*;
import java.awt.*;

public class Main {
	
  public static void main(String[] args) {
	  
	  // JLayeredPane = Swing container that provides a 
	  //				third dimension for positioning components
	  //				ex. depth, Z-index     

	  //Allows you to stack components on a GUI frame

	  //The first component that is added by default to the 
	  // JLayeredPane will appear on the top and so forth with
	  //that pattern

	  /*
	   * Summary:
	   * In JLayeredPane, you add components to a JLayeredPane, specify the
	   * layered number or by name, and then add the layeredPane to your
	   * frame or other container
	   */
	  
	  JLabel label1= new JLabel();
	  label1.setOpaque(true);
	  label1.setBackground(Color.RED);
	  label1.setBounds(50,50,200,200);
	  
	  JLabel label2= new JLabel();
	  label2.setOpaque(true);
	  label2.setBackground(Color.GREEN);
	  label2.setBounds(100,100,200,200);
	  
	  JLabel label3= new JLabel();
	  label3.setOpaque(true);
	  label3.setBackground(Color.BLUE);
	  label3.setBounds(150,150,200,200);
	  
	  JLayeredPane layeredPane = new JLayeredPane();
	  layeredPane.setBounds(0,0,500,500);

	  //The bottom layer is default layer. 
	  // This is the hierarchy from top to bottom:
	  //Drag, PopUp, Modal, Palette, Default
	  
	  //layeredPane.add(label1, JLayeredPane.DEFAULT_LAYER);

	  //Need to use wrapper class for Integer
	  layeredPane.add(label1, Integer.valueOf(0));
	  layeredPane.add(label2, Integer.valueOf(2));
	  layeredPane.add(label3, Integer.valueOf(1));
	   
      JFrame frame = new JFrame("JLayeredPane");
      frame.add(layeredPane);
      frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
      frame.setSize(new Dimension(500, 500));
      frame.setLayout(null);
      frame.setVisible(true);
  }

}
```

- ![[Screenshot 2023-08-07 at 6.22.41 AM.png|400]]
	- Output
