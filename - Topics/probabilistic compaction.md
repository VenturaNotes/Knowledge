## Synthesis
- 
## Source [^1]
- (probabilistic compression) A data compaction code in which the encoding (and therefore decoding) table is constructed using a previously formed estimate of the probabilities of the symbols in the messages-files or data stream —intended for future compaction (compare STATISTICAL COMPACTION).
- The decoding table need not be stored or transmitted along with the compacted text, since it need be recorded only once within the filing system, or made known only once to the receiver of the data stream, for all future files or messages. The disadvantage, however, of probabilistic compaction is that no one estimate of probabilities will be a perfect fit with the statistics of any given file or message. A useful compromise is to have a set of probability tables, each tailored to one kind of data (source programs, object programs, plaintext, and so on); this is called generic compaction.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]