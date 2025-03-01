---
aliases:
  - application to person messaging
---
## Synthesis
- 
## Source [^1]
- A2P messaging (application to person messaging), also known as enterprise or business SMS, is a type of SMS messaging technique where a text is sent from a software application run by an enterprise to a consumer's device
	- Details [^2]
		- A2P SMS is automated, can be sent in bulk, and typically uses an SMS gateway instead of a regular mobile device
		- While most A2P SMS messages are received on mobile phones, they can also be sent to SMS-enabled devices like tablets, smartwatches, or even SMS-to-email services
		- A2P messaging does not require a physical SIM card. Instead, messages are sent via cloud-based SMS gateways that connect to telecom networks using APIs
		- Process of A2P messaging
			- (1) A business integrates an SMS API into its software or uses an SMS service provider
			- (2) The application sends an SMS request to an SMS gateway
			- (3) The SMS gateway routes the message through a telecom carrier
			- (4) The carrier delivers the message to the consumer's mobile network, and it appears on their device as a standard text
		- Examples of A2P messaging
			- A bank sending a [[one-time password|OTP]] for account login
			- An airline sending flight status updates
			- A retail store sending promotional offers or discounts
			- A doctor's office reminding patients of upcoming appointments

## Source[^2] 
- Automation & Scale
	- A2P messages are sent by a software application, often in bulk, rather than manually from one phone to another
	- Businesses use this to send alerts, [[one-time password|OTPs]], appointment reminders, promotional messages, etc.
- Sender Identity
	- A2P messages typically come from a short code (e.g., 12345), a long code (e.g., 10-digit number), or an alphanumeric sender ID instead of a personal mobile number
- Delivery Mechanism
	- Instead of using a traditional SIM card in a phone, A2P messages are transmitted via [[SMS gateway|SMS gateways]], which route messages through telecom networks
- Regulatory compliance
	- Many countries regulate A2P SMS more strictly than P2P messages to prevent spam and ensure consumer consent
## References

[^1]: https://www.techtarget.com/whatis/definitions/A
[^2]: ChatGPT