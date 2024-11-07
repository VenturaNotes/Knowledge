[01:01:40](https://www.youtube.com/watch?v=e7BufAVwDiM&t=3700s)

Given 2 files:

helloscript.sh
```bash
#! /bin/bash

MESSAGE="Hello LinuxHint Audience"
export MESSAGE
./secondScript.sh
```

secondScript.sh
```bash
#! /bin/bash

echo "The message from helloScript is : $MESSAGE"
```

by running the first script in terminal, we get the echo message from the second script. It is important to do "chmod +x secondScript.sh" to make it executable
