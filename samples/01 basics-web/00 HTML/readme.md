# Basic HTML

Let's start creating a very basic HTML file.

# Steps

- Let's create a very basic structure

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
  </body>
</html>
```

Let's check each tag:

_DocType_

```html
<!DOCTYPE html>
```

The <!DOCTYPE> declaration must be the very first thing in your HTML document, before the <html> tag.

The <!DOCTYPE> declaration is not an HTML tag; it is an instruction to the web browser about what version of HTML the page is written in.

More info: https://www.w3schools.com/tags/tag_doctype.asp

_html_

The <html> tag tells the browser that this is an HTML document.

The <html> tag represents the root of an HTML document.

The <html> tag is the container for all other HTML elements (except for the <!DOCTYPE> tag).

More info: https://www.w3schools.com/tags/tag_html.asp

_head_

The <head> element is a container for all the head elements.

The <head> element can include a title for the document, scripts, styles, meta information, and more.

More info: https://www.w3schools.com/tags/tag_head.asp

_meta_

Metadata is data (information) about data.

```html
<head>
  <meta charset="UTF-8">
  <meta name="description" content="Free Web tutorials">
  <meta name="keywords" content="HTML,CSS,XML,JavaScript">
  <meta name="author" content="John Doe">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
```

The <meta> tag provides metadata about the HTML document. Metadata will not be displayed on the page, but will be machine parsable.

Meta elements are typically used to specify page description, keywords, author of the document, last modified, and other metadata.

More info: https://www.w3schools.com/tags/tag_meta.asp

_body_

The <body> tag defines the document's body.

The <body> element contains all the contents of an HTML document, such as text, hyperlinks, images, tables, lists, etc.

```html
  <body>
    <p>
      MAIN CONTENT GOES HERE
    </p>

    <p>
      <a href="https://www.w3schools.com/html/">HTML Basics tutorial</a>
    </p>
  </body>
```



