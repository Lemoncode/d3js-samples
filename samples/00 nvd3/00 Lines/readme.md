# Consuming third partie libraries

Let's get a quick start, sometimes we just need to deliver a chart and use it as a blackbox, we can just make use of an open source library, if
we are lucky and get exactly what we need can just use the chart as a black box.

In this case we will make use of _nvD3_ open source chart library:

http://nvd3.org/

# Steps to reproduce the sample

- Let's first create a simple index.html file:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <h1>Sample Chart</h1>
    <div id="chart1" style="height: 500px"></div>
  </body>
</html>
```

- So far so good, we got a very basic HTML file working (double click on it and you will get some text displayed in your browser),
the next step is to reffer the nvd3 library, to make it simpler:
  - We are gong to link it via CDN (content delivery network).
  - We will import 


