---
Source:
  - zotero://open-pdf/library/items/JK4NPYJ8?page=2&annotation=XQI8X9E2
Length: "1677"
Progress: "17"
tags:
  - status/incomplete
  - type/textbook
Reviewed: false
---
- [Errata updated](https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/11599/e4-bugs.html)
	- 106 errors total
	- Last update August 5th 2023
	- "first printing of the fourth edition"
	- Last update was August 3rd, 2023
		- That is each vertex v <mark style="background: #FFF3A3A6;">to</mark> That, is each vertex v
- Book is commonly referred to as CLRS [^1]
	- Thomas H. Cormen
	- Charles E. Leiserson
	- Ronald L. Rivest
	- Clifford Stein
## Preface
- Some solutions can be found at https://mitpress.mit.edu/algorithms
- Prerequisites
	- [[Linked lists]]
	- [[array]]
	- mathematical induction
	- Elementary calculus
- “The wide range of topics in this book makes it an excellent handbook on algorithms.” ([Cormen et al., 2022, p. 16](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=16&annotation=I3BLBSRK))
- “If you are used to 0-origin arrays, you might find our frequent practice of indexing arrays from 1 a minor stumbling block” ([Cormen et al., 2022, p. 16](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=16&annotation=FM83IAE2))
- “It contains technique-based chapters on [[divide and conquer|divide-and-conquer]], [[dynamic programming]], [[greedy algorithms]], [[amortized analysis]], [[augmenting data structures]], [[NP-completeness]], and [[approximation algorithm]]” ([Cormen et al., 2022, p. 17](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=17&annotation=394N2C7B))
- “But it also has entire parts on [[sorting]], on data structures for [[dynamic sets]], and on algorithms for [[graph]] problems” ([Cormen et al., 2022, p. 17](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=17&annotation=PN2SJ2BQ))
- “We dropped in their entirety the chapters on [[Fibonacci heaps]], [[van Emde Boas trees]], and [[computational geometry]].” ([Cormen et al., 2022, p. 18](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=18&annotation=T4ID9MA9))
- “The following material was excised: the [[maximum-subarray problem]], implementing [[pointers and objects]], [[perfect hashing]], [[randomly built binary search trees]], [[matroids]], [[push-relabel algorithms for maximum flow]], the [[iterative fast Fourier transform method]], the details of the [[simplex algorithm for linear programming]], and [[integer factorization]].” ([Cormen et al., 2022, p. 18](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=18&annotation=UKARTPEL))
- "Traveling-salesman problem" is now called the "traveling-salesperson problem"
- “We second case of the [[master theorem]] incorporates polylogarithmic factors,” ([Cormen et al., 2022, p. 19](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=19&annotation=K8E9YNPG))
- “We also present the powerful and general [[Akra-Bazzi]] method (without proof).” ([Cormen et al., 2022, p. 19](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=19&annotation=3SMSGYZX))
- “The [[deterministic order-statistic algorithm]] in Chapter 9 is slightly different,” ([Cormen et al., 2022, p. 19](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=19&annotation=FKE89EML))
- “Chapter 11 on [[Hash Table|hash tables]] includes a modern treatment of hash functions. It also emphasizes [[linear probing]] as an efficient method for resolving collisions when the underlying hardware implements caching to favor local searches.” ([Cormen et al., 2022, p. 19](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=19&annotation=6Z8LS445))
- “Linda also produced many of the Python implementations that are available on the book’s website.” ([Cormen et al., 2022, p. 23](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=23&annotation=UFDMLV3H))


## (I) Foundations: Introduction
- Chapter 1 makes a case “for considering algorithms as a technology, alongside technologies such as fast hardware, graphical user interfaces, object-oriented systems, and networks.” ([Cormen et al., 2022, p. 25](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=25&annotation=YPTG4V39))
- “The sorting algorithms we examine are [[Insertion Sort|insertion sort]], which uses an incremental approach, and [[merge sort]], which uses a recursive technique known as “[[divide and conquer|divide-and-conquer]].” A” ([Cormen et al., 2022, p. 25](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=25&annotation=R3MW5LJX))
	- “Although the time each requires increases with the value of n, the rate of increase differs between the two algorithms. W” ([Cormen et al., 2022, p. 25](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=25&annotation=ZQEJDB2H))
- “determine these running times in Chapter 2 , and we develop a useful [[asymptotic notation]] to express them.” ([Cormen et al., 2022, p. 25](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=25&annotation=AUPFKHI2))
- “We'll use asymptotic notation to bound the growth of functions—most often, functions that describe the running time of algorithms$\textemdash$from above and below” ([Cormen et al., 2022, p. 25](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=25&annotation=WQ7VB6VX))
- “formally defines five asymptotic notations” ([Cormen et al., 2022, p. 26](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=26&annotation=RKN2JVKH))
- “Chapter 4 contains methods for solving [[recurrences]], which are useful for describing the running times of recursive algorithms. In the [[substitution method]], you guess an answer and prove it correct. [[Recursion trees]] provide one way to generate a guess.” ([Cormen et al., 2022, p. 26](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=26&annotation=DZX958QG))
	- “presents the powerful technique of the “[[master method]],” which you can often use to solve recurrences that arise from divide-and-conquer algorithms.” ([Cormen et al., 2022, p. 26](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=26&annotation=FF6CUDU4))
- “Chapter 5 introduces [[probabilistic analysis]] and [[randomized algorithms]].” ([Cormen et al., 2022, p. 26](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=26&annotation=NI8X3DZW))
	- Probabilistic analysis used to “determine the running time of an algorithm in cases in which, due to the presence of an inherent [[probability distribution]], the running time may differ on different inputs of the same size. I” ([Cormen et al., 2022, p. 26](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=26&annotation=R2X3RIA6))
		- “You might assume that the inputs conform to a known probability distribution, so that you are averaging the running time over all possible inputs. I” ([Cormen et al., 2022, p. 26](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=26&annotation=62PQ44T2))
		- “In other cases, the probability distribution comes not from the inputs but from random choices made during the course of the algorithm.” ([Cormen et al., 2022, p. 26](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=26&annotation=PCLSSA27))
	- An algorithm whose behavior is determined not only by its input but by values produced by a random-number generator is a [[randomized algorithm]]
		- Used to enforce a probability distribution on inputs (so no particular input always causes poor performance)
		- Bound error rate of algorithms that are allowed to produce incorrect results on a limited basis
