[00:00:55](https://www.youtube.com/watch?v=e7BufAVwDiM&t=55s)

- Control + Option + T opens the terminal on Linux
- **Bash is “Bourne Again SHell”, and is an improvement of the sh (original Bourne shell)**. [^1]
- Bash stands for Bourne-Again SHell

```bash
cat /etc/shells

# It shows all the shells available on your system
# You can use any shell
# Our concern is only bash scripting

which bash
# outputs "/usr/bin/bash" is part of the bash shell
# going to write this part in every script related to bash?

clear
# clears out all the text on screen

cd Desktop/
# opens our folder to Desktop

ls
# shows us the files in the folder we're in

touch helloScript.sh
# creats a script
```

```bash
#! /bin/bash
# The path above is required

echo "hello bash script"
```

```bash
ls -al
# gives the details? 
# It shows that helloscript.sh is not executable


# [-rw-rw-r--](<-rw-rw-r--  1 fox fox    0 Nov 13 18:39 helloscript.sh>)
# This result shows that
	# The owner can only read/write
	# The other groups can only read
	# The public can only read
	# Exectuable permissions are not there

chmod +x helloscript.sh
# The +x adds the executable permissions

#When doing ls -al again, we get this:
# -rwxrwxr-x  1 fox fox   39 Nov 13 19:21 helloscript.sh
# The helloscript.sh changed color and now it is executable

./helloscript.sh

# this prints the script




```

## References

[^1]: https://askubuntu.com/questions/579085/gedit-not-working-even-though-its-installed-in-ubuntu-14-10#:~:text=sudo%20apt-get%20purge%20gedit%20gedit-common%20sudo%20apt-get%20clean