---
aliases:
  - Transmission Control Protocol
---
## Synthesis
- They are defined by [[Request for Comments|requests for comments]] (RFCs). 

## Source[^1]
- Defined by RFCs

## Source[^2]
- A core protocol in the [[TCP-IP suite]]
- Requires a three-way handshake to establish a connection
- Used for large responses, zone transfers, and certain DNS operations
- Incorporates several error recovery mechanisms, including 
	- [[sequence numbers]]
	- [[acknowledgment]] (ACK) packets
	- [[retransmissions]]
	- [[Flow control]] 
- Part of the [[Internet Protocol suite]]
### TCP vs UDP
- Choosing between the two depends on factors such as
	- data reliability
	- latency sensitivity
	- Specific case of communication

## Source[^3]
### Code Samples
#### TCPServer.java
```java
import java.io.*;
import java.net.*;

class TCPServer {

	public static void main(String argv[]) throws Exception {
		String clientSentence;
		String capitalizedSentence;

		// Create a server socket bound to port 6789
		ServerSocket welcomeSocket = new ServerSocket(6789);

		while (true) {
			//Wait for a client to connect, accept the connection and get the    
			//socket for communication
			Socket connectionSocket = welcomeSocket.accept();

			//Create input stream reader to read data from the client
			BufferedReader inFromClient = new BufferedReader(new
					InputStreamReader(connectionSocket.getInputStream()));

			//Create output stream writer to send data to the client
			DataOutputStream outToClient = new DataOutputStream
					(connectionSocket.getOutputStream());

			//Read a line of text (client's message) from the input stream
			clientSentence = inFromClient.readLine();

			//Capitalize the input message
			capitalizedSentence = clientSentence.toUpperCase() + '\n';

			//Send the capitalized message back to the client
			outToClient.writeBytes(capitalizedSentence);

		}
	}
}
```

##### Code Description [^2]
- (1) The server creates a "[[ServerSocket]]" listening on port 6789
	- This is a [[server socket]] being created
- (2) It enters a loop to continuously accept incoming client connections
	- This is done using the [[Socket]] class
- (3) When a client connects `welcomeSocket.accept()`, it creates input and output streams to communicate with the client
- (4) It reads a line of text from the client `inFromClient.readLine()`, capitalizes it, and sends it back to the client `outToClient.writeBytes()`

#### TCPClient.java
```java
import java.io.*;
import java.net.*;

class TCPClient {

    public static void main(String argv[]) throws Exception {
        String sentence;
        String modifiedSentence;

        // Create a buffered reader to read input from the user
        BufferedReader inFromUser = new BufferedReader(new
        InputStreamReader(System.in));

		// Create a socket and connect to the server running on localhost at 
		//port 6789
        Socket clientSocket = new Socket("localhost", 6789);

        // Create output stream writer to send data to the server
        DataOutputStream outToServer = new
        DataOutputStream(clientSocket.getOutputStream());

        // Create input stream reader to read data from the server
        BufferedReader inFromServer = new BufferedReader(new
        InputStreamReader(clientSocket.getInputStream()));

        // Read a line of text (user's message) from the input
        sentence = inFromUser.readLine();

        // Send the message to the server
        outToServer.writeBytes(sentence + '\n');

        // Read the modified (capitalized) message from the server
        modifiedSentence = inFromServer.readLine();

        // Print the modified message received from the server
        System.out.println("FROM SERVER: " + modifiedSentence);

        // Close the socket
        clientSocket.close();
    }
}

}
```
##### Code Description [^2] 
- (1) Client creates a [[Socket]] and connects to the server running on localhost port 6789
- (2) Creates input and output streams to communicate with server
- (3) Reads a line of text from user, sends it to server, then reads the modified message from server
- (4) Prints modified message received from server

## Hello World Example Description
- Given another physical machine or virtual machine, you can verify the code works across a network provided you change the name or IP address of the server in the client from `localhost` to that of the server
- Doesn't quite illustrate TCP's [[bytestream]] abstraction. Hidden underneath the `readLine` method.
	- Python version incomplete because the `read` method assumes everything sent by other side has been received and read
## Source[^4]
- Trade name. a solution of halogenated phenols: an effective antiseptic for minor skin injuries and irritations. It may also be used as a gargle for colds and sore throats.
## References

[^1]: [[Home Page - Computer Networking A Top-Down Approach 8th Edition by James F. Kurose and Keith W. Ross#1 1 What is the Internet]]
[^2]: ChatGPT
[^3]: [README: Getting Started with TCP](zotero://open-pdf/library/items/Z39YA2G3?page=1&annotation=8KH2BLT2)
[^4]: [[Home Page - Concise Medical Dictionary 10th Edition by Oxford Reference]]