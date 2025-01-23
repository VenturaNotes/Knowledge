---
aliases:
  - User Datagram Protocol
---
## Synthesis
- 
## Source [^1]
- Used for connectionless and unreliable data transmission in computer networks
	- Provides a lightweight and fast way to send datagrams (packets) without the overhead of establishing a connection and ensuring reliability.
	- Often used for real-time communication, multimedia streaming, and applications where speed is more critical than reliability
- Key aspects
	- Connectionless Communication
		- No dedicated connection established between sender and receiver before sending data
		- Sends [[datagrams]] (packets) without prior setup
	- Unreliable Delivery
	- Minimal Overhead
	- Packet Structure
	- Multicast and Broadcast Support
	- Stateless Protocol
	- Efficient for Real-Time Applications
- Often used for [[DNS]] because DNS queries are typically small and can be sent as single datagrams without the need for connection establishment and reliability features provided by TCP.

## Source [^2]

UDPServer.java
```java
import java.io.*;
import java.net.*;

class UDPServer {
	public static void main(String args[]) throws Exception {

		final int SIZE = 1024;
		DatagramSocket serverSocket = new DatagramSocket(9876);

		byte[] receiveData = new byte[SIZE];
		byte[] sendData = new byte[SIZE];

		try {
			while (true) {
				DatagramPacket receivePacket = new DatagramPacket(receiveData,
						receiveData.length);

				serverSocket.receive(receivePacket);

				String sentence = new String(receivePacket.getData());
				InetAddress IPAddress = receivePacket.getAddress();
				int port = receivePacket.getPort();

				String capitalizedSentence = sentence.toUpperCase();

				sendData = capitalizedSentence.getBytes();
				DatagramPacket sendPacket = new DatagramPacket(sendData,
						sendData.length, IPAddress, port);
				serverSocket.send(sendPacket);
			}
		} finally {
			serverSocket.close();
		}
	}
}

```

UDPClient.java
```java
import java.io.*;
import java.net.*;

class UDPClient {
	public static void main(String args[]) throws Exception {

		int SIZE = 1024;
		BufferedReader inFromUser = new BufferedReader(new InputStreamReader(
				System.in));

		DatagramSocket clientSocket = new DatagramSocket();

		InetAddress IPAddress = InetAddress.getByName("localhost");

		byte[] sendData = new byte[SIZE];
		byte[] receiveData = new byte[SIZE];

		String sentence = inFromUser.readLine();
		sendData = sentence.getBytes();
		DatagramPacket sendPacket = new DatagramPacket(sendData,
				sendData.length, IPAddress, 9876);

		clientSocket.send(sendPacket);

		DatagramPacket receivePacket = new DatagramPacket(receiveData,
				receiveData.length);

		clientSocket.receive(receivePacket);

		String modifiedSentence = new String(receivePacket.getData());

		System.out.println("FROM SERVER:" + modifiedSentence);
		clientSocket.close();
	}
}
```

## Source[^3]
- Size of UDP header is 8 bytes
## References

[^1]: ChatGPT
[^2]: [README: Getting Started with TCP](zotero://open-pdf/library/items/Z39YA2G3?page=1&annotation=8KH2BLT2)
[^3]: https://youtu.be/HGYOEeik844?si=7KJaPkDktjARENM4