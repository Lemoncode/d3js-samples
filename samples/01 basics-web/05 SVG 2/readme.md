# Path and transformations

Let's play a bit with paths and transformation.

# Steps

- Let's define our initial HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <svg width="800" height="600">      
    </svg>
  </body>
</html>
```

- In SVG we can create a group of element and apply transformations (translations, rotations...), let' draw some text.

_index.html_

```diff
<svg width="300" height="180">
+  <g transform="translate(5, 15)">
+    <text x="0" y="0">Howdy!</text>
+  </g>
</svg>
```

- One interesting element is the polygon path:

```html
  <g transform="translate(5, 55)">
    <!-- M: move to (jump)
         L: line to
         Q: curve to (quadratic) -->
    <path d="M0,50 L50,0 Q100,0 100,50"
      fill="none" stroke-width="3" stroke="black" />
  </g>
```

- You can as well close the curve:

```html
  <g transform="translate(5, 105)">
    <!-- C: curve to (cubic)
         Z: close shape -->
    <path d="M0,100 C0,0 25,0 125,100 Z" fill="black" />
  </g>
```

> Let's play with the transformations, one of the things we can do is to rotate the shape:

https://developer.mozilla.org/es/docs/Web/SVG/Attribute/transform