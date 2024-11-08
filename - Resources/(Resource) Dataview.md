- SORT Length ASC 
	- This sorts a list of type Length by ascending order
- SORT Length DESC
	- This sorts a list of type Length by descending order
- Could use anki tag to determine if a 
- Will use Studied tag to indicate if a topic has been thoroughly practiced or researched to by degree

## Returns List of backlinks  in order within document where \#studied not found and no duplicates returned
```dataviewjs
// Get the current file content
let fileContent = await dv.io.load(dv.current().file.path);

// Extract links using a regular expression
let links = fileContent.match(/\[\[([^\]]+)\]\]/g);

// Initialize a Set to store unique filtered links
let filteredLinks = new Set();

if (links) {
    // Filter out links with the #studied tag
    for (let link of links) {
        let linkName = link.slice(2, -2); // Remove the [[ and ]] from the link
        let page = dv.page(linkName);
        if (page && (!page.tags || !page.tags.includes("studied"))) {
            filteredLinks.add(link);
        }
    }
}

// Display the count of filtered links
dv.header(5, `Link Count: ${filteredLinks.size}`);

// Display the links or show "No Links Found"
if (filteredLinks.size > 0) {
    dv.list(Array.from(filteredLinks));
} else {
    dv.paragraph("- NO LINKS FOUND");
}
```
## Finds list of topics not in order of document where  if a \#question exists in backlink (YAML format not needed)
```dataview 
LIST 
FROM outgoing([[]]) and #question
```

- Writing a query within document and finding all the `#questions` within it
```query
file:"Home Page - Programming Rust 2nd Edition by O'Reilly" tag:#question
```