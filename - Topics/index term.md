---
aliases:
  - index terms
  - subject term
  - subject heading
  - descriptor
  - keyword
---
## Synthesis
- 
## Source [^1]
- Also known as subject term, subject heading, descriptor, or keyword
## Source[^2]
### Definition
- It's a word or phrase that represents the content of a document in an information retrieval system
- Used to create an [[index (data structure)|index]] (a data structure allowing users to quickly and efficiently search for documents that contain specific information)
- Automatic indexing techniques
	- [[Keyword extraction]]
		- Identifying words or phrases occurring frequently in document
	- [[Stemming]]
		- Reduce words to root form 
			- "running" and "ran" $\to$ "run"
	- [[stop word removal]]
		- Removing common words with not much meaning
			- "the"
			- "and"
			- "of"
### Example
- Given a document about the history of the automobile, these index terms could be assigned to the document
	- automobile, history, transportation, invention, Henry Ford
- If a user searches for "automobile history", the IR system would return the list of documents containing both index terms (including the document above)
## References
[^1]: https://en.wikipedia.org/wiki/Index_term#:~:text=In%20information%20retrieval%2C%20an%20index,for%20use%20in%20bibliographic%20records.
[^2]: Gemini Pro