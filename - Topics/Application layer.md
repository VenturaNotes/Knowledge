---
aliases:
  - layer 7
---
## Synthesis
- 
## Source [^1]
- The topmost layer in the [[OSI model]] (Open Systems Interconnection model) of networking
- Primary role is to enable communication between applications running on different systems over a network
- This layer provides the interface that allows software to use network services
- Task: interfaces with applications to provide network services
### Scope
- Focuses on how users interact with the network and the services provided by the network to applications
- Scope includes
	- End-User Interaction: 
		- Provides services and protocols that allow end-users or applications to access and interact with network resources
	- Protocol Management: 
		- Manages application-specific protocols for data exchange (e.g., [[HTTP]], [[FTP]], [[SMTP]], [[DNS]])
	- Network Transparency:
		- Hide complexities of lower layers (transport, network, etc.) from the user, making networking seamless
	- Data Formatting and Presentation
		- Ensures data is in a suitable format for communication between systems
### What it Does
- Provides Services to Applications
	- Enables software applications (web browsers, email clients, file-sharing tools) to use the network
	- Example: A [[web browser]] uses the HTTP protocol at the application layer to fetch web pages
- Facilitates Communication
	- Defines protocols and methods to enable interaction between applications on different devices
	- Example: An email client uses [[SMTP]] to send emails and [[IMAP]]/[[POP3]] to receive them
- Manages User Requests
	- Ensures user requests (like downloading a file or loading a webpage) are correctly communicated over the network to the appropriate server or destination
		- Communicated over the network just means transferring data packets using network protocols from the client (user's application) to the appropriate server (or vice versa)
- Data Presentation and Formatting
	- May translate or encode data into formats useable by the recipient application
	- Example: [[MIME]] types in email specify how to display file attachments
### Protocols in Application Layer
- [[HTTP]] (HyperText Transfer Protocol): Used for browsing sites
- [[HTTPS]] (HTTP Secure): Secure version of HTTP with encryption
- [[FTP]] (File Transfer Protocol): For transferring files between systems
- [[SMTP]] (Simple Mail Transfer Protocol): For sending emails
- [[DNS]] (Domain Name System): For resolving domain names into IP addresses
- [[Telnet]]/[[SSH]]: For remote login to other [[systems]]
- Most protocols are standardized globally by organizations like [[IETF]]

### Key Points
- The application layer is not the [[Applications|application]] itself. It is not your [[browser]], [[email client]], or other software
	- Instead, it's the layer that provides services and protocols that applications use to communicate over the network
- The application layer is protocol-based
	- It defines rules and protocols to standardize communication across different systems
- Lower Layer Dependency
	- While the application layer interacts with the user or application directly, it relies on the [[transport layer]] (such as [[TCP]] or [[UDP]]) to ensure reliable communication

### Analogy
- Can think of application layer as a translator or facilitator
	- You (the [[Users|user]]) are trying to request information (like opening a website)
	- Application layer translates your request into a standard language (protocols like HTTP) that the network can understand
	- Ensures that the response (like the webpage) is also formatted and delivered back to your application (browser) correctly
- This layer abstracts all underlying network complexities, so you only focus on the service (such as browsing or emailing) without worrying about the technical details
### Example
- An example of the application layer would be HTTP.
	- HTTP is used by web browsers to fetch and display [[webpage|web pages]]
	- When typing a [[URL]] into your browser, the application layer (HTTP) sends a request to a server and receives the the webpage data in return

### Data Formatting
- The [[presentation layer]] formats data (e.g., [[encryption]], [[compression]]) before the application layer processes it. 
- Application layer protocols define specific formats, such as [[JSON]] for [[web APIs]]

### Browser
- A [[browser]] sends an HTTP GET request to fetch data. The [[server]] responds with the requested webpage, often in HTML format

## Source[^2]
- The application layer provides the services to user
## References

[^1]: ChatGPT
[^2]: https://youtu.be/NRckVJk9n0k?si=sqFUKq8vDMUYCos4