- “you should think of the appendices as reference material.” ([Cormen et al., 2022, p. 27](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=27&annotation=XZ6EAFZ9))
- “All the chapters in Part I and the appendices are written with a tutorial flavor.” ([Cormen et al., 2022, p. 27](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=27&annotation=QJBJ4W3V))

## (1) The Role of Algorithms in Computing
### (1.1) Algorithms
- “Informally, an [[algorithm]] is any well-defined computational procedure that takes some value, or set of values, as [[input]] and produces some value, or set of values, as [[output]] in a finite amount of time. An” ([Cormen et al., 2022, p. 28](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=28&annotation=AVU9GQL5))
	- Sequence of computational steps that transform the input into the output
- “You can also view an algorithm as a tool for solving a well-specified [[computational problem]] .” ([Cormen et al., 2022, p. 28](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=28&annotation=FG8D3U4K))
	- Statement of problem specifies desired input/output relationship for problem instances
	- Algorithm describes procedure for input/output relationship for all problem instances
- “suppose that you need to sort a sequence of numbers into [[monotonically]] increasing order.” ([Cormen et al., 2022, p. 28](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=28&annotation=ZVPZHM3F))
	- “Here is how we formally define the [[sorting problem]]” ([Cormen et al., 2022, p. 28](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=28&annotation=NGQSVD6I))
#### Sorting Problem
- Input: A sequence of n numbers $<a_1, a_2, ..., a_n>.$
- Output: A permutation (reordering) $<a', a'_2, ...,a'_n>$ of the input sequence such that $a'_1 \le a'_2 \le ... \le a'_n$
- Given input sequence <31, 41, 59, 26, 41, 58>, you'd expect <26, 31, 41, 41, 58, 59>
	- Such an input sequence is called an [[instance]] of the sorting problem 
		- When problem context is known, problem instances are themselves simply called "problems"
		- An instance of a problem consists of input (satisfying constraints in problem statement) needed to compute solution to problem
- Which sorting algorithm is best for a given application depends on factors
	- number of items to be sorted
	- extent to which the items are already sorted
	- restrictions on item values
	- architecture of computer
	- storage devices used (main memory, disks, archaically- tapes)
- An algorithm for a computational problem is correct if it halts and outputs the correct solution. A [[correct algorithm]] solves the given computational problem
- [[Incorrect algorithms]] might not halt or might halt at an incorrect answer
	- Incorrect algorithms can be useful if you control their error rate (useful for finding large prime numbers)
- Algorithm must be specified in English as computer program or hardware design.
	- Only requirement is specification must provide a precise description of the computational procedure to be followed

#### What kinds of problems are solved by algorithms?
- Examples
	- [[Human Genome Project]]
		- Identifying roughly 30,000 genes in human DNA
		- Determining sequences of roughly 3 billion chemical base pairs
		- [[Dynamic programming]]
			- Involved in determining similarity between DNA sequences
			- Savings realized are in time and in money
	- Internet
		- Clever algorithms able to manage and manipulate large volume of data
		- Finds good routes on which the data travels
		- Using search engine to quickly find pages on which particular information resides
	- Electronic commerce
		- Goods and services negotiated and exchanged electronically
			- Depends on privacy of personal information
		- Core technologies used in electronic commerce include [[public-key cryptography]] and [[digital signatures]]
			- Based on numerical algorithms and number theory
	- Manufacturing and other commercial enterprises allocating scarce resources
		- [[Linear programs]]
			- Oil companies wishing to maximize profit
			- Political candidate where to buy campaign advertising
			- Airline assign crews to flights in least expensive way
			- Internet service provider placing additional resources
- Will learn how to determine the shortest route from one intersection to another using graphs
- Listing parts in order so that each part appears before any part that uses it. This problem is an instance of [[topological sorting]]
- Doctor determines wether an image is a cancerous or benign tumor. By using [[clustering algorithm]], can help doctor identify which outcome is more likely
- Compressing large file containing text
	- "[[LZW compression]]"
		- Looks for repeating character sequences
	- "[[Huffman coding]]"
		- encodes characters by bit sequences of various lengths, with characters occurring more frequently encoded by shorter bit sequences
- Two characteristics common to algorithmic problems
	- Many candidate solutions in which overwhelming majority do not solve problem at hand. Finding "best" without examining each solution is challenging
	- Practical applications (like shortest path between two places)
##### Example
- Given a set of numerical values representing samples of a signal taken at regular time intervals
	- the discrete [[Fourier transform]] converts the time domain to the frequency domain
		- it approximates the [[signal]] as a weighted sum of [[sinusoids]] producing the strength of various frequencies which when summed approximate the sampled signal.
	- In addition to [[signal processing]], discrete Fourier transforms have applications in [[data compression]] and multiplying large polynomials and integers
		- [[fast Fourier transform]]
			- Chapter 30 will sketch design of a hardware FFT circuit

#### Data Structures
- “A [[data structure]] is a way to store and organize data in order to facilitate access and modifications.” ([Cormen et al., 2022, p. 33](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=33&annotation=A5B8DNCA))

#### Technique
- “This book will teach you techniques of algorithm design and analysis so that you can develop algorithms on your own, show that they give the correct answer, and analyze their efficiency. Diffe” ([Cormen et al., 2022, p. 33](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=33&annotation=M45BEQGR))

#### Hard Problems
- “Our usual measure of efficiency is speed: how long does an algorithm take to produce its result?” ([Cormen et al., 2022, p. 34](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=34&annotation=UMF3XCEK))
- There are problems which we know of no algorithm that runs in a reasonable amount of time
	- Chapter 34 studies a subset of these problems which are known as [[NP-complete]]
- For NP-complete problems
	- No efficient algorithm for an NP-complete problem has been found, but nobody has ever proven that an efficient algorithm for one cannot exist
