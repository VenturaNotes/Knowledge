---
Source:
  - https://youtube.com/watch?v=KcEvHq8Pqs0
Reviewed: false
---
```java
import javax.swing.*;
import java.awt.*;
import javax.swing.*;

// ---------------------------------------------
public class Main{

	public static void main(String[] args) {
	  
	 new MyFrame();
	 
	}
   }
   // ----------------------------------------------
   
class MyFrame extends JFrame{
	
	MyPanel panel;
	
	MyFrame(){
	 
	 panel = new MyPanel();
	 
	 this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	 
	 this.add(panel);
	 this.pack();
	 this.setLocationRelativeTo(null);
	 this.setVisible(true);
	}  
   }
   // ----------------------------------------------
   
class MyPanel extends JPanel{
   
	//Image image;
	
	MyPanel(){
	 
	 //This can be used to add an image to the picture
	 //image = new ImageIcon("sky.png").getImage();

	 //Sets a size to the panel
	 //makes entire panel visible to us
	 this.setPreferredSize(new Dimension(500,500));
	}
	
	//There is a bulit-in paint method that we're overriding
	//and takes graphics as an object
	//We do not need to explicitly invoke this paint method
	//Graphics is somewhat outdated. Better off using graphics 2d
	//graphics 2D is a child class or subclass of the graphcis class
	//Will cast Graphics g as 2D graphic
	public void paint(Graphics g) {
	 
	 //Casting Graphics2D
	 Graphics2D g2D = (Graphics2D) g;
	 
	 //last parameter is imageObserver
	 //drawing this first would make it the background image
	 //g2D.drawImage(image, 0, 0, null);
	 
	 //Makes the line blue
	 g2D.setPaint(Color.blue);
	 //Makes the line extra thick
	 g2D.setStroke(new BasicStroke(5));
	 //window bar overlaps graphics area that we can display
	 //That's why it's better for us to create a panel, draw on the panel
	 //and then add the panel to the frame
	 g2D.drawLine(0, 0, 500, 500);
	 
	 g2D.setPaint(Color.pink);
	 //Draws a rectangle or square
	 g2D.drawRect(0, 0, 100, 200);
	 //fills out the rectangle
	 g2D.fillRect(0, 0, 100, 200);

	 //Any new things drawn will overlap the 
	 //previous items or graphics already drawn
	 
	 g2D.setPaint(Color.orange);
	 //Draws an oval and circle
	 g2D.drawOval(0, 0, 100, 100);
	 g2D.fillOval(0, 0, 100, 100);
	 
	 //Trying to create a pokeball
	 g2D.setPaint(Color.red);
	 //This creates a half-circle
	 g2D.drawArc(0, 0, 100, 100, 0, 180);
	 g2D.fillArc(0, 0, 100, 100, 0, 180);
	 g2D.setPaint(Color.white);
	 g2D.fillArc(0, 0, 100, 100, 180, 180);
	 

	 //allows you to draw a polygon such as a triangle
	 int[] xPoints = {150,250,350};
	 int[] yPoints = {300,150,300};
	 g2D.setPaint(Color.yellow);
	 g2D.drawPolygon(xPoints, yPoints, 3);
	 g2D.fillPolygon(xPoints, yPoints, 3);
	 
	 //Writes text
	 g2D.setPaint(Color.magenta);
	 g2D.setFont(new Font("Ink Free",Font.BOLD,50));
	 //The starting position of string is bottom left corner.
	 g2D.drawString("U R A WINNER! :D", 50, 50);  
	}
   }
```

> [!Output]
> ![[Screenshot 2022-11-21 at 6.06.11 PM.png|300]]

Was able to draw all these shapes and text