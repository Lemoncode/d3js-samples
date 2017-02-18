# 02 Charts / 02 BarChart

1) Add a padding between each of the chart bars.

![No padding](./pictures/02_Chart_Original.png "Chart Original")
![Bar Padding](./pictures/02_Chart_Bar_Padding.png "Chart Padding")


```diff
newRects.append('rect')
  .attr('x', x(0))
  .attr('y', function(d, i) {
    return y(d.product);
  })
-  .attr('height', y.bandwidth)
+  .attr('height', function(d, i) {
+    return y.bandwidth() - 5;
+  })
  .attr('width', function(d, i) {
    return x(d.sales);
  });

```