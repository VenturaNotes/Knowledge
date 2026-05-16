module.exports = async (params) => {
    // 1. Get the active file
    const activeFile = app.workspace.getActiveFile();

    if (!activeFile) {
        new Notice("No active file found.");
        return;
    }

    // 2. Read the file content
    const content = await app.vault.read(activeFile);
    
    // 3. Remove Frontmatter
    // This regex looks for the first '---' at the start of the file, 
    // captures everything until the next '---', and removes it.
    const contentWithoutFrontmatter = content.replace(/^---\s*[\s\S]*?\s*---\s*/, "");

    // 4. Define the regex for list items
    // Matches: Bullets (-, *, +) and Numbered (1., 2., etc.)
    // Matches nested items (supports tabs/spaces)
    // Requires a space after the marker to ignore horizontal rules (---)
    const listRegex = /^\s*([-*+]|\d+\.)\s/gm;

    // 5. Count the matches in the cleaned content
    const matches = contentWithoutFrontmatter.match(listRegex);
    const count = matches ? matches.length : 0;

    // 6. Output the result
    new Notice(`Found ${count} items (excluding frontmatter).`);
    
    return count; 
};