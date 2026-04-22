---
Source:
  - https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/
Reviewed: false
Approaches: "1"
---
## Synthesis
### Problem
- Given
	- `s` = string
	- `k` = integer
- Return maximum number of vowel letters in any substring of `s` with length `k`.
- Vowel letters in English are `'a'`, `'e'`, `'i'`, `'o'`, and `'u'`.

**Example 1:**

```
Input: s = "abciiidef", k = 3
Output: 3
Explanation: The substring "iii" contains 3 vowel letters.
```

**Example 2:**

```
Input: s = "aeiou", k = 2
Output: 2
Explanation: Any substring of length 2 contains 2 vowels.
```

**Example 3:**

```
Input: s = "leetcode", k = 3
Output: 2
Explanation: "lee", "eet" and "ode" contain 2 vowels.
```

**Constraints:**
- $1 \le \text{s.length} \le 10^5$ 
- `s` consists of lowercase English letters.
- `1 <= k <= s.length`

### Solution
```python
class Solution:
    def maxVowels(self, s: str, k: int) -> int:
        hash_set = {'a', 'e', 'i', 'o', 'u'}
        max_occurrence = 0
        previous_occurrence = 0
        for i in range(k):
	        if s[i] in hash_set:
		        previous_occurrence += 1
		        max_occurrence += 1
        for i in range(k,len(s)):
            if s[i-k] in hash_set:
                previous_occurrence -= 1
            if s[i] in hash_set:
                previous_occurrence += 1
            if previous_occurrence > max_occurrence:
                max_occurrence = previous_occurrence
        return max_occurrence
```
## Source [^1]
- 
## References

[^1]: 