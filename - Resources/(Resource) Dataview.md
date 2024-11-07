- SORT Length ASC 
	- This sorts a list of type Length by ascending order
- SORT Length DESC
	- This sorts a list of type Length by descending order
- Could use anki tag to determine if a 
- Will use Studied tag to indicate if a topic has been thoroughly practiced or researched to by degree

## Returns List of backlinks where \#studied tag not found and no duplicates returned and in order within document
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
## Finds if a \#question tag exists in backlink (doesn't need to be in YAML format) Not in order of document
```dataview 
LIST 
FROM outgoing([[]]) and #question
```

- Able to write a query within the document
```query
file:"Home Page - Programming Rust 2nd Edition by O'Reilly" tag:#question
```