# CSS basics

Let's create a very basic sample and play a bit with CSS

# Sample

- Let's start by creating our basic _index.html_ file

_index.html_

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
  </body>
</html>
```

- Let's create an empty filed called _styles.css_

- Now it's time to define the metadata content in the _head_ section.

```diff
<!DOCTYPE html>
<html>
  <head>
+    <meta charset="utf-8">
+    <title></title>
+    <link rel="stylesheet" href="styles.css" />  
  </head>
  <body>
  </body>
</html>
```

We have just set the chartset to UTF8 (to avoid issues with tilde and addition characters), and imported the
_styles.css_ file that we have previously created.

- Next step we are going to add normal paragraph to the body section.

```diff
  <body>
+    <div>
+      <p>Normal paragraph</p>    
+    </div>
  </body>
```

- Now let's add a new paragraph that will use a class that will place the background in red.

_./styles.css_

```css
/* Applied to all tags with the class "red" */
.red {
  background: red;
}
```

_./index.html_

```diff
  <body>
    <div>
      <p>Normal paragraph</p>

+      <p class="red">Red paragraph</p>
    </div>
```

- Now let's cover a bit more complex scenario:

```html
    <ol>
      <li>Unique element</li>
      <li>Another list element</li>
      <li>
        <p>Paragraph inside list element</p>
        <p>Second paragraph</p>
      </li>
    </ol>
```

Let's say we want to highlight in green all the paragrapsh that are inside an li element.

_styles.css_

```css
/* Applied only to <p> tags that are inside <li> tags */
li p {
  color: #0C0;
}
```

- And now we want to highlight an specific element (italic, by id).

_styles.css_

```css
/* Applied to the tag with the id "some-id" */
#some-id {
  font-style: italic;
}
```

_index.html_

```html
  <ol>
    <li id="some-id">Unique element</li>
    <li>Another list element</li>
    <li>
      <p>Paragraph inside list element</p>
      <p>Second paragraph</p>
    </li>
  </ol>
```

- Ok, we learnt something... but the result was quite ugly, let's add some nice design.
Let's remove the current list, and create a new one

```diff
- <ol>
-  <li id="some-id">Unique element</li>
-  <li>Another list element</li>
-  <li>
-    <p>Paragraph inside list element</p>
-    <p>Second paragraph</p>
-  </li>
- </ol>
+ <ul>
+   <li><a href="#">CSS basics</a></li>
+   <li><a href="#">Javascript concepts</a></li>
+   <li><a href="#">Bundling</a></li>
+   <li><a href="#">Frameworks</a></li>
+   <li><a href="#">Testing</a></li>
+   <li><a href="#">REST API</a></li>
+   <li><a href="#">Cloud</a></li>
+ </ul>
```

- From the CSS let's remove the styles we have created and add the following

```diff
- /* Applied to all tags with the class "red" */
- .red {
-  background: red;
- }

- /* Applied to the tag with the id "some-id" */
- #some-id {
-   font-style: italic;
- }

- /* Applied only to <p> tags that are inside <li> tags */
- li p {
-  color: #0C0;
- }
 
+ h2 {
+  font: 400 40px/1.5 Helvetica, Verdana, sans-serif;
+  margin: 0;
+  padding: 0;
+ }
+
+ ul {
+  list-style-type: none;
+  margin: 0;
+  padding: 0;
+ }
+ 
+ li {
+  font: 200 20px/1.5 Helvetica, Verdana, sans-serif;
+  border-bottom: 1px solid #ccc;
+ }
+ 
+ li:last-child {
+  border: none;
+ }
+ 
+ li a {
+  text-decoration: none;
+  color: #000;
+  display: block;
+  width: 100%;
+ 
+  -webkit-transition: font-size 0.3s ease, background-color 0.3s ease;
+  -moz-transition: font-size 0.3s ease, background-color 0.3s ease;
+  -o-transition: font-size 0.3s ease, background-color 0.3s ease;
+  -ms-transition: font-size 0.3s ease, background-color 0.3s ease;
+  transition: font-size 0.3s ease, background-color 0.3s ease;
+}
+ 
+li a:hover {
+  font-size: 30px;
+  background: #f6f6f6;
+}
```





