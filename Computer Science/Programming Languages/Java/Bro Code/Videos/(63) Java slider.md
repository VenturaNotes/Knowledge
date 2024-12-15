---
Source:
  - https://youtube.com/watch?v=-rJdMaSgt38
---
```java
import java.awt.*;
import javax.swing.*;
import javax.swing.event.*;

public class Main {

  
    public static void main(String[] args) 
    { 
    
    // JSlider =  GUI component that lets user enter a value 
    //    by using an adjustable sliding knob on a track
     
    new SliderDemo();

    } 
  
} 

class SliderDemo implements ChangeListener{

 JFrame frame;
 JPanel panel;
 JLabel label;
 JSlider slider;
 
 SliderDemo(){
  
  frame = new JFrame("Slider Demo");

  //Need to base this on the frame you're using
  frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
  panel = new JPanel();
  label = new JLabel();

  //minimum 0, maximum 100, starting point 50 of slider
  slider = new JSlider(0,100,50);
  
  slider.setPreferredSize(new Dimension(400,200));
  
  //adds ticks
  slider.setPaintTicks(true);
  //adds ticks every 10 spaces
  slider.setMinorTickSpacing(10);
  
  //Creates larger ticks
  slider.setPaintTrack(true);
  slider.setMajorTickSpacing(25);
  
  slider.setPaintLabels(true);
  slider.setFont(new Font("MV Boli",Font.PLAIN,15));
  label.setFont(new Font("MV Boli",Font.PLAIN,25));
  
  //makes slider horizontal or vertical
  //slider.setOrientation(SwingConstants.HORIZONTAL);
  slider.setOrientation(SwingConstants.VERTICAL);
  
  label.setText("°C = "+ slider.getValue());
  
  slider.addChangeListener(this);
  
  panel.add(slider);
  panel.add(label);
  frame.add(panel);
  frame.setSize(420,420);
  frame.setVisible(true);
 }
 
 @Override
 public void stateChanged(ChangeEvent e) {
  
	//adjusts text to equal value of slider
  	label.setText("°C = "+ slider.getValue());
  
 }

}
```

>[!Output]
>![[Screenshot 2022-11-21 at 9.20.24 AM.png|400]]

