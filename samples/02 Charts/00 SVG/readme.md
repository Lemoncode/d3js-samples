# Trying to create a chart with no helpers

Now that we got some basic concepts on SVG, it's a good excercise to try to create
a chart without using any helper, we will notice it's a cumbersome task, and that
it would be greate to have a helper library that covers all the boiler plate (e.g. d3js).

# Steps

- Let's first create the HTML

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

- Now let's move a bit the chart we want to display to add some margins.

```diff
    <svg width="800" height="600">
      <!-- 60px x 10px margin -->
+      <g class="layer" transform="translate(60,10)">
+      </g>
    </svg>

```

- Now let's draw the dots with the data (we are manually calculating where it should be placed)

```diff
    <svg width="800" height="600">
      <!-- 60px x 10px margin -->
      <g class="layer" transform="translate(60,10)">
+        <!-- cx = 270px * ($X / 3)
+                    ^      ^   ^
+        width of graph  x-value max(x)
+
+              cy = 120px - (($Y / 80) * 120px)
+                     ^       ^     ^       ^
+          top of graph   y-value  max(y)  scale -->
+        <circle r="5" cx="0"   cy="105" />
+        <circle r="5" cx="90"  cy="90"  />
+        <circle r="5" cx="180" cy="60"  />
+        <circle r="5" cx="270" cy="0"   />
      </g>
    </svg>
```

- And finally let's add X and Y axis.

```diff
        <circle r="5" cx="0"   cy="105" />
        <circle r="5" cx="90"  cy="90"  />
        <circle r="5" cx="180" cy="60"  />
        <circle r="5" cx="270" cy="0"   />

+        <g class="y axis">
+          <line x1="0" y1="0" x2="0" y2="120" style="stroke:rgb(0,0,0);stroke-width:2" />
+          <text x="-40" y="105" dy="5">$10</text>
+          <text x="-40" y="0"   dy="5">$80</text>
+        </g>
+        <g class="x axis" transform="translate(0, 120)">
+          <line x1="0" y1="0" x2="270" y2="0" style="stroke:rgb(0,0,0);stroke-width:2"/>
+          <text x="-30"   y="20">January 2014</text>
+          <text x="240" y="20">April</text>
+        </g>
      </g>
    </svg>
```

This approach is not ideal, one of the main pain points is when you try to resize the chart, you will have to recalculate all entries.