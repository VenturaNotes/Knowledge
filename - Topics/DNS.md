---
aliases:
  - Domain Name System
---
## Synthesis
- Translates domain names into IP addresses
	- example.com $\to$ (192.168.1.1)
### Description
- A hierarchical naming system used to translate [[domain names]] (example.com) into [[IP addresses]] (192.168.1.1)
	- It uses a hierarchical structure with domain names organized into [[zones]], [[subdomains]], and individual [[domain names]]
- [[DNS server|DNS servers]] maintain databases of domain names and corresponding IP addresses
	- When a device needs to access a website or resource using a domain name, it sends a [[DNS query]] to a DNS server to resolve domain name to an IP address
	- DNS queries and responses typically use UDP as the [[transport protocol]]
		- A DNS request / DNS query is sent to port 53 on the [[DNS server]]
			- [[Domain name resolution]]?
	- DNS typically uses UDP because DNS queries are typically small and can be sent as single datagrams without needing connection establishment and reliability features provided by TCP
- Can use TCP in certain cases, such as for large responses or [[zone transfers]]
- A [[DNS zone transfer]] is the process of transferring a copy of a DNS zone's database (including all domain records) from one DNS server to another.
	- Typically done using TCP and are used for synchronization and redundancy in DNS infrastructure
- Responsible for domain name resolution, translating domain names into IP addresses
- "example.com" is not a unique address but rather an example domain name commonly used for illustrations
	- The ".com" represents the top-level domain ([[top-level domain|TLD]]) for commercial organizations.
- For resolving domain names into IP addresses
- DNS resolves domain names into IP addresses
	- #question how does DNS do this?
## Source[^1]
- An internet service that translates alphabetic names into IP addresses
## Source[^2]
- A system that provides mappings between the human-oriented names of users or services in a network, and the machine-oriented network addresses of the named entity. It is used primarily on TCP/IP networks, primarily the Internet, to map such human-oriented names as "www.oup.co.uk" to the equivalent IP address; however, other networks have similar facilities. Names are usually hierarchical, and in general terms the boundaries of a domain will coincide with some form of natural boundary within the network environment, such as a country, a community of users within a country, or the users on a site. The above example consists of the four domains 'uk' (the top-level domain), 'co', 'oup', and 'www'. While the arrangement of IP addresses is also usually hierarchical, there is no assumption in the mapping between the two that the hierarchies are in any way equivalent. See also DOMAIN NAME SERVER, FQDN.
- http://tools.ietf.org/html/rfc1034
	- Introduction to the Internet domain name system
- http://tools.ietf.org/html/rfc1035
	- Domain names-implementation and specification
- #comment Link "oup" not working
## References

[^1]: https://quizizz.com/admin/quiz/5da881f925473f001a69cc22/wireless-networks
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
