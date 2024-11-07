[Video](https://youtube.com/watch?v=tHNWIWxRDDA)

```java
import java.awt.*;
import javax.swing.*;
import java.awt.event.*;

//------------------------------------------------
public class Main{

	public static void main(String[] args) {
			
		new MyFrame();
		
	}
}

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
//------------------------------------------------

class MyPanel extends JPanel implements ActionListener{

	final int PANEL_WIDTH = 500;
	final int PANEL_HEIGHT = 500;
	Image enemy;
	Image backgroundImage;
	Timer timer;
	int xVelocity = 1;
	int yVelocity = 1;
	int x = 0;
	int y = 0;
	
	MyPanel(){
		this.setPreferredSize(new Dimension(PANEL_WIDTH,PANEL_HEIGHT));
		this.setBackground(Color.black);
		enemy = new ImageIcon("enemy.png").getImage();	
		backgroundImage = new ImageIcon("space.png").getImage();
		timer = new Timer(10, this);
		timer.start();
	}

	public void paint(Graphics g) {
		
		super.paint(g); // paint background
		
		Graphics2D g2D = (Graphics2D) g;
		
		g2D.drawImage(backgroundImage, 0, 0, null);

		//It measures where the enemy is located
		//in the top left corner
		g2D.drawImage(enemy, x, y, null);
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		
		//Flips the object back and forth
		if(x>=PANEL_WIDTH-enemy.getWidth(null) || x<0) {
			xVelocity = xVelocity * -1;
		}
		x = x + xVelocity;
		
		//Flips the object up and down
		if(y>=PANEL_HEIGHT-enemy.getHeight(null) || y<0) {
			yVelocity = yVelocity * -1;
		}
		y = y + yVelocity;
		repaint();
	}
}
//------------------------------------------------
```


>[!Output]
>![[Screenshot 2022-11-22 at 8.12.03 AM.png|300]]

Spaceship moving around in background