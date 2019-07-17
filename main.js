// Create a new directed graph
/* global settings, dagreD3, $ */

function dagreD3BaseGraph (active) {
  var rankdir
  if (language === 'ur') {
    rankdir = 'rl'
  } else { rankdir = 'lr' }
  var g = new dagreD3.graphlib.Graph(
    { compound: false }).setGraph({ 'rankdir': rankdir })
  var nodeNames = nodeNames_by_lang[language]
  var baseGraph = settings.base_graph
  for (var i in baseGraph.node) {
    var node = baseGraph.node[i]
    var _style
    if (node.type === '0') {
      if (active) {
        _style = 'fill: green;'
      } else {
        _style = 'fill: grey;'
      }
      g.setNode(i, {
        label: nodeNames['start'],
        shape: 'Mdiamond',
        style: _style,
        _type: 'start',
        origTokens: []
      })
    } else if (node.type === 'Accepting') {
      if (active) {
        _style = 'fill: red;'
      } else {
        _style = 'fill: grey;'
      }
      g.setNode(i, {
        label: nodeNames['end'],
        shape: 'Msquare',
        style: _style,
        _type: 'end',
        title: 'End Node',
        origTokens: []
      })
      g.acceptingNode = i // Adding attribute
    } else {
      var nodeShapes = {
        '=': 'rectangle',
        '-': 'circle',
        '_': 'circle'
      }
      var _shape = nodeShapes[node.type]
      g.setNode(i, {
        label: '',
        shape: _shape,
        style: 'stroke:grey; stroke-width: 1; stroke-dasharray: 1,1'
      })
    }
  }

  for (var head in baseGraph.edge) {
    for (var tail in baseGraph.edge[head]) {
      g.setEdge(head, tail,
        { style: 'stroke:grey; stroke-width: 1; stroke-dasharray: 1,1',
          arrowhead: 'hollowPointInactive' })
    }
  }
  return g
}

var language = 'en'

function currLanguage () {
  return language
}

var nodeNames_by_lang = {
  'en': {
    '=': 'Long',
    '-': 'Short',
    '_': 'Uncounted Short',
    'start': 'Start',
    'end': 'End'
  },
  'hi': {
    '=': 'लम्बा',
    '-': 'छोटा',
    '_': 'Uncounted Short',
    'start': 'शुरू',
    'end': 'आख़िर'
  },
  'ur': {
    '=': 'لمبا',
    '-': 'چھوٹا',
    '_': 'Uncounted Short',
    'start': 'شروع',
    'end': 'آخر'
  }
}
var nodeNames = {
  '=': 'Long',
  '-': 'Short',
  '_': 'Uncounted Short',
  'start': 'Start',
  'end': 'End'
}

lines = settings.lines
scans = settings.scans
labels_of = settings.labels_of
function dagred3_of_scan_result (line_id) {
  scan_result = scans[line_id]
  labels = labels_of[line_id];
  [scan, matches, meter_key] = scan_result // an array?
  g = dagreD3BaseGraph(true)
  for (var match_id in matches) {
    var match = matches[match_id]
    var type = match[0]
    // var matchedTokens = match[1]
    var nodeKey = match[2]
    var origTokens = match[3]
    var ruleFound = match[4]
    // var token_i = match[5]
    var parentKey = match[6]
    _label = labels[currLanguage()][match_id]
    var nodeShapes = { '=': 'rectangle', '-': 'circle', '_': 'circle' }
    var nodeNames = nodeNames_by_lang[language]
    var nodeName = nodeNames[type]
    _shape = nodeShapes[type]

    g.setNode(nodeKey, {
      'label': _label,
      'shape': _shape,
      'style': 'stroke:black; stroke-width: 2; stroke-dash-array:1,0',
      'name': nodeName,
      'origTokens': origTokens,
      'ruleFound': ruleFound,
      // 'token_i': token_i,
      'parentKey': parentKey,
      '_type': type
    })


    g.setEdge(parentKey, nodeKey, {'style': 'stroke:black; stroke-width: 2; stroke-dasharray: 1,0'})
  }
  g.setEdge(nodeKey, g.acceptingNode, {'style': 'stroke:black; stroke-width: 2; stroke-dasharray: 1,0'})

  x = 1
  return g
}

var g_scans = { 'cut': dagreD3BaseGraph() }

for (var line_id in scans) {
  g_scans[line_id] = dagred3_of_scan_result(line_id)
}

