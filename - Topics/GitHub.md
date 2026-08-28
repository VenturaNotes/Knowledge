## Synthesis

### Contribution Graph Caching & Force-Push "Ghost Commits"
- When Git history is rewritten (using `git filter-branch`, `git rebase -i`, or `git-filter-repo`), Git creates **brand-new cryptographic commit hashes (SHAs)** for every rewritten commit rather than modifying them in place.
- If you force-push history multiple times (e.g. 3 rewrite passes):
	- [ ] Is it 3 rewrite passes or is it actually 3 force-push commits? 
	* Each pass uploads a **new, unique commit SHA** with your author signature.
		* [ ] What is a SHA?
	* GitHub's contribution indexer temporarily records all 3 distinct SHAs for each calendar day.
	* **The Result:** Your profile graph may temporarily display **3x the number of commits** (e.g., showing 3 contributions on days you only made 1 commit).
#### Commit Log vs. Profile Graph (Two Different Views)

| GitHub View                                    | Metric Used        | Behavior After Force-Push                                                              |
| :--------------------------------------------- | :----------------- | :------------------------------------------------------------------------------------- |
| **Commit Log Page** (`/commits/main/`)         | **Committer Date** | Displays the actual linear `main` branch (**1 commit per day**).                       |
| **Profile Contribution Graph** (Green Squares) | **Author Date**    | Counts all unique commit SHAs across all passes (**shows temporary inflated totals**). |

- The old rewritten commits are **"orphaned / dangling objects"** on GitHub's backend servers. They are not in your repository tree, but GitHub's contribution indexer still sees them temporarily.
#### GitHub Automatically Resolves It in 24-48 Hours
1. GitHub runs an automated server-side maintenance task (`git gc`) that purges unreachable, orphaned commit objects.
	- [ ] What is `git gc`? What does the `gc` stand for?
2. The contribution graph background worker reconciles your active `main` branch.
3. Within 24 to 48 hours, all dangling SHAs are discarded from the index, and the daily contribution counts on your profile graph automatically normalize back from 3 $\rightarrow$ 1 commit per day.
#### Preserving Historical Dates During Rewrites
- To prevent rewritten commits from shifting their visual date headers on GitHub's web interface (the commit log page), always lock **Committer Date** to **Author Date**:
	* In Rebase
		* Use `git rebase -i --committer-date-is-author-date HEAD~N`
	* In Filter-Branch
		* Include `--env-filter 'export GIT_COMMITTER_DATE="$GIT_AUTHOR_DATE"'`
## Source [^1]
- 
## References

[^1]: 