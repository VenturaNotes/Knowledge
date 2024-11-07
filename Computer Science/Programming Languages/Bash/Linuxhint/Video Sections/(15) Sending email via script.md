[01:58:42](https://www.youtube.com/watch?v=e7BufAVwDiM&t=7122s)

- "sudo apt install ssmpt" in terminal
- Must go to google security tab and turn the access on
- sudo gedit /etc/ssmtp/ssmtp.conf
	- You must use Two-factor authentication in gmail to get the password you want to use that you set up for the specific app
```bash
root=venturanotes@gmail.com
mailhub=smtp.gmail.com:587
AuthUser=<put gmail address here>
AuthPass=<put password google generated password here>
UseSTARTTLS=yes
```
- script to send email (helloscript.sh)
```bash
#! /bin/bash

ssmtp venturanotes@gmail.com
```
- In terminal:
	- ./helloscript.sh
	
```terminal
To: venturanotes@gmail.com
From: venturanotes@gmail.com
Cc: venturanotes@gmail.com
Subject: test
This is the body
```
- Then press "control + d" to send the email
- you can use sendmail, mail, mailx
- to also send others mail instead of ssmtp


Notes:
- "sudo apt-get remove ssmtp" removes the ssmtp installation
- You can do "open + (foldername)" to get open a folder in terminal
- "sudo apt-get update" is good to update apt
- Clean up gedit [^1]
	- "sudo apt-get purge gedit gedit-common"
	- "sudo apt-get clean"
	- "sudo apt-get install gedit"

## References

[^1]: https://askubuntu.com/questions/579085/gedit-not-working-even-though-its-installed-in-ubuntu-14-10#:~:text=sudo%20apt-get%20purge%20gedit%20gedit-common%20sudo%20apt-get%20clean