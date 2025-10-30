## Synthesis
- An automated message sent from one application to another when an event occurs, acting as a real-time, one-way communication method.
	- #question So does this just mean my application is not able to communicate with the server but the server can communicate with my application? And since the server runs on its own, it can just send my application when needed without my application needing to make a request which would in turn save API calls?
- It's an HTTP callback that sends a user-defined payload to a specific URL, allowing services to notify each other about events like a new payment, a code commit, or a new message. 
	- #question What is an HTTP callback? 
- For example, a service like Stripe could send a webhook to notify your application about a failed payment, which then triggers your app to send an email to the customer
	- #question What is Stripe? 
## Source [^1]
- A method of augmenting or altering the behavior of a web page or web application with custom callbacks. Webhooks are user-defined HTTP callbacks, typically triggered by specific events, such as pushing code to a repository or when a new user signs up.
## References

[^1]: https://spdload.com/blog/software-development-glossary/