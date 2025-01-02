---
Source:
  - https://youtube.com/watch?v=JEI-fcfnFkc
Reviewed: false
---
```java
import java.awt.*;
import javax.swing.*;

public class Main{ 
	
	// progress bar = Visual aid to let the user know that an operation is processing
  
    public static void main(String[] args) 
    { 

		//It's difficult to change the color of the progress bar on macOS
		//but this will at least change the text color.
		UIManager.put("ProgressBar.background", Color.BLACK);
		UIManager.put("ProgressBar.foreground", Color.RED);
		UIManager.put("ProgressBar.selectionBackground", Color.BLACK);
		UIManager.put("ProgressBar.selectionForeground", Color.RED);

    	new ProgressBarDemo();
        
    } 
  
} 

class ProgressBarDemo {
	

	JFrame frame = new JFrame();
	JProgressBar bar = new JProgressBar(0,100);

	
	ProgressBarDemo(){

		
		bar.setValue(0);
		bar.setBounds(0,0,420,50);
		//Adds percentage to progress bar
		bar.setStringPainted(true);
		bar.setFont(new Font("MV Boli",Font.BOLD,25));
		
		//These don't appear to work on mac
		bar.setForeground(Color.RED);
		bar.setBackground(Color.black);
			
		frame.add(bar);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setSize(420, 420);
		frame.setLayout(null);
		frame.setVisible(true);
		
		fill();
	}
	
	public void fill() {
		int counter =0;
		
		while(counter<=100) {
			
			bar.setValue(counter);
			try {
				//Thread.sleep(1000) will pause the program for 1 second
				//for each iteration of the loop
				Thread.sleep(50);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			//Would go up by 1% every second if thread.sleep(1000)
			counter +=1;
		}
		bar.setString("Done! :)");
	}
}
```

>[!Output]
>![[Screenshot 2022-11-21 at 10.07.14 AM.png|400]]