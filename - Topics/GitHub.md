## Synthesis
### How Downloads are Tracked
* GitHub Releases
	- Downloads of each file are tracked when attached to a release, (e.g., an `.exe`, `.dmg`, `.deb`, or custom `.zip` built by your CI/CD)
		* [ ] What is a `.deb?`
		- [ ] What does a custom `.zip` look like? And what would a `CI/CD` look like?
		- [ ] What exactly is a GitHub release?
		- This information is not always displayed on the web interface, but is available through
			- **GitHub REST API** (`api.github.com/repos/{owner}/{repo}/releases` under the `download_count` field) 
			- Through third-party tools like 
				- *GitHub Release Stats*
				- Shields.io badge
				- [ ] What do these 3rd-party tools look like?
	- Downloads of auto-generated source code archives by GitHub  (such as "Source code (.zip)" or "Soruce code (.tar.gz)" for every tag/release are not tracked
- Regular repository downloads (Code $\to$ Download ZIP)
	- No public or cumulative count exists
- Repository clones (`git clone`)
	- Partially tracked, but private and temporary:
		- Within **Insights -> Traffic**, you can see the number of **Git clones** and unique cloners. 
		- It is **private** (the public cannot see it).
		- It only stores data for the **last 14 days** (there is no all-time counter unless you scrape and record it yourself).
			- [ ] By scraping, does this mean you can scrape history of non-visualized data that GitHub holds or would you need to set a point of recording so that you just keep track of it over time on your own?
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