var svg = d3.select('svg')
var inner = svg.select('g')
/*
// Set up zoom support
var zoom = d3.zoom().on("zoom", function() {
    inner.attr("transform", d3.event.transform);
  });
svg.call(zoom);
*/
// Create the renderer
var render = new_renderer()/* dagreD3.render(); */

// Run the renderer. This is what draws the initial graph.
g = g_scans['cut']

render(inner, g)// _scans['cut']);/*_scans['cut']);*/
svg.attr('width', g.graph().width)
svg.attr('height', g.graph().height)
/* */

var styleTooltip = function (name, description) {
  return "<p class='name'>" + name + "</p><p class='description'>" + description + '</p>'
}

function htmlEntities (str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
function em (s) {
  return ' (<strong>' + s + '</strong) '
}
explication = {'l_bcsc': 'At the start of a word, a consonant {1} followed by a short vowel {2} and another consonant {3} is long. If the second consonant {3} was followed by a vowel, a long unit would not be possible here.', 'l_bcsc<h+wb>': 'A consonant {1} followed by a short vowel {2} and a pronounced {3} is long.', 'l_bcv': 'A consonant {1} followed by a long vowel {2} can always be long. At the end of a word, this combination could be short.', 'l_bcvn': 'A consonant {1} followed by a nasalized long vowel {2}{3} can always be long. At the end of a word, this combination could be short.', 'l_bsc': 'At the start of a word, a short vowel {0} followed by a consonant {1} is long.', 'l_bv': 'A long vowel {1} at the start of a word is long. It could also join with the consonant of a preceding word to form a long or short unit.', 'l_cbsc': 'A consonant {0} at the end of a word joins with a short vowel {2} and a consonant {3} at the start of a next word to form a long unit.', 'l_csc': 'A consonant {0} followed by short vowel {1} and another consonant {2} is long.', 'l_csc<h+wb>': 'A consonant {0} followed by a short vowel {1} and a pronounced consonant {2} is long.', 'l_cv': 'A consonant {0} followed by a long vowel {1} can always be long. At the end of a word, it could be short.', 'l_cvn': 'A consonant {0} followed by a nasalized long vowel {1}{2} here is long. At the end of a word, it could be short.', 'l_cvn<(aa)wb>': 'A consonant {0} followed by a nasalized long vowel {1}{2} at the end of a word can be long. The nasalization could have happened for the meter.', 's_bcs': 'At the start of a word, a short vowel {0} followed by a consonant {1} is short. If this were followed by a consonant at the end of a word or a cluster a cluster of consonants, this short unit would not be possible.', 's_bcsc<h+wb>': 'Here a consonant {1} followed by short vowel {2} and an unpronounced {3} is short.', 's_bcv<b>': 'A consonant {1} followed by a long vowel {2} at the end of a word is shortened. This combination could also be long.', 's_bcvn<b>': 'A consonant {1} followed by a nasalized long vowel {2} at the end of a word is shortened. This combination could also be long.', 's_bnah': 'A consonant {0} followed by a short vowel {1} and an unpronounced {2} is short.', 's_c': 'The consonant {0} is short, as it is not followed by vowel or preceded by a short vowel.', 's_co': 'The consonant {0} followed by the conjunction {1} here is short. This combination could also be long.', 's_cs': 'The consonant {0} followed by the short vowel {1} is short.  If this were followed by a consonant at the end of a word or a cluster of consonants, this short unit would not be possible.', 's_cv<b>': 'At the end of a word, a consonant {0} followed by a long vowel {1} is shortened. This combination could also be long.'}

function token_trans (token) {
  return settings.token_trans[token][currLanguage()]
}
function verbose (node_id, ruleFound, ot) {
  function em (x) {
    if (typeof (x) !== 'object') { /* change to check i farray? */
      x = [x]
    }
    out = '(<strong>'

    for (i = 0; i < x.length; i++) {
      out += settings.token_trans[ot[x[i]]][currLanguage()]
    }
    out += '</strong>)'
    return out
  }

  text = explication[ruleFound]
  if (!text) {
    return 'Missing'
    console.log('missing explication for ' + ruleFound)
  }

  for (i = 0; i < ot.length; i++) {
    text = text.replace(new RegExp('\\{' + i + '\\}', 'g'), '<strong>' + token_trans(ot[i]) + '</strong>')
  }
  text = text.replace(new RegExp('</strong><strong>', 'g'), '')
  return text
}

var nodeNames = {'=': 'Long', '-': 'Short', '_': 'Uncounted Short',
  'start': 'Start', 'end': 'End'}

function add_qtips () {
  inner.selectAll('g.node')
    .each(function (v) {
      var g = g_scans[currSection]
      var node = g.node(v)
      if (node['label'] !== '') {
        var nodeType = node._type
        var nodeName = nodeNames[node._type]
        var origTokens = node.origTokens
        name = nodeName
        if (origTokens) {
          name += ' (<em>' + node.origTokens.join('').replace(' ', '·') + '</em>)'
        }
        if (node.ruleFound) {
          name += ' /' + node.ruleFound + '/' + origTokens
        }
        // if (nodeType == "start" || nodeType == "end") {
        //   name = nodeName;
        // } else {
        //
        //   name = nodeName + " " + " (<em>"+node.origTokens.join("").replace(" ", interpunct)+"</em>)"
        // }
        /* description = htmlEntities(node.ruleFound); */
        description = ''
        if (node.ruleFound) {
          description = verbose(nodeName, node.ruleFound, node.origTokens)
        }
        // this.title = "BOSS";//"<p class='name'>" + name + "</p><p class='description'>" + description + "</p>";
        // this.title = title;//"TITLE";
        $(this).qtip({
          content: {
            text: description,
            title: name},

          position: {
            my: 'top left',  // Position my top left...
            at: 'bottom left'
          }
          // style: {
          //   classes: 'qtip-blue qtip-shadow'
          // }
        })
      }
    })
}
// add titles

// $('[title]').qtip(); /* apply qtip to all titles. */

svg.attr('width', g.graph().width)
svg.attr('height', g.graph().height)// * initialScale + 40);

/* wavesurfer */

var wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#0DB14B',
  progressColor: '#18453B',
  scrollParent: true
  // rtl: true
})

