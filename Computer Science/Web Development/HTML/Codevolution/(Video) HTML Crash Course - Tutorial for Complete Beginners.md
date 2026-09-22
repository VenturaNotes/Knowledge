---
Source:
  - https://www.youtube.com/watch?v=N8YMl4Ezp4g
Length: 56 minutes, 51 seconds
tags:
  - type/video
  - status/complete
---
- ![[Screenshot 2023-11-27 at 1.09.31 AM.png]]
	- [[HTML]] Crash Course
		- Building Websites
			- [[HTML]] which is responsible for the structure of your website
			- [[CSS]] which is responsible for the presentation of your website
			- [[JavaScript]] which is responsible for handling interactivity
	- Before we begin
		- This course is for complete beginners
		- I will cover most of the concepts in HTML that you as a beginner should know
		- This crash course is going to focus only on HTML
		- Unlike other videos in my channel, this is a crash course and is longer in length
- ![[Screenshot 2023-11-27 at 2.11.01 AM.png]]
	- Setup
		- Install visual studio code (pretty much best editor out there)
			-  https://code.visualstudio.com/
		- Install an extension to help format code we write
			- `Prettier - Code formatter`
	- What is HTML?
		- [[HTML]] stands for hypertext markup language and is the language for creating web pages
		- It is a [[markup language]] and not a [[programming language]]
		- We "mark" certain things in the code we write which tells the web browser how to structure the web page
		- It does not contain any logic like conditionals or branching
		- HTML consists of a series of elements and each element tells the browser how to display the content
	- An HTML file has the extension `.html`
		- `index.html` is the convention
	- [[HTML element]]
		- An HTML element is the building block of an HTML document
```HTML
<tagname> Content goes here </tagname>

<!-- Able to contain one element as content of another element -->
<tagname>
	<tagname> Content goes here </tagname>
</tagname>
```

```HTML
<!-- Informs browser that the document is an HTML document -->
<!DOCTYPE html>

<!-- The HTML element wraps all the content and is known as the root element-->
<html>
<!-- head is where we want content we want included in HTML page but not presented to the user-->
	<head>
<!-- Title of HTML page and appears in browser tab-->
		<title> HTML Crash Course </title>

	</head>
<!-- Can specify text from before-->
	<body>
	Welcome to HTML
	
	</body>
</html>
```

- [[root element]]
- Pressing `Control + Shift + P` and then click `Format Document` to prettify it up
	- `Alt + Shift + F` is the keyboard shortcut to format the document
- Basic HTML document structure we need to keep in mind
	- Type
	- Enclosing HTML tag
	- Head tag for information (not presented to user)
	- Bod tag (content that should be presented to user)
- ![[Screenshot 2023-11-27 at 2.22.48 AM.png]]
	- Formatting Text in HTML
	- HTML gives heading and paragraph elements for some basic structuring of the text
	- HTML headings are titles or subtitles that you want to display on a web page
		- 6 [[heading element|heading elements]] in total
			- For `<h1> Heading 1 </h1>` is larger and bold
				- Corresponds to the title of webpage and good practice to only have 1 H1 tag per page
			- `<h2> Heading 2 </h2>`
				- Usually used for subheadings
			- `<h3> Heading 3 </h3>`
			- `<h4> Heading 4 </h4>`
			- `<h5> Heading 5 </h5>`
			- `<h6> Heading 6 </h6>`
			- Each heading starts a new line and also has some spacing at the bottom to separate from the content below
		- [[Paragraph element]]
			- `<p> this is a paragraph </p>`
				- Always starts on a new line
					- Also adds a little spacing to content below
				- Is usually a block of text
					- Such as product descriptions
	- `Shift + alt + down arrow` duplicates current line of code to next line
	- In [[VS Code]], typing `Lorem` + enter creates a paragraph of text
	- Can separate content by either doing `<br />` or `<br>`
		- This will make the following text start on a new line
	- The horizontal rule is a self-closing tag
		- `<hr />`
