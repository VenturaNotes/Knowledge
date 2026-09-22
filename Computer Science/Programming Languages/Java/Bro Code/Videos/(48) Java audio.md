---
Source:
  - https://youtube.com/watch?v=SyZQVJiARTQ
---
```java
import java.io.File;
import java.io.IOException;
import java.util.Scanner;
import javax.sound.sampled.*;

//sampled files are only compatible with .wav files, not mp3.

public class Main {

	//throws keyword is used in a method signature and 
	// declares which exceptions can be thrown from a method.
	public static void main(String[] args) throws UnsupportedAudioFileException, IOException, LineUnavailableException{
		
		Scanner scanner = new Scanner(System.in);
		
		//Since this file is in the projects folder, 
		File file = new File("Level_Up.wav");
		//This is an audioinput stream
		//Needs a throws declaration for IOException and UnsupportedAudioFileException
		AudioInputStream audioStream = AudioSystem.getAudioInputStream(file);
		Clip clip = AudioSystem.getClip();
		//throws a LineUnavailableException
		clip.open(audioStream);


		//below won't work
		//With our audio clip, it's attempting to play in a background thread 
		//and our program does not wait around for background threads
		//so as soon as it runs out of code, it'll terminate
		//We need to figure out how to keep our program open and running so it
		//doesn't terminate. Could create a GUI system.
		//clip.start();
		
		String response = "";
			
		while(!response.equals("Q")) {
			System.out.println("P = play, S = Stop, R = Reset, Q = Quit");
			System.out.print("Enter your choice: ");
			
			response = scanner.next();
			response = response.toUpperCase();
			
			switch(response) {
				case ("P"): clip.start();
				break;
				case ("S"): clip.stop();
				break;
				//we can set our clip at a certain position at amount of microseconds
				//If we want to reset this clip, it will be set to 0.
				case ("R"): clip.setMicrosecondPosition(0);
				break;
				case ("Q"): clip.close();
				break;
				default: System.out.println("Not a valid response");
			}
		 }
		System.out.println("Byeeee!");	
	}
}
```


Output (Plays an audio file called "Level_Up.wav" when "P" is pressed)
```
P = play, S = Stop, R = Reset, Q = Quit
Enter your choice: P
P = play, S = Stop, R = Reset, Q = Quit
Enter your choice: q
Byeeee!
```


