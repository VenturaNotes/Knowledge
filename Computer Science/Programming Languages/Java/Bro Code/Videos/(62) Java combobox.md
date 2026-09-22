---
Source:
  - https://youtube.com/watch?v=EAxV_eoYrIg
---
```java
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

public class Main{

	public static void main(String[] args) {
	
	 // JComboBox = A component that combines a button or editable field and a drop-down list
	 
	 new MyFrame();
   
	}
   }
   //***********************************************
   
class MyFrame extends JFrame implements ActionListener{
   
	//JComboBox is a row type. Refercences to generic type JComboBox<E> should be parameterized
	//The error above is what we get if we leave the declaration as "JComboBox comboBox;"
	JComboBox<String> comboBox;
	
	MyFrame(){
	 this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	 this.setLayout(new FlowLayout()); 
	 
	 //Must use wrapper class if storing primitive data type
	 String[] animals = {"dog","cat","bird"};
	 
	 //Need to parameterize it
	 comboBox = new JComboBox<String>(animals);
	 comboBox.addActionListener(this);
	 

	 //You could make the text editable as well to get what you're looking for
	 //comboBox.setEditable(true);

	 //Prints current amout of items
	 //System.out.println(comboBox.getItemCount());

	 //adds elements to list of ComboBox
	 //comboBox.addItem("horse");
	 //comboBox.insertItemAt("pig", 0);

	 //Shows what element in list you want to start add
	 //comboBox.setSelectedIndex(0);
	 
	 //It lets us remove the item we want
	 //comboBox.removeItem("cat");

	 //Whatever item at index 0 removes it
	 //comboBox.removeItemAt(0);

	 //Removes all items
	 //Helps us reset it
	 //comboBox.removeAllItems();
	 
	 this.add(comboBox);
	 this.pack();
	 this.setVisible(true);
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
	 if(e.getSource()==comboBox) {
	  System.out.println(comboBox.getSelectedItem());
	  
	  //Returns the index of what we select. Starts at 0
	  //System.out.println(comboBox.getSelectedIndex());
	 }
	}
   }
```

>[!Output]
>![[Screenshot 2022-11-21 at 9.02.20 AM.png|200]]