- ![[Screenshot 2023-11-28 at 9.36.44 AM.png]]
	- Inline formatting of text
	- HTML provides a few elements to format text in a certain way
		- First one is the strong tag (used to add importance to text)
			- Such content will be displayed in bold to the user
			- `<strong> Nice </strong>`
				- Could substitute with `<b> Nice </b>` for bold
		- Next tag is the emphasis tag, used to stress on certain words
			- It italicize the text
			- `<em> Nice </em>`
				- Could substitute with `<i> Nice </i>` for italicized
		- Using `<b>` and `<i>`
			- Carries no semantic meaning and is not good for a search engine or for a screen reader which reads out the text for people with vision impairment
	- `<small> Note </small>`
		- Used to define smaller texts
	- `<mark> Note </mark>`
		- Used to highlight text
	- `<del> Note </del>`
		- Used for strikethrough
		- Used to show intentional correction
	- `<ins> Note </ins>`
		- Underline text
	- `<sub> Note </sub>`
		- Subscripts
	- `<sup> Note </sup>`
		- Superscripts
	- Formatting tags don't start on a new line
- ![[Screenshot 2023-11-28 at 9.49.23 AM.png]]
	- Two default display values of HTML elements
		- Elements can be block level or inline
			- A [[block-level element]] always starts on a new line and takes up the full width available
				- [[Division element]]
					- `<div> Note </div>`
			- An [[inline element]] does not start on a new line and only takes up as much width as necessary (such as just width of text)
				- Now we have [[span element]]
					- `<span> Note </span>`
	- Very useful when adding styles to a group of elements or only a portion of the element
		- These tags will be revisited in the CSS crash course

## Lists
- ![[Screenshot 2023-11-28 at 9.55.42 AM.png]]
- HTML provides 3 different types of lists
	- [[Unordered list]]
		- List of items where order does not matter
		- `<ul> </ul>`
			- This is for an unordered list
			- As content for this tag, we specify individual items using list item tag
				- `<li> Bread </li>`
		- Will be marked with bullet points by default
	- [[Ordered list]]
		- `<ol></ol>`
			- `<li> React point A </li>`
		- Will be marked with numbers by default
	- [[Description list]]: list of terms with description of each term
		- Has 3 tags
		- Wrap with a definition list tag
			- `<dl> </dl>`
				- To add term: `<dt> </dt>`
				- To add definition: `<dd> </dd>`

## HTML Attributes
- ![[Screenshot 2023-11-28 at 10.10.18 AM.png]]
- [[HTML attribute]]
	- Provides additional information about HTML elements
	- HTML elements can have attributes
- Two elements where attribute defines element itself
	- [[Image element]]: Used to embed image in webpage
		- Image tag doesn't need closing tag (it's self-closing)
		- To connect file with image element, need src attribute (source)
			- Path to file is assigned
		- `<img src="logo.jpg"/>`
			- Source attribute is mandatory
		- Two more attributes to restrict dimensions (height, width)
			- Default unit is pixels
			- `<img src="logo.jpg" width="200" height="200"/>`
		- alt attribute
			- Picked up by screen readers. Used to describe image to visually impaired people
			- `<img src="logo.jpg" width="200" height="200" alt="Codevolution logo"/>`
		- [[Anchor tag]]: Used to create hyperlinks to other pages
			- `<a>href='https://google.com" target="_blank"> Google </a>`
				- href specifies the address we need to navigate to
				- "Google" is clickable text shown on screen taking you to the href
				- Cursor turns into pointer upon hovering
				- The `target=_blank` opens link in new tab 
			- Could link between two pages in our own folder
- When creating a new html document such as "contact.html", in the file, typing `! + tab` will populate a sample HTML document
	- `<a href="contact.html">Contact</a>`

## HTML Tables
- `<tr>` is short for table row
- `<th>` is table heading
	- Great for column headings
	- Text will be in bold
- `<td>` Defines a table cell [^1]
```HTML
 <table>
    <thead>
      <tr>
        <th> Heading 1</th>
        <th> Heading 2</th>
        <th> Heading 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
        <td>Data 3</td>
      </tr>
      <tr>
        <td>Data 4</td>
        <td>Data 5</td>
        <td>Data 6</td>
      </tr>
      <tr>
        <td>Data 7</td>
        <td>Data 8</td>
        <td>Data 9</td>
      </tr>
    </tbody>
   </table>
```
Output:
- ![[Screenshot 2023-11-28 at 10.17.35 AM.png|300]]

## HTML Forms
- Want to collect data from user
	- User details in a registration form or personal details when applying for a bank account. 
	- Forms allows users to enter data which is generally sent to a web server for processing and storage
		- Will only focus on HTML part of a web form and not processing data (need more than just HTML for this)
