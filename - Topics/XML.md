---
aliases:
  - Extensible Markup Language
---
## Synthesis
- 
## Source [^1]
- A simplified form of SGML. See feature XML. See also SAX, SOAP, XPATH, XQUERY.

http://www.w3.org/XML/

  

- The W3C's XML page

  
  

# XML

  

XML (extensible markup language) is a simplified and extended form of SGML designed especially for use on the Web. Since its release in 1998, it has become very widely used in the computer industry. A simple example of XML data is the entry for 'Ruby' in this dictionary:

$<$ en $><$ cod $>$ N08/PL $</$ cod $>$

$<$ hw $>$ Ruby $</$ hw $>$

<def>An interpreted <xr>object-oriented programming language</xr> that includes features of both $<\mathrm{xr}>$ imperative $</ \mathrm{xr}>$ and $<\mathrm{xr}>$ functional languages $</ \mathrm{xr}>$. Created by Yukihiro Matsumoto and released in 1995, it was influenced by such languages as $<\mathrm{xr}>$ Perl $</ \mathrm{xr}\rangle,<\mathrm{xr}>$ Smalltalk $</ \mathrm{xr}\rangle,<\mathrm{xr}>$ Eiffel $</ \mathrm{xr}\rangle,<\mathrm{xr}>$ Ada $</ \mathrm{xr}\rangle$, and $<\mathrm{xr}>$ Lisp $</ \mathrm{xr}>$. Its combination of elegance and apparent simplicity with underlying power has gained Ruby an steadily increasing popularity, especially through the $<$ he $>$ Ruby On Rails $</$ he $>$ web application $<\mathrm{xr}>$ framework $</ \mathrm{xr}\rangle .</$ def $></$ en $>$

  

The content of the entry is divided into its logical components by tags: the whole entry is enclosed in ' $<$ en $>\ldots</$ en $>$ ' tags; the entry's headword by ' $<$ hw $>\ldots</$ hw $>$ ' tags; the entry's definition by ' $<$ def $>\ldots</$ def $>$ ' tags. Cross-references to other headwords giving further information are enclosed in ' $<\mathrm{xr}>\ldots</ \mathrm{xr}>$ ' tags. A subsidiary term that is defined within this main definition (a so-called 'hidden entry') is enclosed by ' $<$ he $>\ldots$ $</$ he $>$ ' tags. Some behind-the-scenes classification coding uses ' $<$ cod $>\ldots</$ cod $>$ ' tags.

  

# Elements

  

In XML terminology each pair of tags delimits an element. Elements normally begin with a start tag, which has the form ' $<$ tagname $>$ ', and end with a matching end tag, which has the form ' $<$ /tagname $>$ '. If the element has no content, the sequence '<tagname></tagname>' may be abbreviated to '<tagname/>'. Elements may appear within other elements, but they must be properly nested; that is, an element's own end tag must appear before those of any elements that enclose it:

...web application $<\mathrm{xr}>$ framework $</ \mathrm{xr}\rangle .</$ def $></$ en $>$

is valid XML, but

...web application $<\mathrm{xr}>$ framework. $</$ def $></ \mathrm{xr}\rangle</$ en $>$

is not valid because the elements overlap.

Also, at the top level, the whole of an XML document must consist of a single element (the root element) that encloses all its content. An XML document that obeys these rules is said to be well-formed. Where possible, text is tagged for its information content. Tagging text for its format, as in HTML ( $<\mathrm{i}>$ for italic, $<\mathrm{b}>$ for bold, etc.), is deprecated unless absolutely unavoidable.

  

# Attributes

  

Further information may be associated with an XML element in the form of attributes. These are held as key-value pairs within the start tag:

<ElementName attribute1="value1" attribute2="value2">

In general attributes are intended to hold metadata about an element rather than content of the element. This distinction is sometimes not useful in practice; whether a particular piece of data should be held as an attribute or in the element's content is often a decision to be made by the document's designer. For instance, the information in the $'<\operatorname{cod}>\ldots</ \operatorname{cod}>$ ' element in the example given above could equally well be coded as an attribute of the '<en>' element:

$<$ en cod="N08/PL">

or perhaps by:

<en update="new 2008" topic="programming language">

  

# UTF-8 and character entities

  

By default XML documents are encoded in UFTF-8; other encoding systems, such as UTF-16, are also recognized. These allow XML documents to utilize the full range of the Unicode character set. Alternatively, character entities may be used to represent any character. Either \&\#xhhhh; is used, where hhhh is the Unicode hexadecimal value, or \&\#ddd;, where ddd is an equivalent decimal value. For example:

  

| open double quotes | $\left(^{}\right)$ | \&\#x0093; | \&\#147; |

| :--: | :--: | :--: | :--: |

| close double quotes | () | \&\#x0094; | \&\#148; |

| lower-case acute e | @) | \&\#x00E9; | \&\#233; |

| upper-case acute E | (E) | \&\#x00C9; | \&\#201; |

| lower-case delta | (8) | \&\#x03B4; | \&\#948; |

| upper-case delta | ( $\Delta$ ) | \&\#x0394; | \&\#916; |

  

If a real ampersand is required \& is used. Similarly the 'less than' symbol ( $<$ ) is < and the 'greater than' symbol $(>)$ is $>$.

  

# Document type definition

  

XML documents may be associated with another document that defines which elements can appear and where. This second document can be a document type definition (see DTD) or an XML schema. The section of this dictionary's DTD that defines the structure of an 'en' element might look like this:

$<$ !ELEMENT en (cod, hw, def)>

This means that every 'en' element must contain exactly one 'cod' element, followed by one 'hw' element, followed by one 'def' element. Changing this definition to

<!ELEMENT en (cod?, hw, def+)>

would make the 'cod' element optional and would allow one or more 'def' elements. An XML document whose content is not only well-formed but also matches the structure laid down by its DTD or schema is said to be valid. Most XML parsers will check a document's validity and report any errors.

  

XML documents are associated with a particular DTD by a declaration at the head of the document. This can refer to a disk file or to an Internet address. The latter facility makes ensuring conformance to international standards very simple. For example, the declaration:

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"

"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"

refers to the strict version of the W3C's DTD for XHTML 1.0.

XML schemas are more flexible and more powerful than DTDs; in particular, individual elements within a document can refer to different schemas.

  

The power of XML lies in the flexibility with which its rules can be applied to create document types suited to many purposes that nevertheless all use the same system of nested elements and attributes. As well as storing dictionary data and other text, XML is used for such different applications as RSS web feeds and specifying the interfaces of web services. Yet data for all these document types can be manipulated according to standard models using publicly available utilities. For example, all XML documents can be validated and parsed into a form that software can manipulate (usually a tree of objects, such as that specified by the Document Object Model); they can be transformed into another structure using an XSLT processor; and so on. There is usually no need to write bespoke software for these common tasks, which immediately gives XML a cost and efficiency advantage. Also, all XML data is held as Unicode text and so is platform-independent.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]