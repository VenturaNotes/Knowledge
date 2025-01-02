---
Source:
  - https://leetcode.com/problems/design-twitter/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-23 at 9.10.06 PM.png]]
- Similar to another leetcode problem called Merge K Sorted List
	- Even though the "Design Twitter" is a medium problem, it is harder than the hard problem above
- Need to have an understanding of tradeoffs
- Can use a [[HashSet]] which inserts and removes in O(1) time
	- Will map each userId to a HashSet of `followeeIDs`
- [[HashMap]]
- Will use [[min heap]]
	- Doesn't really change overall time complexity but if you had to receive `n` most recent tweets, it would be better
- [[Java]] has a max hap but python does not
```python
class Twitter:

    def __init__(self):
        self.count = 0
        self.tweetMap = defaultdict(list) # userId -> list of [count, tweetIds]
        self.followMap = defaultdict(set) # userId -> set of followeeId

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweetMap[userId].append([self.count, tweetId])
        self.count -= 1
        

    def getNewsFeed(self, userId: int) -> List[int]:
        res = [] # orderd starting from recent
        minHeap = []

        self.followMap[userId].add(userId) # have to add yourself to follower map
        for followeeId in self.followMap[userId]:
            if followeeId in self.tweetMap:
                index = len(self.tweetMap[followeeId]) - 1
                count, tweetId = self.tweetMap[followeeId][index]
                minHeap.append([count, tweetId, followeeId, index - 1])
        heapq.heapify(minHeap)
        while minHeap and len(res) < 10:
            count, tweetId, followeeId, index = heapq.heappop(minHeap)
            res.append(tweetId)
            if index >= 0:
                count, tweetId = self.tweetMap[followeeId][index]
                heapq.heappush(minHeap, [count, tweetId, followeeId, index - 1])
        return res
        
    def follow(self, followerId: int, followeeId: int) -> None:
        self.followMap[followerId].add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        if followeeId in self.followMap[followerId]:
            self.followMap[followerId].remove(followeeId)
```
## References

[^1]: https://www.youtube.com/watch?v=pNichitDD2E