- `<form> </form>`
- `<label> </label>`
	- Displays input label
- `<input type="text" />`
	- Allows for text input
- Good practice of [[form control]]
	- One would be tying the label with the input
```HTML
<form>
	<label for="username">Username</label><br />
	<input type="text" id="username" /><br /><br />
</form>
```
- The "for" attribute in label is telling us it is for the "input" with `id="username"`. When clicking on label, it focuses the input element
- Break tags just written for spacing
- [[Textarea element]]
	- Collects larger text from user
- Select tag
	- Specifies different options
	- For `<option value='india'>India</option>`
		- `India` is displayed to the user and `india` is the value sent to the server
	- Basically a drop-down list
- [[Radio button group]]: Allows user to select one value from many options
- Use checkboxes instead of radio buttons if you want user to be able to select both options

```HTML
<form>
      <label for="username">Username</label> <br />
      <input type="text" id="username" /> <br />
      <br />

      <label for="about"> About You</label><br />
      <textarea id="about"></textarea><br />
      <br/>

      <label for="country">Country </label><br />
      <select id="country">
        <option value="india">India</option>
        <option value="singapore">Singapore</option>
        <option value="vietam">Vietnam</option>
      </select><br /> <br />

      <label>Job Type</label> <br />
      <input type="radio" name="jobtype" value="parttime" id ="parttime" />
      <label for="parttime">Part Time</label>
      <br />
      <input type="radio" name="jobtype" value="fulltime" id ="fulltime" />
      <label for="fulltime">Full Time</label>
      <br /><br />

      <label>Job Type</label> <br />
      <input type="checkbox" name="jobtypecb" value="parttime" id ="parttimecb"/>
      <label for="parttimecb">Part Time</label>
      <br />
      <input type="checkbox" name="jobtypecb" value="fulltime" id ="fulltimecb"/>
      <label for="fulltimecb">Full Time</label>
      <br /><br />

      <!-- Send all data to the server. This part is out of scope for HTML -->
      <button>Submit</button>
      
    </form>
```
- Output:
- ![[Screenshot 2023-11-28 at 4.47.01 PM.png|200]]
## Semantic HTML
- ![[Screenshot 2023-11-28 at 4.54.22 PM.png]]
- [[Semantic HTML]]
	- When grouping elements or content in webpage, it is possible to use div and span tags
	- However, these tags tell nothing about their content
	- A semantic element clearly describe their meaning in a human and machine-readable way
		- In HTML5, there are roughly 100 semantic elements
- Page Layout (typical for most webpages)
	- `<header>`
		- For headers
	- `<nav>`
		- Navigation bar (links to home, about services)
	- `<section>`
		- Defines a section of the page. An intro, contact info, etc.
	- `<article>`
		- Used for blog posts, product cards, user comments, newspaper articles
	- `<aside>`
		- Used to define content, aside from main content. Side bar where we can highlight recent or featured blog posts
	- `<footer>`
		- Used for links in webpage 
			- Privacy policy, copyright info, sitemap, etc.
- Semantic HTML Advantages
	- Suggests to the developer the type of data that will be populated
	- Semantic HTML helps search engines to influence the page search rankings
	- Screen readers can use this as a signpost to help visually impaired users navigate a page
	- Important for an interview point of view as well

## Header Tag
- Part that is not displayed in web browser when page loaded
	- Does contain title and metadata about html document
	- Tag used to describe metadata is `<meta>`
		- `<meta charset="utf-8"/>`
			- utf-8 is the universal character set that includes any character from any human language
			- Webpage will be able to handle displaying any language and therefore a good idea to set this on every webpage you create
		- `<meta name="author" content='Codevoultion'/>`
			- Author of page
		- `<meta name='description'content='This webpage aims to provide complete beginners information about HTML fundamentals.'/>`
			- SEO purpose (page description)
		- `<meta name='viewport' content="width=device-width, initial-scale=1.0"/>`
			- Setting the viewport
			- Ensures webpage width adapts to device viewport and sets the initial scale
- There are also script and style tags which can be included in the head section
	- Style tag more than script tag (has to do more with CSS and Javascript)
## References
[^1]: https://www.w3schools.com/tags/tag_table.asp#:~:text=An%20HTML%20table%20consists%20of,%2C%20and%20elements.