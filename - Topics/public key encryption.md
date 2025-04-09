---
aliases:
  - asymmetric encryption
---
## Synthesis
- 
## Source [^1]
- A type of cryptography where one of a pair of keys is used to encrypt a message and the other is used to decrypt it. It does not matter which key is used to encrypt and which to decrypt: both combinations will work; however, attempting to encrypt and decrypt with the same key will not work. The two keys are integers that are related mathematically, but-crucially-it must not be viable to deduce the other key if only one is known. In computational terms this means that it must be proven that there does not exist an algorithm to calculate the second key efficiently from the first, and that the range of possible integers must be large enough to make a brute force attack impractical.
- In usage, a given key pair belongs to a specific person or organization. One key of the pair, the public key, can be distributed freely; the other, the [[private key]], must be kept secret by the owner. The keys can then be used in one of two ways:
	- (1) Anybody wishing to send confidential data encrypts it with the recipient's public key. It can then only be decrypted by the recipient's private key, which only the recipient possesses.
	- (2) Anybody wishing to add a digital signature to data encrypts the signature with their private key. If the signature is valid when decrypted with the signer's public key, a user can be confident that the data indeed originated with the signer and has not been altered (see also CERTIFICATE).

## Source[^2]
- Asymmetric encryption is also known as public key encryption
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: https://www.cloudflare.com/learning/ssl/what-is-asymmetric-encryption/#:~:text=Asymmetric%20encryption%2C%20also%20known%20as,are%20used%20instead%20of%20one.