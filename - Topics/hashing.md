## Synthesis
- 
## Source [^1]
- A function that converts an input (or ‘message’) into a fixed-size string of bytes. The output, typically a ‘digest,’ is designed to be unique for different inputs. Hashing is commonly used in creating hash tables, cryptography, and checksums.
## Source[^2]
- A technique that is used for organizing tables to permit rapid searching or table lookup, and is particularly useful for tables to which items are added in an unpredictable manner, e.g. the symbol table of a compiler. Each item to be placed in the table has a unique key. To place it in the [[hash table]] a hash function is used, which maps the keys onto a set of integers (the hash values) that range over the table size. The function is chosen to distribute the keys fairly evenly over the table (see HASHING ALGORITHM); since it is not a unique mapping, two different keys may map onto the same integer.
- In the simplest version of the technique, the [[hash value]] identifies a primary position in the table; if this is already occupied, successive positions are examined until a free one is found (treating the table as circular). The item with its key is inserted in the table at this position. To locate an item in the table a similar algorithm is used. The hash value of the key is computed and the table entry at this position is examined. If the key matches the required key, the item has been located; if not, successive table positions are examined until either an entry with a matching key is found or an empty position is found. In the latter case it can be concluded that the key does not exist in the table, since the insertion procedure would have placed it in this empty position. For the technique to work, there must be rather more table positions than there are entries to be accommodated. Provided that the table is not more than $60 \%$ full, an item can on average be located in a hash table by examining at most two table positions.
- More sophisticated techniques can be used to deal with the problem of collisions, which occur when the position indicated by the hash value is already occupied; this improves even further the performance of the table lookup. Table lookup and insertion of new items can be interleaved, but if items are deleted from the table the space they occupied cannot normally be reused.

## Source[^3]
- Hashing means converting data into a fixed-size value (a hash code)
	- #question Does fixed-size value mean hash code?
	- #question What is a hash code?
- In python, `hash("apple")` might return `382930234`. Python would then use this hash to place the item in the right "bucket" in the table
	- #question What exactly is a hash? 
	- #question Is "bucket" the correct term used here? Is there a more official word for it?
## References

[^1]: https://spdload.com/blog/software-development-glossary/
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^3]: ChatGPT