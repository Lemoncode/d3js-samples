# Intro

Let's play now with events and javascript.

# Sample

Let's create the following HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1 id="click-me">
      Click on me!
    </h1>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.5.0/d3.js" charset="utf-8"></script>
    <script src="./main.js"></script>
  </body>
</html>
```

- Now on the javascript side let's create a _main.js_ file and add the following hook to react
when the user clicks on the h1 tag with the id "click-me". This time we will use standard DOM access.

_main.js_

```javascript
var clickMe = document.getElementById('click-me');
clickMe.onclick = function() {
  if (this.style.backgroundColor) {
    this.style.backgroundColor = '';
  } else {
    this.style.backgroundColor = 'red';
  }
}
```

- Now let's add to the HTML some paragraphs with a given class.

_index.html_

```javascript
    <p class="hover-me">
      Hover over me!
    </p>

    <p class="hover-me">
      OK now hover over here!
    </p>

    <p class="hover-me">
      Hover here too!
    </p>
```

- Let's jump to the HTML and using d3 selectores let's react mouse over on any of this elements.

_main.js_

```javascript
// D3 Selection API. Note: it attaches the
// callbacks to each element in the selection
d3.selectAll('.hover-me')
  .on('mouseover', function() {
    this.style.backgroundColor = 'yellow';
  })
  .on('mouseleave', function() {
    this.style.backgroundColor = '';
  });
```