---
aliases:
  - Domain Name System
---
## Synthesis
- Translates domain names into IP addresses
	- example.com $\to$ (192.168.1.1)
## Source [^1]
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

## Source[^2]
- An internet service that translates alphabetic names into IP addresses
## References

[^1]: ChatGPT
[^2]: https://quizizz.com/admin/quiz/5da881f925473f001a69cc22/wireless-networks