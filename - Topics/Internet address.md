## Synthesis
- 
## Source [^1]
### Intro
- Most people today are familiar with the formal of addresses used on the Internet. A typical simple example might be:
	- http://www.companyname.com/
- All Internet addresses are instances of uniform resource identifiers (see URI) and follow the rules laid down (2005) in the standard RFC3986. The example above consists of two distinct parts, separated by a colon:
	- 'http' is the URI scheme.
	- 'http://www.companyname.com' is the host.
- Two forward slash characters '//' may precede the host, but they are not part of it.
### Scheme
- The scheme specifies what kind of resource is being sought at the specified address. Often the scheme name comes from the protocol to be used: 'http' means that the message being sent will use the hypertext transfer protocol (HTTP) and is therefore seeking an HTTP server at the address. Similarly, the scheme 'ftp;' indicates a message using the file transfer protocol (FTP) and seeking an FTP server. However, it is not always the case that the scheme specifies the resource: for example, the 'mailto' scheme is used to specify an email address, but emails are sent using the simple mail transfer protocol (SMTP).
### The Host
- The host is usually specified in plain-language form. It cannot be used directly but must first be translated into the equivalent IP address, which consists of a list of numbers. The Internet uses a domain name system, in which the plain-language address is treated as a hierarchy of component domains separated by full stops. The hierarchy is read from right to left, and the topmost level-in this case 'com'-has to be one of the top-level domains defined by the Internet Corporation for Assigned Names and Numbers (ICANN).
- In analyzing the address, each domain is submitted in turn to an appropriate domain name server (DNS), beginning with the top-level domain on the far right. The DNS returns information on where to find the server for the next domain: when the end of the domain hierarchy is reached, an IP address will be returned.
- This IP address can also be specified directly. Assuming that the IP address for `http://www.companyname.com/` is 10.11.12.13, http://10.11.12.13/ means the same as 'http://www.companyname.com/'. This form of the address is only used in practice for special reasons.

### Top-level domains
- The domain name 'com' in the example is the commonest example of a generic top-level domain (gTLD), i.e. one with a name that indicates the type of site (in this case, a commercial company). A number of other generic domain names are approved by ICANN: for example 'ac' for an academic institution, 'gov' for a government organization, etc. Often, the top-level domain is a country domain indicating the country or region ('uk' for the United Kingdom, 'us' for the United States, 'eu' for the European Union, etc.). The generic name is then a second-level domain: for example, an academic institution in France might have the address: http://www.collegenom.ac.fr/ or a company in the EU might be: http://www.companyname.co.eu/. Note that 'co' is used as a second-level name rather than 'com'. Full lists of both generic and country approved domain names are given in the Appendix.
### Additional Components
- The above examples show the basic form of an Internet address. There are several additional components that may be added in particular cases. Some of these are compulsory for some URI schemes.
### Usernames and passwords
- A username may be included as part of the address; for example:
	- http://myself@www.companyname.com. 
- Optionally, a password may also be given using the format:
	- http://myself:mypassword@www.companyname.com
- This format can be used with HTTP and FTP requests in order to prevent a password-secured site asking for login details. In addresses for email messages a username must always be supplied:
	- mail to:
		- myself@http://www.companyname.com/
- Note in this example the absence of the double forward slash '//' in mailto: addresses.
### Port Numbers
- A port number may be appended to the host:
	- http://www.companyname.com:8080
- This indicates that the message is intended for an HTTP server listening on TCP port 8080 (rather than on port 80, the default port for HTTP.
### Entry Points and paths
- In Internet terminology the host together with any specified username, password, or port number is called the authority. An authority will access the default entry point of its service: for example, the default page of a website or the top-level directory of an ftp site (although the exact location of this default might depend on the username). Other locations within the service can be accessed by appending a path, which consists of a series of segments each preceded by ' / ':
	- http://www.companyname.com/demos/sample1.htm
- The path often represents a literal path in the server's file system. However, this need not be the case: for example, many web servers can be configured to interpret some paths as commands lo generate appropriate dynamic web pages. Each path segment may optionally contain appended parameters in the form of key-value pairs preceded by ';'. This facility is not often used. A query can follow the authority or, if present, path. This is introduced by '?' and contains data that qualifies the resource being requested. The internal syntax of the query is not specified by ICANN, but is usually organized as a series of key-value pairs separated by '\&':
	- http://www.companyname.com/demos/sample1.htm?language=en-gb\&encoding=utf-8
- Queries are used extensively in HTTP addresses to pass parameters from the client to the server. They are also used in other schemes, for example in mailto: addresses to specify the subject, body, etc., of the email:
	- mailto:
		- myself@http://www.companyname.com?subject=Reminder
- Finally, a fragment can be appended to the end of the address, preceded by a '\#'. The fragment identifies a secondary resource within the primary resource specified by the rest of the address. For example,
	- http://www.companyname.com/demos/sample1.htm\#section2
	- will cause the web browser to scroll to the element within web page `sample1.htm` that has an ID) attribute with the value 'section2.' In client-server contexts, the client strips the fragment from the address before it is used to locale a resource on a server.
		- #question What does ID) mean? Is it a mistake with no closing parenthesis or does it mean something different?
	- Fragments are therefore not sent to the server.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]