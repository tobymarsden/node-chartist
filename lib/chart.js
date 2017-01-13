const capitalize = require('underscore.string/capitalize');
const co = require('co');
const renderAxisTitles = require('./axis-title');

/**
 * Generate Chart HTML
 * @param  {String} type
 *         bar, line, pie
 * @return {Promise{String}} html
 */
const generate = co.wrap(function * (Chartist, window, type, options, data) {
  type = capitalize(type);
  if (!Chartist[type]) throw new TypeError(`Unsupported chart type: ${type}`);
  const container = window.document.createElement('div');
  const chart = new Chartist[type](container, data, options);
  const event = yield new Promise(resolve => chart.on('created', resolve));
  chart.axisX = event.axisX;
  chart.axisY = event.axisY;
  renderAxisTitles(Chartist, chart);
  chart.detach();

  // Set a viewBox attribute for the svg element matching its width and height attributes
  var svg = container.children;
  for(var i = 0; i < svg.length; i++) {
    if(svg[i].tagName === 'svg') {
      svg[i].setAttribute('viewBox', '0 0 ' + svg[i].getAttribute('width') + ' ' + svg[i].getAttribute('height'));
    }
  }

  return container.innerHTML;
});

module.exports = generate;
