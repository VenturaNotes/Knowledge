---
aliases:
  - 2FA
---
## Synthesis
- 
## Source [^1]
- Two-factor authentication is a technique used to increase the level of security by adding a step or component to the user verification process. 
- Requires the user to undergo two successful [[authentication|authentications]] before access is granted. 
- Authentication methods
	- Something the user knows (such as a password)
	- Something the user physically holds (such as a credit card)
	- Something inseparable from the user's body
		- Explanation[^2]
			- Typically refers to [[biometric authentication]]
				- [[Fingerprint recognition]]
				- [[Facial recognition]]
				- Iris scans
					- #comment [[Iris recognition]]
				- [[Voice recognition]]
			- This method is often needed in high-security environments, such as unlocking phones, accessing banking apps, or entering restricted facilities
- Examples
	- For an [[Automated Teller Machine|ATM]] transaction, user inserts bank card and enters password
		- The two factors make it difficult for an unauthorized user to access the bank account
	- Password + fingerprint scan
		- Fingerprint Scan Explanation [^2]
			- Capturing an image of the user's fingerprint
			- Analyzing the unique patterns (ridges and valleys) of the fingerprint
				- #question What is meant by ridges and valleys?
			- Converting this data into a digital format
			- Comparing it against stored fingerprint data to verify identity
	- Password + [[one-time password]]
	- Online services implementation
		- When logging into a service, a text message ([[SMS verification]]) to the user's phone with a unique code must be entered if computer not recognized
			- No one can access account without phone which increases security
		- A smartphone app such as [[Google Authenticator]], can generate random codes that verify the user
- Bypassing 2FA
	- Not meant to be bypassed
	- If you lost your 2FA method of accessing an account
		- Use a recovery e-mail or phone number
		- Contact support of the company your trying to access to verify your identity
		- Use 2FA backup code provided when 2FA created.
			- Code is a long series of letters and numbers
## References

[^1]: https://www.computerhope.com/jargon/t/twofactor-auth.htm
[^2]: ChatGPT