[02:05:20](https://www.youtube.com/watch?v=e7BufAVwDiM&t=7520s)

- man curl or curl - help

Download file from online w/ original name and file type
```bash
#! /bin/bash

url="http://speedtest.ftp.otenet.gr/files/test1Mb.db"
# The -O will inherit the actual file name
curl ${url} -O
```

Download file with your unique name
```bash
#! /bin/bash

url="http://speedtest.ftp.otenet.gr/files/test1Mb.db"
# The -o stands for options (new file download)
# You can check the header of file if you want to download data or not
curl ${url} -o NewFileDw
```

in output file on desktop
```bash
#! /bin/bash

url="http://speedtest.ftp.otenet.gr/files/test1Mb.db"
curl ${url} > outputfile
```

Information on file
```bash
#! /bin/bash

url="http://speedtest.ftp.otenet.gr/files/test1Mb.db"
#Gives information of file online
#Helps us make a decision if we want to download file or not
curl -I ${url}
```