- For the set of NP-complete problems, if an efficient algorithm exists for one, then an efficient algorithm exists for all of them
- “NP-complete problems are similar, but not identical, to problems for which we do know of efficient algorithms.” ([Cormen et al., 2022, p. 34](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=34&annotation=3M7CF6RY))
- “Instead, you can show that the problem is NP-complete, you can spend your time developing an efficient [[approximation algorithm]], that is, an algorithm that gives a good, but not necessarily the best possible, solution.” ([Cormen et al., 2022, p. 34](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=34&annotation=EJJ7WGU3))
- Consider a delivery company with a central depot. Each day, it loads up delivery trucks at the depot and sends them around to deliver goods to several addresses. Each truck must end up back at the depot to be loaded for next day. To reduce costs, company wants to select an order of delivery stops that yields the lowest overall distance traveled by each truck
	- “This problem is the well-known “[[traveling-salesperson problem]],” and it is NP-complete.” ([Cormen et al., 2022, p. 35](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=35&annotation=X4283Y6F))
		- “only decision problems—those with a “yes/no” answer—can be NP-complete.” ([Cormen et al., 2022, p. 43](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=43&annotation=B6FB2ZI2))
			- “The decision version of the traveling salesperson problem asks whether there exists an order of stops whose distance totals at most a given amount.” ([Cormen et al., 2022, p. 43](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=43&annotation=LB2FMY36))
	- “Under certain assumptions, however, we know of efficient algorithms that compute overall distances close to the smallest possible.” ([Cormen et al., 2022, p. 35](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=35&annotation=V535AQXM))
		- Chapter 35 discusses such [[approximation algorithm|approximation algorithms]]

#### Alternative computing models
- Processor [[clock speeds]] increasing at a steady rate was true for years
	- Physical limitations present a fundamental roadblock: because power density increases superlinearly with clock speed, chips run the risk of melting once their clock speeds become high enough
	- To perform more computations per second, [[chips]] are being designed to contain several processing cores.
		- We can liken these multicore computers to several sequential computers on a single chip. They are a type of [[parallel computer]]
			- To elicit best performance with multicore computers, we need to design algorithms with [[parallelism]] in mind
		- [[Task-parallel]] algorithms takes advantage of multiple processing cores. 
- “Algorithms that receive their input over time, rather than having all the input present at the start, are [[online algorithms]], which Chapter 27 examines.” ([Cormen et al., 2022, p. 36](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=36&annotation=HQQEUB4M))
	- For many real world examples, input arrives over time, so an algorithm must decide how to proceed without knowing what data will arrive in the future
		- In a data center, jobs arrive and depart
		- Traffic must be routed
		- Hospital emergency rooms don't know when other patients will be arriving

#### Exercises
- (1) Online shopping products involve sorting such as sorting based on price. Car navigation involves finding the shortest distance between two points
- (2) Other measures of efficiency would be the space required to solve the problem
- (3) I've seen arrays as a data structure. It's strength is that you can find an item quickly in one but it's weakness is the space it takes
- (4) The way shortest-path and traveling-salesperson similar is that they both require find a short path between a starting point and a goal. However, they're different because they have different destinations
- (5) Only the best solution would do for flight routes. It would be catastrophic for planes to end up on an intersecting route. Approximating whether a tumor is benign or cancerous is good enough.
- (6) Jobs are inputs that are not entirely available in advance and arrives over time. The entire input is available when scheduling examination times for a university. Find algorithm to prevent overlapping
### (1.2) Algorithms as a Technology
- “Computing time is therefore a bounded resource, which makes it precious” ([Cormen et al., 2022, p. 37](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=37&annotation=8FMSZJWU))
- “You should choose algorithms that use the resources of time and space efficiently.” ([Cormen et al., 2022, p. 37](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=37&annotation=SLYKWW77))

#### Efficiency
- [[Insertion sort]] takes time roughly equal to $c_1n^2$ to sort n items, where $c_1$ is a constant that does not depend on n
	- Takes time roughly proportional to $n^2$
- [[Merge sort]] takes time roughly equal to $c_2nlgn$ where $lgn$ stands for $log_2n$ and $c_2$ is another constant that does not depend on n
- Insertion sort typically has a smaller constant factor than merge sort
	- Constant factors have far less impact on [[running time]]
- n is the input size
	- If n = 1000, $lgn$ = 10
	- If n = 1,000,000, $lgn$ = 20
- Small input sizes
	- insertion sort better than merge sort
- When input size n becomes large
	- merge sort's advantage of $lgn$ versus $n$ more than compensates the difference in constant factors
- Calculating time for algorithm
	- ![[Screenshot 2023-08-06 at 4.01.30 AM.png]]
		- Even though computer B had a poor compiler which caused the constant to = 50, B was much faster with merge sort than A was with insertion sort
#### Algorithms and other technologies
- “The example above shows that you should consider algorithms, like computer hardware, as a [[technology]].” ([Cormen et al., 2022, p. 39](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=39&annotation=IIBREHCH))
	- “Total system performance depends on choosing efficient algorithms as much as on choosing fast hardware.” ([Cormen et al., 2022, p. 39](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=39&annotation=W6DQENX9))
- Examples of advanced technologies
	- [[Computer architecture]] and [[fabrication technologies]]
	- [[Graphical user interfaces]]
	- [[Object-oriented systems]]
	- [[Integrated web technologies]]
	- [[Wired networking]], [[wireless networking]]
	- [[machine learning]]
	- [[mobile devices]]
- Algorithm content may not be required at the [[application level]]
	- Such as simple, web-based applications
- Web-based service that determines how to travel from one location to another
	- Fast hardware
	- GUI
	- wide-area networking
	- object orientation
	- algorithms for shortest-path, rendering maps, and interpolating addresses
- “Algorithms are at the core of most technologies used in contemporary computers.” ([Cormen et al., 2022, p. 40](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=40&annotation=I4IQSMUU))
	- hardware, GUI, Routing in Networks, compiler, interpreter or assembler all require algorithms
- “[[Machine learning]]can be thought of as a method for performing algorithmic tasks without explicitly designing an [[algorithm]], but instead inferring patterns from data and thereby automatically learning a solution” ([Cormen et al., 2022, p. 40](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=40&annotation=LYQH5RVI))
	- “Machine learning is itself a collection of algorithms, just under a different name. F” ([Cormen et al., 2022, p. 40](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=40&annotation=JQ6Y4FPP))
	- “Machine learning are mainly for problems for which we, as humans, do not really understand what the right algorithm is. P” ([Cormen et al., 2022, p. 40](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=40&annotation=58RWGFD7))
	- “Prominent examples include computer vision and automatic language translation.” ([Cormen et al., 2022, p. 40](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=40&annotation=VSS3UZAJ))
	- “Efficient algorithms designed to solve a specific problem are typically more successful than machine-learning approaches.” ([Cormen et al., 2022, p. 40](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=40&annotation=6FV8PAXD))
