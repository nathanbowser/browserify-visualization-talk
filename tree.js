var d3 = require('d3')
  , resize = require('./resize')

var Tree = function (stream) {
  this.options = {
    depth: 20,
    height: 36,
    marginLeft: 0,
    marginTop:  18,
    duration: 400
  }

  this.stream = stream
  this.resizer = resize(this.options)
  this.tree = d3.layout.tree()
                       .nodeSize([0, this.options.depth])
}

Tree.prototype.render = function () {
  var self = this

  this.el = d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
  this.node = this.el.append('g')
                        .attr('transform', 'translate(' + this.options.marginLeft + ',' + this.options.marginTop + ')')
                        .selectAll('g.node')

  this._nodeData = []
  this.stream.on('data', function (n) {
    var p = (function (nodes) {
      for (var i = nodes.length - 1; i >= 0; i--) {
        if (nodes[i].id === n.parent) {
          return nodes[i]
        }
      }
    })(self._nodeData)

    self._nodeData.push(n)
    if (p) {
      (p.children || (p.children = [])).push(n)
    }
    self.draw()
  })

  return this
}

Tree.prototype.resize = function () {
  var box = this.el.node().parentNode.getBoundingClientRect()
  this.resizer.width(parseInt(box.width, 10))
  this.resizer.height(this.options.height)
  this.node.call(this.resizer)
}

Tree.prototype.draw = function (source) {
  var self = this

  this.node = this.node.data(this.tree.nodes(this._nodeData[0]), function (d) {
    return d.id
  })

  var enter = this.node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', function (d, i) {
        return 'translate(0,' + (source ? source._y : d.y) + ')'
      })
      .style('opacity', 1e-6)

  // Filler element
  enter.append('rect')
         .attr('class', 'node-fill')
         .attr('width', '100%')
         .attr('height', this.options.height)
         .attr('y', this.options.height / - 2)

  var contents = enter.append('g')
                        .attr('class', 'node-contents')
                        .attr('transform', function (d) {
                          return 'translate(' + (d.parent ? d.parent._x : 0) + ',0)'
                        })

  contents.append('text')
         .attr('class', 'label')
         .attr('dy', 4) // manually position the label
         .attr('dx', 35)

  contents.append('circle')
      .attr('class', 'indicator')
      .attr('cx', -7) // manually position the indicator circle
      .attr('cy', 0)
      .attr('r', 2.5) // the circle is 5px wide

  // Put this after content, so the toggler click icon works
  var toggler = enter.append('g')
                       .attr('class', 'toggle-group')
  toggler.append('use')
         .attr('class', 'toggle-icon')
         .attr('xlink:href', '#collapsed')
         .attr('x', 15)
         .attr('y', -5)
  toggler.append('rect')
           .attr('width', this.options.height)
           .attr('height', this.options.height)
           .on('click', this.toggle.bind(this))

  // Update the color if it changed
  this.node.selectAll('circle.indicator')
      .attr('class', function (d) {
        return 'indicator ' + d.color
      })

  // change the state of the toggle icon by adjusting its class
  this.node.selectAll('use.toggle-icon')
           .attr('class', function (d) {
             return 'toggle-icon ' + (d._children ? 'collapsed' : d.children ? 'expanded' : 'leaf')
           })

  // Perhaps the name changed
  this.node.selectAll('text.label')
            .text(function (d) {
              return d.label
            })

  // If this node has been removed, let's remove it.
  this.node.exit()
      .transition()
      .duration(this.options.duration)
      .attr('transform', function (d) {
        return 'translate(' + -self.options.depth + ',' + source._y + ')'
      })
      .style('opacity', 0)
      .remove()

  // Now resize things
  this.resize()
}

Tree.prototype.toggle = function (d) {
  if (d.children) {
    d._children = d.children
    d.children = null
  } else {
    d.children = d._children
    d._children = null
  }
  this.draw(d)
  d3.event.stopPropagation()
}

module.exports = Tree
