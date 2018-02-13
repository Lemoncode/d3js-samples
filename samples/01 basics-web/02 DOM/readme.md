# Playing with selectors

d3js implements a powerful set of selectors, they allows us to manipulate the existing DOM.

# Sample

In this sample we are going to learn how to play with the chrome debugger and how selectors work.

Starting from the previous sample (right before we added the cool styled li).

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div>
      <p>Normal paragraph</p>

      <p class="red">Red paragraph</p>
    </div>

    <ol>
      <li id="some-id">Unique element</li>
      <li>Another list element</li>
      <li>
        <p>Paragraph inside list element</p>
        <p>Second paragraph</p>
      </li>
    </ol>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.5.0/d3.js" charset="utf-8"></script>
    <script src="./main.js"></script>
  </body>
</html>
```

```css
/* Applied to all <p> tags */
p {
  color: blue;
}

/* Applied to all tags with the class "red" */
.red {
  background: red;
}

/* Applied to the tag with the id "some-id" */
#some-id {
  font-style: italic;
}

/* Applied only to <p> tags that are inside <li> tags */
li p {
  color: #0C0;
}
```

- Let's crate a _main.js_ file and add the follwing selectors.

```javascript
// DOM API
document.getElementById('some-id');
// <li id="some-id">Unique element</li>
document.getElementsByTagName('p').length;
// 4
var reds = document.getElementsByClassName('red');
// [<p class="red">Red paragraph</p>]
reds[0].innerText
// "Red paragraph"

// D3 Selection API
d3.select('p').size(); // select() only finds one
// 1
d3.selectAll('p').size(); // selectAll() finds all
// 4
var reds = d3.selectAll('.red');
// [ > Array[1] ]
reds.text();
// "Red paragraph"
```

- Now let's click on the index file and press F12, we are going to start debugging the samples.

