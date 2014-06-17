var d3 = require('d3')

module.exports = function (options) {
  var textCoverWidth = 100
    , togglerWidth = 20
    , width, height

  function draw (selection) {
    selection.each(function (data, i) {
      // Store sane copies of x,y that denote our true coords in the tree
      data._x = data.y
      data._y = i * height

      var node = d3.select(this)

      node.transition()
          .duration(options.duration)
          .attr('transform', function (d, i) {
            return 'translate(0,' + d._y + ')'
          })
          .style('opacity', 1)

      node.selectAll('g.toggle-group')
          .attr('transform', function (d, i) {
            return 'translate(' + (d._x - togglerWidth) + ',0)'
          })

      // Now we can move the group so it's indented correctly
      node.selectAll('g.node-contents')
          .transition()
          .duration(options.duration)
          .attr('transform', function (d, i) {
            return 'translate(' + d._x + ',0)'
          })

      // Change the dot positions
      node.selectAll('circle.indicator')
          .attr('transform', function (d) {
            return 'translate(' + (width - 10 - d._x) + ',0)'
          })

      // Change the rect
      node.selectAll('rect')
          .attr('y', -height / 2)
    })
  }

  draw.width = function (value) {
    if (!arguments.length) return width
    width = value
    return draw
  }

  draw.height = function (value) {
    if (!arguments.length) return height
    height = value
    return draw
  }

  return draw
}