- “[[Data science]] is an interdisciplinary field with the goal of extracting knowledge and insights from structured and unstructured data. D” ([Cormen et al., 2022, p. 40](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=40&annotation=IYN7GXNV))
	- “uses methods from statistics, computer science, and optimization” ([Cormen et al., 2022, p. 40](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=40&annotation=N6NDRI4F))
	- “The design and analysis of algorithms is fundamental to the field.” ([Cormen et al., 2022, p. 40](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=40&annotation=9I32886Z))
- “Having a solid base of algorithmic knowledge and technique is one characteristic that defines the truly skilled programmer. W” ([Cormen et al., 2022, p. 41](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=41&annotation=X4UH4LEZ))
#### Exercises
- (1) Give an example of an application and discuss function of the algorithms involved  [^2] 
	- File Explorer
		- Applies sorting algorithm when user wants to sort files according to file name or file type
- (2) Given insertion sort runs in $8n^2$ and merge sort runs $64nlgn$, for which values of n does insertion sort beat merge sort?
	- $$ \begin{align*} 8n^2 &> 64nlgn 
	\\ 8n &> 64lgn 
	\\ n &> 8lgn  \end{align*}  $$
	- ![[Screenshot 2023-08-06 at 4.51.16 AM.png]]
		- Insertion sort beats merge sort when 2 $\le$ n $\le$ 43
	- You could also use [[Newton's Method]] to solve this problem
- (3) What is the smallest value of n such that an algorithm whose running time is $100n^2$ runs faster than an algorithm whose running time is $2^n$ on the same machine?
```python
x = 1
while 100*x*x > 2**x:
    x+=1
    print(x)
print("the smallest value of n is " + str(x))
```
- Output was 15 so the solution is n = 15
- (4) Find the maximal integer n such that f(n) $\le$ T [^3] [^4]. Below represents 1 second
	- (1) $lgn \le \lfloor 10^6\rfloor$
		- $n \le 2^{10^6}$
	- (2) $\sqrt{n} \le \lfloor 10^6\rfloor$
		- n $\le$ $10^{6^2}$
		- $n \le 10^{12}$
	- (3) $n \le \lfloor 10^6\rfloor$
		- $n \le 10^6$
	- (4) $nlgn \le \lfloor 10^6\rfloor$
	- (5) $n^2 \le \lfloor 10^6\rfloor$
		- n $\le$ 1000
	- (6) $n^3 \le \lfloor 10^6\rfloor$
		- n $\le$ 100
	- (7) $2^n \le \lfloor 10^6\rfloor$
		- n $\le$ $log_2 10^6$
		- n $\le$ $\lfloor 19.93156... \rfloor$ 
		- n $\le$ 19
	- (8) $n! \le \lfloor 10^6\rfloor$

|            | 1 second   | 1 minute      | 1 hour         | 1 day              | 1 month             | 1 year               | 1 century             |
| ---------- | ---------- | ------------- | -------------- | ------------------ | ------------------- | -------------------- | --------------------- |
| $lgn$      | $2^{10^6}$ | $2^{6*10^7}$  | $2^{3.6*10^9}$ | $2^{8.64*10^{10}}$ | $2^{2.592*10^{12}}$ | $2^{3.1536*10^{13}}$ | $2^{3.15576*10^{15}}$ |
| $\sqrt{n}$ | $10^{12}$  | $3.6*10^{15}$ | $1.29*10^{19}$ | $7.46*10^{21}$     | $6.72*10^{24}$      | $9.95*10^{26}$       | $9.96*10^{30}$        |
| $n$        | $10^6$     | $6*10^7$      | $3.6*10^9$     | $8.64*10^{10}$     | $2.59*10^{12}$      | $3.15*10^{13}$       | $3.16*10^{15}$        |
| $nlgn$     | $62746$    | $2801417$     | $133378058$    | $2755147513$       | $71870856404$       | $797633893349$       | $6.86*10^{13}$                      |
| $n^2$      | 1000       | 7745          | 60000          | 293938             | 1609968             | 5615692              | 56176151              |
| $n^3$      | 100        | 391           | 1532           | 4420               | 13736               | 31593                | 146679                |
| $2^n$      | 19         | 25            | 31             | 36                 | 41                  | 44                   | 51                    |
| $n!$       | 9          | 11            | 12             | 13                 | 15                  | 16                   | 17                    |

- Code snippet for finding solutions for $nlgn$ and $n!$ [^5]
	- However, we can't use this method to find a solution for $nlgn$ in a century
	- May need to use the [[Lambert W function]] [^6] to figure it out
```python
from math import *

# for n lg n
n = 1
while n * log(n, 2) < 1000000:
    n += 1

print("Minimum value of n (n lg n) :", n - 1)

# for n!
n = 1
while factorial(n) < 1000000:
    n += 1

print("Minimum value of n (n!)     :", n - 1)
```

- Output
```
Minimum value of n (n lg n) : 62746
Minimum value of n (n!)     : 9
```

## (2) Getting Started

### Introduction
- “We’ll begin by examining the [[insertion sort]] algorithm to solve the sorting problem introduced in Chapter 1.” ([Cormen et al., 2022, p. 44](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=44&annotation=MBNBIXL6))
	- “The analysis introduces a notation that describes how running time increases with the number of items to be sorted.” ([Cormen et al., 2022, p. 44](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=44&annotation=B4S5AIBW))
- “l use a method called divide-and-conquer to develop a sorting algorithm called merge sort.” ([Cormen et al., 2022, p. 44](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=44&annotation=SUEVBUW5))
	- “end with an analysis of merge sort’s running time.” ([Cormen et al., 2022, p. 44](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=44&annotation=3JFYE5A7))
### (2.1) Insertion Sort
- “Our first algorithm,[[ insertion sort]], solves the sorting problem introduced in Chapter 1” ([Cormen et al., 2022, p. 44](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=44&annotation=6IVCUN5A))
- “The numbers to be sorted are also known as the [[keys]].” ([Cormen et al., 2022, p. 45](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=45&annotation=6H65AT2Z))
	- “The input comes in the form of an array with n elements.” ([Cormen et al., 2022, p. 45](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=45&annotation=49SDG6LQ))
- “When we want to sort numbers, it’s often because they are the keys associated with other data, which we call [[satellite data]].” ([Cormen et al., 2022, p. 45](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=45&annotation=WYEJIHZ4))
- “a key and satellite data form a [[record]].” ([Cormen et al., 2022, p. 45](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=45&annotation=GRR2ERAE))
- “When describing a sorting algorithm, we focus on the keys, but it is important to remember that there usually is associated satellite data.” ([Cormen et al., 2022, p. 45](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=45&annotation=QSPTVSKY))
- “We’ll typically describe algorithms as procedures written in a [[pseudocode]] that is similar in many respects to C, C++, Java, Python, or JavaScript” ([Cormen et al., 2022, p. 45](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=45&annotation=3GQNSZZF))
	- “you can think of arrays as similar to Python lists.” ([Cormen et al., 2022, p. 82](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=82&annotation=9Y7SUW7M))
- Differences in pseudocode
	- (1) “separates pseudocode from real code is that in pseudocode, we employ whatever expressive method is most clear and concise to specify a given algorithm.” ([Cormen et al., 2022, p. 45](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=45&annotation=869RPFRU)) (plain English)
	- (2) “pseudocode often ignores aspects of software engineering—such as [[data abstraction]],[[modularity]], and [[error handling]]—in order to convey the essence of the algorithm more concisely.” ([Cormen et al., 2022, p. 45](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=45&annotation=HRYNULHC))
- “We start with [[insertion sort]], which is an efficient algorithm for sorting a small number of elements. I” ([Cormen et al., 2022, p. 45](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=45&annotation=K74QSXZI))
	- Similar to sorting a hand of playing cards (least to greatest from left to right)
#### Insertion Sort
Takes two parameters
	- an array A containing the values to be sorted
		- positions occupied are `A[1] through A[n]` of array denoted `A[1 : n].`
	- the number n of values to sort
- When INSERTION-SORT procedure finished, array `A[1 : n]` contains original values in sorted order
- Pseudocode below
	- ![[Screenshot 2023-08-07 at 12.53.29 AM.png]]
- Python version
```python
def insertion_sort(A, n):
    for i in range(1, n):
        key = A[i]
        j = i - 1
        while j > -1 and A[j] > key:
                A[j + 1] = A[j]
                j = j-1
        A[j + 1] = key
    return A

my_array = [5, 2, 4, 6, 1, 3]
my_array = insertion_sort(my_array, len(my_array))
print(my_array)
```
- Output
```
[1, 2, 3, 4, 5, 6]
```

#### Loop invariants and the correctness of insertion sort
“The index i indicates the “current card” being inserted into the hand.” ([Cormen et al., 2022, p. 47](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=47&annotation=BAXWN97K))
- The [[subarray]] `A[1 : i-1]` is the sorted hand and the remaining subarray `A[i + 1 : n]` corresponds to the pile of cards still on the table
- We state the properties of `A[1 : i-1]` formally as a [[Loop Invariant|loop invariant]]
- ![[Screenshot 2023-08-07 at 2.59.36 AM.png]]
	- “In each iteration, the blue rectangle holds the key taken from A[i], which is compared with the values in tan rectangles to its left in the test of line 5. Orange arrows show array values moved one position to the right in line 6, and blue arrows indicate where the key moves to in line 8.” ([Cormen et al., 2022, p. 47](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=47&annotation=5AR46CCA))
- The subarray `A[1 : i-1]` consists of the elements originally in `A[1 : i-1]` but in sorted order
- “Loop invariants help us understand why an algorithm is correct.” ([Cormen et al., 2022, p. 47](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=47&annotation=RQB8SC68)) 
- Need to show 3 things in loop invariants
	- [[Initialization]]: “It is true prior to the first iteration of the loop.” ([Cormen et al., 2022, p. 48](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=48&annotation=4Y47YN7B)) ^v6ucqc
	- [[Maintenance]]: “If it is true before an iteration of the loop, it remains true before the next iteration.” ([Cormen et al., 2022, p. 48](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=48&annotation=S9ZUQAVP)) ^w59341
	- [[Termination]]: Loop terminates and the invariant (usually along with the reason that the loop terminated) gives a useful property that helps show the algorithm is correct ^k19qqs
- “When the first two properties hold, the loop invariant is true prior to every iteration of the loop. (” ([Cormen et al., 2022, p. 48](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=48&annotation=QUBUWNWA))
	- “A loop-invariant proof is a form of [[mathematical induction]], where to prove that a property holds, you prove a base case and an inductive step.” ([Cormen et al., 2022, p. 48](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=48&annotation=S2372VRQ))
	- “g that the invariant holds before the first iteration corresponds to the base case, and showing that the invariant holds from iteration to iteration corresponds to the inductive step.” ([Cormen et al., 2022, p. 48](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=48&annotation=FLA8GEV9))
	- Third property important since you use the loop invariant to show correctness
		- Use the loop invariant along with condition that caused the loop to terminate. 
		- “Mathematical induction typically applies the inductive step infinitely, but in a loop invariant the “induction” stops when the loop terminates.” ([Cormen et al., 2022, p. 48](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=48&annotation=DIEXEBI9))
- How properties hold for insertion sort
	- [[Initialization]]
		- “The loop invariant holds before the first loop iteration, when i = 2.” ([Cormen et al., 2022, p. 48](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=48&annotation=F22LZPUW))
			- When there is a for loop, the loop-invariant check prior to the first iteration occurs after the initial assignment to the loop-counter variable but before the first test in the loop header
				- In case of INSERTION-SORT, this time is after assigning 2 to the variable i but before the first test of whether $i \le n$
					- In terms of Java, the for loop would be `for (int i =2; i <= n; i++)`, the time would be between assignment (i=2) and comparison (i <=n).
		- Since the subarray `A[1 : i-1]` consists of the single element `A[1]`, which is the original element in `A[1]` and the subarray is sorted since a subarray with one value is always sorted, the loop invariant holds prior to the first iteration of the loop
	- [[Maintenance]]
		- “Showing that each iteration maintains the loop invariant.” ([Cormen et al., 2022, p. 48](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=48&annotation=JSKZ6MFW))
		- Informally
			- the for loop works by moving the values `A[i-1], A[i-2]` and so on by one position to the right until it finds the proper position for `A[i]`. This allows `A[1:i]` to consist of the elements originally in `A[1:i]` but in sorted order. [[Incrementing]] i by 1 for the next iteration preserves the loop invariant
		- More formal treatment
			- Would need to show a loop invariant for the while loop. However, we'll rely on the informal analysis to show that the second property holds for the outer loop
	- [[Termination]]
		- Examine loop termination
		- “loop terminates once i equals n + 1. Substituting n + 1 for i in the wording of the loop invariant yields that the subarray A[1 : n] consists of the elements originally in A[1 : n], but in sorted order. Hence, the algorithm is correct.” ([Cormen et al., 2022, p. 49](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=49&annotation=BRSJD26P))
			- Talked about why it terminates and gave a useful property to show why the algorithm is correct
#### Pseudocode conventions
- “Indentation indicates block structure.” ([Cormen et al., 2022, p. 49](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=49&annotation=WRT3TBPT))
- “For [[multiway tests]], w e use `elseif` for tests after the first one.” ([Cormen et al., 2022, p. 82](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=82&annotation=37EGKPGU))
- “The looping constructs <mark style="background: #FFF3A3A6;">while</mark>, <mark style="background: #FFF3A3A6;">for</mark>, and <mark style="background: #FFF3A3A6;">repeat-until</mark> and the <mark style="background: #FFF3A3A6;">if-else</mark> conditional construct have interpretations similar to those in C, C++, Java, Python, and JavaScript. 5” ([Cormen et al., 2022, p. 49](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=49&annotation=SLV97TAV))
	- “Python lacks repeat-until loops, and its for loops operate differently from the for loops in this book” ([Cormen et al., 2022, p. 82](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=82&annotation=23K8AIE2))
		- A for loop in python retains the value it had during the final iteration of the for loop (rather than the value that exceeded the bound). This is because a Python for loop iterates through a list which may contain nonumeric values
- “We use the keyword to when a for loop increments its loop counter in each iteration, and we use the keyword downto when a for loop decrements its loop counter (r” ([Cormen et al., 2022, p. 50](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=50&annotation=J8RYJAKA))
	- “When the loop counter changes by an amount greater than 1, the amount of change follows the optional keyword by.” ([Cormen et al., 2022, p. 50](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=50&annotation=CZ74QRCE))
- `//` indicates remainder of line is a comment
- “Variables (such as i, j, and key) are local to the given procedure. We won’t use [[global variable|global variables]] without explicit indication.” ([Cormen et al., 2022, p. 50](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=50&annotation=L966BKAS))
- To access an array elemnt, specify array name followed by index in square brackets
	- “`A[i]` indicates the ith element of the array A.” ([Cormen et al., 2022, p. 50](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=50&annotation=JVXRQ3PW))
- “o be clear about whether a particular algorithm assumes 0-origin or 1-origin indexing, we’ll specify the bounds of the arrays explicitly. If” ([Cormen et al., 2022, p. 50](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=50&annotation=USRMWQJB))
- “The notation “:” denotes a subarray. Thus, `A[i : j]` indicates the subarray of A consisting of the elements `A[i], A[i + 1], ... , A[j]`.” ([Cormen et al., 2022, p. 50](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=50&annotation=G48EQSCS))
	- “In Python, the last element of `A[i : j] is A[j – 1]`. Python allows negative indices, which count from the back end of the list. This book does not use negative array indices” ([Cormen et al., 2022, p. 83](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=83&annotation=GN3EF5TX))
		- For this book the subarray `A[i : j]` includes the element `A[j]`
	- “We also use the notation ":" to indicate the bounds of an array, as we did earlier when discussing the array `A[1 : n]`.” ([Cormen et al., 2022, p. 50](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=50&annotation=XTNILW9I))
- “We typically organize compound data into [[objects]], which are composed of [[attribute|attributes]].” ([Cormen et al., 2022, p. 51](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=51&annotation=5CYSPL8N))
	- To access an attribute, you have an object name followed by a dot followed by the attribute name
		- “If an object x has attribute f, we denote this attribute by x.f.” ([Cormen et al., 2022, p. 51](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=51&annotation=SFKCKSY9))
- “We treat a variable representing an array or object as a [[pointer]] (known as a reference in some programming languages) to the data representing the array or object. F” ([Cormen et al., 2022, p. 51](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=51&annotation=S778FXVU))
	- “For all attributes f of an object x, setting y = x causes y.f to equal x.f.” ([Cormen et al., 2022, p. 51](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=51&annotation=HUDW5JDG))
		- Setting x.f = 3 will make y.f = 3
		- x and y pont to the same object after the assignment y=x
- “Our attribute notation can “cascade.”” ([Cormen et al., 2022, p. 51](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=51&annotation=J2RYJ8L8))
	- If we assign y = x.f, then x.f.g is the same as y.g
		- “x.f.g is implicitly parenthesized as (x.f).g.” ([Cormen et al., 2022, p. 51](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=51&annotation=2JLM3322))
		- Only happens if there is a poniter to an object that has attribute g.
	- “Sometimes a pointer refers to no object at all. In this case, we give it the special value NIL.” ([Cormen et al., 2022, p. 51](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=51&annotation=VW5CRS7X))
- “We pass parameters to a [[procedure]] [[by value]]: the called procedure receives its own copy of the parameters, and if it assigns a value to a parameter, the change is not seen by the calling procedure.” ([Cormen et al., 2022, p. 51](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=51&annotation=6YQWU9G5))
	- The [[calling procedure]] is doing `my_function_test(3,4` and the [[called procedure]] would be `def my_function_test(x,y)`
	- If an object x is a parameter of a called procedure and the assignment x=y occurs within the called procedure, the object x will not change
	- In summary
		- Changes to Object attributes and individual array elements within the called procedure are visible to the calling procedure
		- Changes to parameter values passed by value within the called procedure are not visible to the calling procedure
- “A [[return]] statement immediately transfers control back to the point of call in the calling procedure.” ([Cormen et al., 2022, p. 52](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=52&annotation=ZZZUIYW3))
	- “We allow multiple values to be returned in a single return statement without having to create objects to package them togethe” ([Cormen et al., 2022, p. 52](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=52&annotation=FULZM8CM))
	- “Python’s [[tuple]] notation allows return statements to return multiple values without creating objects from a [[programmer-defined class]].” ([Cormen et al., 2022, p. 83](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=83&annotation=4UN8EME5))
- “The [[boolean operators]] “[[and]]” and “[[or]]” are [[short circuiting]].” ([Cormen et al., 2022, p. 52](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=52&annotation=STMB5L2S))
	- “That is, evaluate the expression “ x and y” by first evaluating x.” ([Cormen et al., 2022, p. 52](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=52&annotation=PE7TLWH2))
- “The [[keyword error]] indicates that an error occurred because conditions were wrong for the procedure to have been called, and the procedure immediately terminates.” ([Cormen et al., 2022, p. 52](zotero://select/library/items/VEBLXGAY)) ([pdf](zotero://open-pdf/library/items/JK4NPYJ8?page=52&annotation=6YR9V945))
	- Calling procedure responsible for handling error so no actions specified to take

#### Exercises
##### 2.1-1
###### Question
- Illustrate operation of INSERTION-SORT on array $<31, 41, 59, 26, 41, 58>$
###### Answer
- ![[Screenshot 2023-08-07 at 7.48.05 AM.png|300]]
	- The relative order of the two 41s stayed the same. This property is known as [[stability]] [^7]
##### 2.1-2
###### Question
- State the loop invariant and show that the SUM-ARRAY procedure returns the sum of the numbers in `A[1 : n]`
- ![[Screenshot 2023-08-08 at 12.31.54 AM.png]]
###### Answer
Loop Invariant
		- For each iteration, the sum = $A[1] + ... + A[i-1]$
	- Initialization
		- When entering the first iteration $i = 1$, the sum is empty since $A[1-1] = A[0]$ and the sum of 0 terms = 0.
	- Maintenance
		- Iteration adds $A[i]$ into sum and then increments i, meaning the loop invariant holds true
	- Termination
		- The loop terminates when $i = n+1$ and given the loop invariant, the sum will return $A[i:n]$
##### 2.1-3

###### Question
- Rewrite INSERTION-SORT to be decreasing
	- Simply change $A[j] > \text{ key}$ to $A[j] < \text{ key}$
###### Answer
``` python
def insertion_sort(A, n):
    for i in range(1, n):
        key = A[i]
        j = i - 1
        while j > -1 and A[j] < key:
                A[j + 1] = A[j]
                j = j-1
        A[j + 1] = key
    return A

my_array = [5, 2, 4, 6, 1, 3,1]
my_array = insertion_sort(my_array, len(my_array))
print(my_array)
# [6, 5, 4, 3, 2, 1, 1]
```
##### 2.1-4
###### Question
- 2.1-4: Consider the [[searching problem]]:
	- Input: A sequence of "n" numbers $<a_1, a_2, ..., a_n>$ stored in array $A[1 : n]$ and a value x
	- Output: An index i such that x equals $A[i]$ or the special value NIL if x does not appear in A
	- Write pseudocode for [[linear search]], which scans through the array looking for x. Use a loop invariant to prove algorithm is correct. Make sure it fulfills the three necessary properties
###### Answer
```python
def linear_search(A, n, x):
    i = 0
    while i < n and A[i] != x:
        i = i + 1
    if i == n:
        return None
    else:
        return i
my_array = [5, 2, 4, 6, 1, 3, 1]
print(linear_search(my_array,len(my_array),3)) # 5
print(linear_search(my_array,len(my_array),24)) # None
```
- Loop Invariant: At the start of each iteration, the x does not appear in subarray `A[1 : i-1]`
- Initialization
	- When i = 1, subarray is empty making loop invariant trivally true
- Maintenance
	- Incrementing `i` for the next iteration preserves the loop invariant
- Termination
	- By the loop invariant when $i = n + 1$, x does not appear in the subarray `A[1: i-1]` which would be the entire array causing the procedure to return NIL. If the loop terminated, then `i <= n` meaning $A[i] = x$ to return the index i.

##### 2.1-5
###### Question
- Consider adding two [[n-bit binary integers]] a and b, stored in two n-element arrays `A[0:n-1] and B[0:n-1]` where each element is either 0 or 1.
	- a = $\Sigma_{i=0}^{n-1} A[i]*2^i$
		- If n = 5 and $A[0 : n-1] = [1, 0, 1, 1, 0]$
			- $1*2^0+0*2^1+1*2^2+1*2^3+0*2^4 = 13$
				- But wouldn't this be the solution for an array of $[0,1,1,0,1]$? Seems like the summation may be backwards?
		- 
	- Summation may be incorrect
###### Potential Code
```python
def Add_Binary_Integers(A, B, n):
    C = [0] * (n+1)
    carry = 0
    for i in range (0, n):
        sum = A[i] + B[i] + carry
        C[i] = sum % 2
        if sum <= 1:
            carry = 0
        else:
            carry = 1
    C[n] = carry
    return C

# Let's analyze what the code is doing

A = [1,0,1,1]
B = [1,1,1,0]
solution = [1,1,0,0,1]
print(Add_Binary_Integers(A, B, len(A)))
```
###### Answer
### (2.2) Analyzing algorithms
### (2.3) Designing algorithms
## (3) Characterizing Running Times
### (3.1) O-notation, Omega-notation, and theta-notation
### (3.2) Asymptotic notation: formal definitions
### (3.3) Standard notations and common functions
## (4) Divide-and-Conquer
### (4.1) Multiplying square matrices
### (4.2) Strassen's algorithm for matrix multiplication
### (4.3) The substitution method for solving recurrences
### (4.4) The recursion-tree method for solving recurrences
### (4.5) The master method for solving recurrences
### (4.6) Proof of the continuous master theorem
### (4.7) Akra-Bazzi recurrences
## (5) Probabilistic Analysis and Randomized Algorithms
### (5.1) The hiring problem
### (5.2) Indicator random variables
### (5.3) Randomized algorithms
### (5.4) Probabilistic analysis and further uses of indicator random variables
## (II) Sorting and Order Statistics
## (6) Heapsort
### (6.1) Heaps
### (6.2) Maintaining the heap property
### (6.3) Building a heap
### (6.4) The heapsort algorithm
### (6.5) Priority queues
## (7) Quicksort
### (7.1) Description of quicksort
### (7.2) Performance of quicksort
### (7.3) A randomized version of quicksort
### (7.4) Analysis of quicksort

## (8) Sorting in Linear Time
### (8.1) Lower bounds for sorting
### (8.2) Counting sort
### (8.3) Radix sort
### (8.4) Bucket sort
## (9) Medians and Order Statistics
### (9.1) Minimum and maximum
### (9.2) Selection in expected linear time
### (9.3) Selection in worst-case linear time
## (III) Data Structures
## (10) Elementary Data Structures
### (10.1) Simple array-based data structures: arrays, matrices, stacks, queues
### (10.2) Linked lists
### (10.3) Representing rooted trees
## (11) Hash Tables
### (11.1) Direct-address tables
### (11.2) Hash tables
### (11.3) Hash functions
### (11.4) Open addressing
### (11.5) Practical considerations
## (12) Binary Search Trees
### (12.1) What is a binary search tree?
### (12.2) Querying a binary search tree
### (12.3) Insertion and deletion
## (13) Red-Black Trees
### (13.1) Properties of red-black trees
### (13.2) Rotations
### (13.3) Insertion
### (13.4) Deletion
## (IV) Advanced Design and Analysis Techniques
## (14) Dynamic Programming
### (14.1) Rod cutting
### (14.2) Matrix-chain multiplication
### (14.3) Elements of dynamic programming
### (14.4) Longest common subsequence
### (14.5) Optimal binary search trees
## (15) Greedy Algorithms
### (15.1) An activity-selection problem
### (15.2) Elements of the greedy strategy
### (15.3) Huffman codes
### (15.4) Offline caching
## (16) Amortized Analysis
### (16.1) Aggregate analysis
### (16.2) The accounting method
### (16.3) The potential method
### (16.4) Dynamic tables
## (V) Advanced Data Structures
## (17) Augmenting Data Structures
### (17.1) Dynamic order statistics
### (17.2) How to augment a data structure
### (17.3) Interval trees
## (18) B-Trees
### (18.1) Definition of B-trees
### (18.2) Basic operations on B-trees
### (18.3) Deleting a key from a B-tree
## (19) Data Structures for Disjoint Sets
### (19.1) Disjoint-set operations
### (19.2) Linked-list representation of disjoint sets
### (19.3) Disjoint-set forests
### (19.4) Analysis of union by rank with path compression
## (VI) Graph Algorithms
## (20) Elementary Graph Algorithms
### (20.1) Representations of graphs
### (20.2) Breadth-first search
### (20.3) Depth-first search
### (20.4) Topological sort
### (20.5) Strongly connected components
## (21) Minimum Spanning Trees
### (21.1) Growing a minimum spanning tree
### (21.2) The algorithms of Kruskal and Prim
## (22) Single-Source Shortest Paths
### (22.1) The Bellman-Ford algorithm
### (22.2) Single-source shortest paths in directed acyclic graphs
### (22.3) Dijkstra's algorithm
### (22.4) Difference constraints and shortest paths
### (22.5) Proofs of shortest-paths properties
## (23) All-Pairs Shortest Paths
### (23.1) Shortest paths and matrix multiplication
### (23.2) The Floyd-Warshall algorithm
### (23.3) Johnson's algorithm for sparse graphs
## (24) Maximum Flow
### (24.1) Flow networks
### (24.2) The Ford-Fulkerson method
### (24.3) Maximum bipartite matching
## (25) Matchings in Bipartite Graphs
### (25.1) Maximum bipartite matching (revisited)
### (25.2) The stable-marriage problem
### (25.3) The Hungarian algorithm for the assignment problem
## (VII) Selected Topics
### (26.1) The basics of fork-join parallelism
### (26.2) Parallel matrix multiplication
### (26.3) Parallel merge sort
## (27) Online Algorithms
### (27.1) Waiting for an elevator
### (27.2) Maintaining a search list
### (27.3) Online caching
## (28) Matrix Operations
### (28.1) Solving systems of linear equations
### (28.2) Inverting matrices
### (28.3) Symmetric positive-definite matrices and least-squares approximation
## (29) Linear programming
### (29.1) Linear programming formulations and algorithms
### (29.2) Formulating problems as linear programs
### (29.3) Duality
## (30) Polynomials and the FFT
### (30.1) Representing polynomials
### (30.2) The DFT and FFT
### (30.3) FFT circuits
## (31) Number-Theoretic Algorithms
### (31.1) Elementary number-theoretic notions
### (31.2) Greatest common divisor
### (31.3) Modular arithmetic
### (31.4) Solving modular linear equations
### (31.5) The Chinese remainder theorem
### (31.6) Powers of an element
### (31.7) The RSA public-key cryptosystem
### (31.8) Primality testing
## (32) String Matching
### (32.1) The naive string-matching algorithm
### (32.2) The Rabin-Karp algorithm
### (32.3) String matching with finite automata
### (32.4) The Knuth-Morris-Pratt algorithm
### (32.5) Suffix arrays
## (33) Machine-Learning Algorithms
### (33.1) Clustering
### (33.2) Multiplicative-weights alogrithm
### (33.3) Gradient descent
## (34) NP-Completeness
### (34.1) Polynomial time
### (34.2) Polynomial-time verification
### (34.3) NP-completeness and reducibility
### (34.4) NP-completeness proofs
### (34.5) NP-complete problems
## (35) Approximation Algorithms
### (35.1) The vertex-cover problem
### (35.2) The traveling-salesperson problem
### (35.3) The set-covering problem
### (35.4) Randomization and linear programming
### (35.5) The subset-sum problem
## (VIII) Appendix: Mathematical Background
## (A) Summations
### (A.1) Summation formulas and properties
### (A.2) Bounding summations
## (B) Sets, Etc.
### (B.1) Sets
### (B.2) Relations
### (B.3) Functions
### (B.4) Graphs
### (B.5) Trees
## (C) Counting and Probability
### (C.1) Counting
### (C.2) Probability
### (C.3) Discrete random variables
### (C.4) The geometric and binomial distributions
### (C.5) The tails of the binomial distribution
## (D) Matrices
### (D.1) Matrices and matrix operations
### (D.2) Basic matrix properties



## References
[^1]: https://en.wikipedia.org/wiki/Introduction_to_Algorithms
[^2]: https://atekihcan.github.io/CLRS/01/E01.02-01/
[^3]: https://stackoverflow.com/questions/30535244/intro-to-algorithms-chapter-1-1
[^4]: https://sites.math.rutgers.edu/~ajl213/CLRS/Ch1.pdf
[^5]: https://atekihcan.github.io/CLRS/01/P01-01/
[^6]: https://math.stackexchange.com/questions/3283606/simplify-n-log-2n-106
[^7]: https://atekihcan.github.io/CLRS/02/E02.01-01/