var currSection = ''

function getSection (time) {
  var intervals = settings.intervals
  for (i = 0; i < intervals.length; i++) {
    [start, end, label] = intervals[i]
    if (time >= start && time <= end) {
      return label
    }
  }
  return 'cut'
}

function generateFullPoem() {
  var output = '<table class="table">'
  $(settings.intervals).each(function (index) {
    // start = this[0]
    // end = this[1]
    var label = this[2] /* line number */
    if (label !== 'cut' && label !== undefined) {
      var section = label
      var textEN = settings.lines['en'][section]
      var textHI = settings.lines['hi'][section]
      var textUR = settings.lines['ur'][section]

      output += '  <tr id="line_' + index + '">'
      /* output += '<td>' + label + '</td>' */
      output += '<td class="align-right ur">' + textUR + '</td>'
      output += '<td class="hi">' + textHI + '</td>'
      output += '<td class="en">' + textEN + '</td>'
      output += '</tr>'
    }
  })
  output += '</table>'
  $('#poem_full_text').html(output)

}

var onProgress = function (time, force) {
  var x = time
  var section = getSection(x)
  if (section !== currSection || force === true) {
    if (section) {
      $('#poem_full_text tr').removeClass('table-active')
      $('#line_' + section).toggleClass('table-active')
    }
    var g = g_scans[section]
    var textEN = '<br/>'
    var textHI = '<br/>'
    var textUR = '<br/>'
    if (section !== 'cut') { /* could switch to undefined */
      textEN = settings.lines['en'][section]
      textHI = settings.lines['hi'][section]
      textUR = settings.lines['ur'][section]
    }
    $('#poem_line_en').html(textEN)
    $('#poem_line_hi').html(textHI)
    $('#poem_line_ur').html(textUR)

    render = new_renderer()
    d3.select('svg > g').selectAll('*').remove()
    render(d3.select('svg > g'), g)

    svg.attr('width', g.graph().width)
    svg.attr('height', g.graph().height)

    currSection = section
    add_qtips()
  }
}
    // x = time;
    // if (x >=10 && x < 25) {
    //   currGraph =
    // }

var onSeek = function (x) {
  var time = window.wavesurfer.getCurrentTime()
  onProgress(time)
  /* alert('hi'); */
}

$('#language-group :input').change(function () {
  language = this.id
  var time = window.wavesurfer.getCurrentTime()
  g_scans = {'cut': dagreD3BaseGraph()}
  for (var line_id in scans) {
    g_scans[line_id] = dagred3_of_scan_result(line_id)
  }
  onProgress(time, true)
})
generateFullPoem()

wavesurfer.on('audioprocess', onProgress)
wavesurfer.on('seek', onSeek)
/* wavesurfer.on('audioprocess', onProgress); */

wavesurfer.load(settings.audio_file, settings.peaks.data)
