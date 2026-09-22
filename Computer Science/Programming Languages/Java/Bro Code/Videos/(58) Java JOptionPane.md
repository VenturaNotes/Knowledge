---
Source:
  - https://youtube.com/watch?v=BuW7y21FcYI
---
```java
import javax.swing.ImageIcon;
import javax.swing.JOptionPane;

public class Main{

	public static void main(String[] args) {
	
		//JOptionPane = pop up a standard dialog box that prompts users for a value 
		//				or informs them of something.
		
		/*
		 * There are 3 variations of JOptionPane.showMessageDialog()
		 * The 2nd one accepts 4 arguments. The "parentComponent, message, title, messageType"
		 * The message will appear within the dialog box
		 * JOptionPane.PLAIN_MESSAGE gives unstyled text
		 */

		//JOptionPane.showMessageDialog(null, "This is a message dialog box", "title", JOptionPane.PLAIN_MESSAGE);
		//JOptionPane.showMessageDialog(null, "Here is some useless info", "title", JOptionPane.INFORMATION_MESSAGE);
		//JOptionPane.showMessageDialog(null, "really?", "title", JOptionPane.QUESTION_MESSAGE);
		//JOptionPane.showMessageDialog(null, "Your computer has a VIRUS!", "title", JOptionPane.WARNING_MESSAGE);
		//JOptionPane.showMessageDialog(null, "CALL TECH SUPPORT OR ELSE!", "title", JOptionPane.ERROR_MESSAGE);
		
		
		//JOptionPane.YES_NO_CANCEL_OPTION gives 3 boxes of "Yes, No, Cancel" 
		//Yes returns 0, No returns 1, and Cancel returns 2 and "x" button is -1

		//int answer = JOptionPane.showConfirmDialog(null, "bro, do you even code?");

		//You can input your name here
		//String name = JOptionPane.showInputDialog("What is your name?: ");

		//adds image
		ImageIcon icon = new ImageIcon("smile.png");
		String[] responses = {"No, you are!","thank you!","*blush*"};
		int answer = JOptionPane.showOptionDialog(
				null,
				"You are the best! :D", 
				"Secret message", 
				JOptionPane.DEFAULT_OPTION, 
				0, 
				icon, 
				responses, 
				0);
		System.out.println(answer);

	}
}
```

>[!Code Output]
>
>![[Screenshot 2022-11-21 at 8.09.58 AM.png|400]]

messageType on Mac

JOptionPane.showMessageDialog(null, "This is a message dialog box", "title", JOptionPane.PLAIN_MESSAGE);
![[Screenshot 2022-11-21 at 7.53.29 AM.png|400]]

JOptionPane.showMessageDialog(null, "Here is some useless info", "title", JOptionPane.INFORMATION_MESSAGE);
![[Screenshot 2022-11-21 at 7.54.39 AM.png|400]]

JOptionPane.showMessageDialog(null, "really?", "title", JOptionPane.QUESTION_MESSAGE);
![[Screenshot 2022-11-21 at 7.59.12 AM.png|400]]

JOptionPane.showMessageDialog(null, "Your computer has a VIRUS!", "title", JOptionPane.WARNING_MESSAGE);
![[Screenshot 2022-11-21 at 7.59.18 AM.png|400]]

JOptionPane.showMessageDialog(null, "CALL TECH SUPPORT OR ELSE!", "title", JOptionPane.ERROR_MESSAGE);
![[Screenshot 2022-11-21 at 7.59.23 AM.png|400]]

