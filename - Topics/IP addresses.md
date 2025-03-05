---
aliases:
  - IP address
  - Internet protocol address
---
## Synthesis
- A unique identifier assigned to each device on a network allowing it to communicate with other devices
## Source[^1]
- A unique numerical identifier assigned to each device on a network. Identifies the device's location in the network
	- #question How is it a numerical identifier if IPv6 uses letters? 
### Details[^1]
- A device's location in a network refers to the logical position of the device within the network's structure. It doesn’t necessarily mean the device’s physical location, but rather its placement within the network topology. 
	- #question What does network topology mean?
- In some cases with public IP addresses, geolocation services can estimate a device's physical location using databases that map IP addresses to regions, ISPs, or network nodes.
	- #question Does it need to be a public IP address?
	- #question what is a geolocation service and what are some examples?
	- #question What does geolocation mean?
	- #question How is a database able to do this? 
	- #question What are network nodes?
	- #question is a public IP address for a specific device or is this a region covered?
- When a device connects to a network, you can find its IP address using tools like [[ipconfig]] (Windows) or [[ifconfig]] (Linux/macOS).
	- If the device is on a local network, you can check the router's DHCP table.
		- #question is local network and local area network different terms or do they mean the same thing similar to how home network and home area network are essentially the same. 
		- #question What is a DHCP table? 
	- If the device is on the internet, geolocation services like IP lookup tools can approximate its general location, but with varying accuracy
		- #question If I'm connected to the internet, does that mean anyone can find where I live?
		- #question What are some IP lookup tools?
- How IP addresses are assigned:
	- IP addresses are assigned dynamically (via DHCP) or statically (manually configured).
		- #question What is the difference between dynamic assignment and static assignment?
	- **Private/local IPs** are assigned within a network by a router using DHCP.
	- **Public IPs** are assigned by the Internet Service Provider (ISP).
	- It's **possible** for two devices to have the same private IP address if they're on separate networks, but not within the same network. However, two devices cannot have the same public IP on the internet without causing conflicts.
	- Manufacturers do not pre-assign IP addresses; they are assigned when a device connects to a network.
## Source[^2]
- A specific address assigned to a device on a network, allowing it to communicate with other devices. 
- IP addresses can be either 
	- [[IPv4]] (e.g., 192.168.1.1)
	- [[IPv6]] (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334))
	- #question What is the main difference between these types of IP addresses? Does it mean 

## Source[^3]
- An IP address can be routable (global) or non-routable (local)
	- #question What does a routable IP address mean and why is it considered global?
	- #question What is a non-routable IP address mean and why is it considered local? Does it mean it would just be part of a home area network (HAN)? 
## References

[^1]: ChatGPT
[^2]: https://www.quora.com/Is-a-network-address-the-same-as-an-IP-address
[^3]: https://quizizz.com/admin/quiz/5da881f925473f001a69cc22/wireless-networks