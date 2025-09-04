## Synthesis
- 
## Source [^1]
- (public key certificate, digital certificate) A means of authenticating public keys (see CRYPTOGRAPHY). Public key encryption is a very powerful system but has an important security hole: there is no intrinsic guarantee that the people or organizations distributing public keys are who they claim to be. A certificate is a file issued by a trusted third party$\textemdash$a certificate authority$\textemdash$that contains both a public key and details of the person or organization to whom it belongs, which the third party declares to be correct. Crucially, the certificate is digitally signed by the third party. A recipient can verify that the certificate itself is genuine by using the third party's public key, and can then be confident in using the public key it contains. Certificate files comply with the X509 standard and their use on the Internet is governed by RFC 3280.
- http://tools.ietf.org/html/rfc3280
	- The Internet X509 specification
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]