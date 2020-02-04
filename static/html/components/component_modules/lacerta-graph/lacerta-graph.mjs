let graph = {}

graph['createElements'] = function (obj) {
  var width = 500

  var height = 500

  var radius = Math.min(width, height) / 2

  this.color = d3.scale.ordinal()
    .range(['green', 'orange', 'blue', 'red'])

  this.arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0)

  this.pie = d3.layout.pie()
    .sort(null)
    .value(function (d) { return d.amount })

  this.svg = d3.select(this.$.svg)
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
}

graph['drawChart'] = function (obj) {
  var me = this

  me.data.forEach(function (d) {
    d.amount = +d.amount
  })

  me.g = me.svg.selectAll('.arc')
    .data(me.pie(me.data))
    .enter().append('g')
    .attr('class', 'arc')

  me.g.append('path')
    .attr('d', me.arc)
    .style('fill', function (d) { return me.color(d.data.type) })

  me.g.append('text')
    .attr('transform', function (d) { return 'translate(' + me.arc.centroid(d) + ')' })
    .attr('dy', '.35em')
    .style('text-anchor', 'middle')
    .text(function (d) { return d.data.type })
}

graph['refreshChart'] = function (obj) {
  var me = this

  me.g.data(me.pie(me.data))
    .select('path').attr('d', me.arc)

  me.g.select('text')
    .attr('transform', function (d) { return 'translate(' + me.arc.centroid(d) + ')' })
}

graph['getData'] = function (obj) {
  var me = this
  d3.csv(me.url, function (error, data) {
    me.data = data
    me.drawChart()
  })
}

graph['domReady'] = function (obj) {
  this.createElements()
  this.getData()
}
graph['urlChanged'] = function (obj) {
  if (newValue && oldValue) {
    this.getData()
  }
}
export default {
  graph
}
