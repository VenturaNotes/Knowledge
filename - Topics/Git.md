## Synthesis

### Troubleshooting for Unrecognized Git Repository
#### Xcode License Agreement Lockout (macOS)
- On macOS, `git` is bundled with Apple's Xcode Command Line Tools. Whenever macOS or Xcode updates in the background, Apple temporarily locks down developer tools like `git` until you accept the new license agreement. 
- Type `git status` in the repository to check what might be causing the error: 
```
You have not agreed to the Xcode and Apple SDKs license. You must agree to the license below in order to use Xcode.
Press enter to display the license:
```
- To accept the license, you can just run the command `sudo xcodebuild -license` and you would need to type `agree` later to actually accept it. 
	- Or you could just do `sudo xcodebuild -license accept`
## Source [^1]
- A distributed version control system that is widely used in software development for tracking changes in source code during software development.
## Source[^2]
- A distributed source code control system, developed by Linus Torvalds in 2005 and now maintained as open-source by the Git community. It is currently (2014) the most popular distributed SCC system in use globally.
## References

[^1]: https://spdload.com/blog/software-development-glossary/
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]