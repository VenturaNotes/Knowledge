---
aliases:
  - SCC
---
## Synthesis
- 
## Source [^1]
- A form of version control tailored for program code. A number of schemes have been developed to support this idea, all built around the key concept of a code repository. There are three main approaches to how such a repository is used: the first (local data) approach assumes that the code is kept on a single machine, in a directory to which all the relevant programmers have access (see RCS, SCCS); the second (client-server) approach assumes that a master copy of the code resides on one machine and that programmers typically take a copy (pull) onto their own machine, make local changes (commit), and then send these changes back (push) to the owner of the master, who ensures that consistent updates (merge) are carried out to make the changes available to everyone (see CVS, SVN); the third (distributed) approach does not assume the existence of a single master repository, but instead allows everyone to make (clone) and modify their own copy, and to exchange updates freely with others (see DCVS, Git, Mercurial). Typically, a source code control system will record each change as a patch or diff.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]