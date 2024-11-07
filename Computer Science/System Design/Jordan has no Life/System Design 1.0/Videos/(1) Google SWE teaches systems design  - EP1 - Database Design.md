---
Source:
  - https://www.youtube.com/watch?v=ugVwhsWslAc
---
- ![[Screenshot 2024-09-15 at 12.13.49 AM.png]]
	- He is an incoming [[software engineer]] at google
	- He is a narcissist and likes the sound of his own voice
	- Will do a fundamental dive on [[system design]]
	- [[Database design]]
		- What is a [[database]]?
			- [[Web browser]]
			- [[Web server]]
			- [[Database server]]
		- If you or another person want to access the same piece of data from an application or you just want to access it in the future such that it's not on your local device, you will need a [[database]]
		- Clients will generally interact with a [[web server]] which will store all data that needs to be persisted or kept in the long run on a database
			- #question I want more details about "persisted"
	- Objectives of a [[database]] (if you are a big company that holds a lot of data)
		- Fast reads
		- Fast writes
		- Persistent data
			- Also [[durable data]] ( #question although I'm not sure if that means persistent data)
				- Durable data just means that if the power goes out on the machine holding the database, the data doesn't get lost. How do we do that? We just use a [[hard drive]]
	- Quick comment about [[disks]]
		- Description
			- Generally, we are using hard drives
			- Results in slow random reads
			- We should always aim for sequential operations
			- Much cheaper than SSDs but slower
				- #question what are SSDs?
		- Hard drives are pieces of [[hardware]] that hold data for a durable amount of time
			- They work by having the arm spin around the metal disk which typically goes at 5400 or 7200 rotations per minute
			- With hard drives, you always want to aim for [[sequential operations]]
				- It just means it speeds things up quite a bit to be accessing data that's much closer on the disk to one another
					- So having to jump around all over the disk means the arm needs to do more searching and it's going to take longer to find and write the data that you want
	- [[Naive Database Implementation]]
		- Literally just a list, O(n) reads and updates
			- Think of it as an [[array]] of [[Tuple|tuples]]
				- To read and update, you need to search through the array every time
					- This means to update it, you literally need to find id=3 and then change it in place
				- Writes are constant (but not good enough for our purposes)
					- #question why are writes in constant time for this case? (maybe when it means adding to a list?)
- ![[Screenshot 2024-09-15 at 1.27.39 AM.png]]
	- Slightly better database implementation
		- [[Append only]] log on disk to take advantage of [[sequential]] logs
			- #question What is meant by sequential?
			- #question what is meant by sequential logs?
			- This means, you actually overwrite things by writing an additional entry in the log. This way, you can benefit more from sequential rights.
				- By literally adding another row to the log, you can search from the bottom to the top of the log. Therefore, when you search from the bottom to the top of the log, you will get the correct data
	- Better database implementation
		- [[Hashmap]], O(1) reads and writes
			- In algorithms class, you basically use a [[hashing function]] to [[map]] a given [[key]] to a certain place in memory and the hashing function should distribute those keys out in such a way that you're able to get constant time accesses and also that means you can read and write really easily 
		- However, this does not scale because the second there is too much data, we are in trouble, hashmap has to go on [[disk]] which becomes slow
			- #question what is meant by disk in this case?
			- Doesn't work well. The second that you can't fit your entire hashmap in memory, it's really bad to put a hashmap on disk by virtue of what we've discussed before
				- #question why is it bad to put a hashmap on disk?
					- Random reads and random writes on disk are really bad because the mechanical arm has to go around and spin all the time and it will actually take longer to edit that data
			- Hashmaps might be really good when there is a small dataset, the second you're dealing with a ton of data, they become pretty infeasible
	- Indexes - making read times much faster
		- Keep extra data on each write to improve database read times
		- Pro: Faster reads
		- Con: Slower writes (only use indexes if you need them, do not declare an index for every field)
		- For writing
			- you can solve/speed up by using an append only log
				- #question is it append only or append only log?
		- Reading is the bigger issue (there is a lot of applications that is super read heavy)
			- How to make reads faster? We use something called [[indexes]]
				- It means we keep extra pieces of [[metadata]] on every single write in order to help track which values of certain rows are the same and that way we can query them really easily. 
					- For example with the table, if we want all the rows with customer_id 2, we can quickly find them without having to do a linear time scan of the entire data set
						- #question How can we find the customer_id with 2 instead of using a linear time scan?
			- Obviously the pro of this is faster reads but if you put an index on every column such that you can efficiently query the data using every single column, what will end up happening is that writes will take a much longer time.
				- #question what is meant by "putting an index" on every column?
	- Types of [[index implementations]] (These are 3 types)
		- Sections
			- [[Hash index|Hash indexes]]
			- [[LSM Tree|LSM Trees]] + [[SSTables]]
			- [[B-Trees]]
		- By going over them, we'll get a good idea of which databases to use for certain applications and why
- ![[Screenshot 2024-09-15 at 3.52.50 AM.png]]
	- [[Hash index]]
		- Keep an in memory hash table of the key mapped to the memory location of the corresponding data, occasionally write to disk for persistence
			- Pros: Easy to implement and very fast (disks are slow, RAM is fast)
			- Cons: All of the keys must fit in memory, bad for range queries
		- Mainly relies on a [[hashmap]] meaning all of the keys need to be able to fit in [[memory]]
		- Entire point of the hash index is that for the field you're indexing on, you take the key and then you map the offset on disk as the value in the hashmap. Therefore, we can do an O(1) constant time access in [[RAM]] and then we can easily scan the disk
			- #question "memory" considered ram? 
			- Problems:
				- If keys don't fit in memory, you're out of luck because hashmaps don't work that well on disk.
				- If you want to do a [[range query]] meaning you want to quickly find all the keys with a given range of values, they will be scattered all around disk and that will be very inefficient because you have to keep doing more random accesses
	- [[SSTables and LSM trees]]
		- Description
			- Write first goes to an in-memory [[balanced binary search tree]] ([[MemTable]]), eventually written to disk
				- #question what is in-memory
			- When tree becomes too large, write the contents of it (sorted by key name) to an SSTable file
			- To increase [[persistence]], keep log on disk of memtable writes to restore it in the event of a crash
		  - On writes, you'd first write to an [[in-memory buffer]] meaning on RAM, you'd have a [[self-balancing tree]] such as a [[red-black tree]] or an [[AVL tree]]. This would be called a [[MemTable]]. When the tree becomes too large, you take all the contents of it which should be automatically sorted by virtue of using a [[tree traversal]] and you would write them to something called an [[SSTables|SSTable]] file. This SSTable file would be held on disk. In the event the database crashes, whatever in memory is going to be lost. So we keep a second log called a [[write-ahead log]] expressing all of the changes that we have in the tree. That way if the machine crashes, we can easily restore that tree
		  - Furthermore, once you write the tree to disk, you reset the tree to nothing again and start writing keys in there
			  - Adding a key would just be adding it to the [[LSM tree]]
	  - SSTables and LSM trees continued
		  - Description
			  - Recall: Tree gets written to SSTable files, where the keys are sorted
			  - Recall: Since we are only using append only logs, there will be duplicate keys
			  - Can be merged in O(n) time, in case of duplicate key take the more recent value
		  - We write LSM trees to SSTables on disk. Here is an example of what SSTables might look like. As we can see, the keys are sorted and right next to them are their values
			  - We might have multiple SSTable files because every single time the LSM tree gets too big, you're writing it to an SSTable. You may also have duplicate keys between the two
			  - Since everything is an append only operation, if you want to overwrite a key, it might just go into a newer SSTable file. By virtue of overwriting key 33, we can see that the value changes from `Jabbar` to `Pippen`. 
			  - Issue is that by virtue of having all of these duplicate keys, we're potentially wasting a ton of storage. If you're updating the values in your database a lot, you might be using a ton of space that you could just get rid of if you were to somehow compress these SSTables. This is what we will do
			  - Compacted SSTable
				  - This means all the duplicate keys are going to have their updated value and additionally all of the other keys are also going to be in the compacted SSTable. How do we merge these together? If you remember from [[merge sort]], you basically start at the top of each SSTable and then start taking the keys in order. 
					  - We'd start with Westbrook and Iverson. We'll see that the 0 for Westbrook is smaller than the 3 for Iverson so Westbrook will be first in compacted table. Then we see that the 3 for Iverson is smaller than the 7 for Anthony so Iverson will be next. Since 5 is smaller than 7, etc.
						  - This is a linear time operation between the two tables to easily compress them. This is a process often run in the background to optimize storage space
		  - As it merges in linear time, in the case of the duplicate keys such as 23, 33, and 34, we're always going to take the more recent value as that will be the correct one.
			  - Will always give file 2 precedence over file 1
	  - SSTables and LSM trees continued
		  - Description
			  - Let's discuss how to quickly read a value by its index!
			  - Keep going through SSTables until you either find the key or run out!
		  - We've discussed how we might write to access tables. Now we'll discuss how to read
		  - When looking for a key, we would query the [[MemTable]]. We would do a [[binary tree traversal]] and look for the key in there which is $O(logn)$. Next, we would look at each SSTable in order from newest to oldest looking for the key. Issue with this is that fundamentally, you might go through SSTables until you have none left. If there are a lot of them and the key is not in any of them, you've wasted a ton of time. There is an optimization called [[bloom filters]] which helps this out so that in practice, it's not so brutal if the key does not exist. However from a theoretical perspective, it's bad on reads
  - ![[Screenshot 2024-09-15 at 4.12.58 AM.png]]
	  - SSTables and LSM Trees continued
		  - For each SSTable, have a sparse in-memory hashmap of keys with their value in memory. Since each table is sorted, we can quickly [[binary search]] the SSTable to find the value of a key! 
		  - Another optimization is the fact that all of these SSTables are sorted. We could keep a sparse in-memory hash table for each SSTable so we can quickly search them.
			  - We will keep a small hash table so we know it can fit in memory of basically the keys that are sparse but in order and their [[memory address|memory addresses]]
			  - We know that Andy's key is between Alice and Bob because the SSTable is sorted. Therefore, we'd start at the memory address of Alice and start at the memory address of Bob and run a binary search.
				  - This means we'd basically be splitting the disk chunk between them in parts of two and that way we could do a Log(n) search on a sorted array
	  - SSTables and LSM trees summarized (one implementation of an index)
		  - Description
			  - Pros
				  - High write throughput due to writes going to in memory buffer
				  - Good for range queries due to internal sorting of data in the index
			  - Cons:
				  - Slow reads, especially if the key we are looking for is old or does not exist
				  - Merging process of log segments can take up background resources
		  - Pro about them is that writes are really fast. There is an [[in-memory buffer]] and writes to [[memory]] are always significantly faster than disk because memory is just much closer to the [[Central Processing Unit|CPU]]
			  - Additionally, they are very good for range queries so if you want to get all the values for a range of keys, you could do that because ranges of keys are stored together in the SSTables since they're sorted.
		  - Cons is that reads are slow. You have to go through a ton of SSTables and do a lot of searching that could potentially be devastating
			  - Additionally, merging resources in the background might use some database resources and make things a little bit slower
	  - [[B-Trees]]
		  - Entire point is to model your data such that it is a tree on disk. Lets say we have a bunch of names and we want to be able to find the corresponding age like we did before. We want to keep data in order and have [[pointers]] down the tree to show where the actual data is.
			  - The top level or root page has a reference between all keys that go from "A" to "E" and etc.
			  - If we want to find the name "Thomas", we'd first take the reference from "P" to "Z" and then on the next page, we would take the reference between "T" and "Z" because "Thomas" is between them.
			  - Finally, we'd go to the page where values are actually stored which tends to be 3 or 4 levels down to have many terabytes of storage assuming the tree pages are large enough. And as you can see, you can easily get your value. All of this can be done in logarithmic time.
	  - B-Trees continued
		  - To read: traverse through the tree and find the value
		  - To update: traverse through the tree and change the value
		  - To write: traverse through the tree, if there is extra space in the block where the value belongs, add the key, otherwise you have to split the location block in two, add the key, and then update the parent block to reflect this action. Can be made durable in the event of crashes using a [[write-ahead log]].
			  - Can get a little more complicated. If there is space in a given block where a key should go, then you can just put it there. If a given block of the B-Tree is out of space and there is no room to add the key and its corresponding value, then you have to split the page in 2 and update the parent page to reference both of them. 
				  - Splitting the pages and updating the parents if the server crashes, you'll need to be able to restore that. To do so, just use write-ahead logs similar to with LSM Trees where you write all of your changes down tentatively before you make them so that in the event of a crash, you can go and restore that.
  - Image
	  - B-trees summarized
		  - Pros: 
			  - Relatively fast reads, most B-trees can be stored in only 3 or 4 levels
				  - Logarithmic time complexity and only going down 3 or 4 levels
			  - Good for range queries as data is kept internally stored
				  - All keys next to one another in the actual range are physically next to one another on the drive
		  - Cons:
			  - Relatively slow writes, have to write to disk as opposed to memory
				  - Writing directly to disk instead of [[in-memory buffer]] like on an LSM Tree
  - ![[Screenshot 2024-09-15 at 4.19.49 AM.png]]
	  - Conclusion
		  - In a system, it is important to know what type of database engine/design you are using so that you can optimize for writes or reads
			  - Hash indexes: fast but only useful on small datasets
				  - Such as a [[Redis]] database where everything's already in memory could work well
			  - SSTables and LSM-Trees: better for writing, slower for reading
				  - Great for writing a lot and quickly
				  - Not great for reading because you risk having to go through a bunch of SSTables 
			  - B-Trees: better for reading, slower for writing
				  - Slower than SSTables and LSM-Trees for writing because you're not writing to an in-memory buffer.
		  - Obviously in a system, it's important to be able to justify the choices that you're making. In a systems design interview, if you just named a database engine and said I'm going to use this, you'll obviously get a look and ask why you would do that. Now you can actually justify this
	  - #resource Recommends reading Designing Data-Intensive Applications by Martin Kleppmann
	  - These are two types of database designs that are pretty crucial for determining the performance of both read and write [[throughput]].