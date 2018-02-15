# Intro

Let's start playing with vector graphics, we will use the SVG HTML standard.

# Steps

- Let's start by creating an index.html

_index.html_

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
  </body>
</html>
```

- Now let's create an SVG container

_index.html_

```diff
  <body>
+    <svg width="300" height="180">
+    </svg>  
  </body>
```

- Let's draw a circle

_index.html_

```diff
    <svg width="300" height="180">
+      <circle cx="30"  cy="50" r="25" />
    </svg>
```

- SVG elements support CSS styling (altough some class names are different to what we are used):

_styles.css_

```css
.red {
  fill: red; /* not background-color! */
}
```

_index.html_

```diff
    <svg width="300" height="180">
      <circle cx="30"  cy="50" r="25" />
+      <circle cx="90"  cy="50" r="25" class="red" />
    </svg>
  </body>
</html>
```

- Let's paint some styles rectangles.

```diff
.red {
  fill: red; /* not background-color! */
}

+ .fancy {
+   fill: none;
+   stroke: black; /* similar to border-color */
+   stroke-width: 3pt; /* similar to border-width */
+   stroke-dasharray: 3,5,10;
+ }
```

```diff
    <svg width="300" height="180">
      <circle cx="30"  cy="50" r="25" />
      <circle cx="90"  cy="50" r="25" class="red" />
      <circle cx="150" cy="50" r="25" class="fancy" />

+      <rect x="10"  y="80" width="40" height="40"
+        fill="steelBlue" />
+      <rect x="70"  y="80" width="40" height="40"
+        style="fill: steelBlue" />
+      <rect x="130" y="80" width="40" height="40"
+        class="fancy" />
    </svg>
```

