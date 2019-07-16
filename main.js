// Create a new directed graph

var base_graph = {
  'edge': {
    '0': {
      '1': {}
    },
    '1': {
      '2': {},
      '3': {}
    },
    '2': {
      '4': {}
    },
    '3': {
      '5': {}
    },
    '4': {
      '6': {}
    },
    '5': {
      '4': {}
    },
    '6': {
      '7': {}
    },
    '7': {
      '8': {},
      '9': {}
    },
    '8': {
      '10': {}
    },
    '9': {
      '11': {}
    },
    '10': {
      '12': {}
    },
    '11': {
      '10': {}
    },
    '12': {
      '13': {}
    }
  },
  'node': {
    '0': {
      'type': '0'
    },
    '1': {
      'type': '='
    },
    '2': {
      'type': '='
    },
    '3': {
      'type': '-'
    },
    '4': {
      'type': '='
    },
    '5': {
      'type': '-'
    },
    '6': {
      'type': '='
    },
    '7': {
      'type': '='
    },
    '8': {
      'type': '='
    },
    '9': {
      'type': '-'
    },
    '10': {
      'type': '='
    },
    '11': {
      'type': '-'
    },
    '12': {
      'type': '='
    },
    '13': {
      'type': 'Accepting',
      'id': 0,
      'name': 'Faiz',
      'regex_pattern': '=(=|--)===(=|--)==',
      'meter_key': 0
    }
  },
  'edge_list': [
    [0, 1],
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 6],
    [5, 4],
    [6, 7],
    [7, 8],
    [7, 9],
    [8, 10],
    [9, 11],
    [10, 12],
    [11, 10],
    [12, 13]
  ]
}

function dagred3_base_graph (active) {
  if (language === 'ur') {
    rankdir = 'rl'
  } else {rankdir='lr'}
  var g = new dagreD3.graphlib.Graph({compound:false}).setGraph({'rankdir':rankdir})
  node_names = node_names_by_lang[language];
  for (var i in base_graph.node) {
    node = base_graph.node[i];
    if (node.type === '0') {
      if (active) {
        _style = 'fill: green;'
      } else {
        _style = 'fill: grey;'
      }
      g.setNode(i, {label: node_names['start'], shape: 'Mdiamond', style: _style, _type:'start', orig_tokens:[]});
    } else if (node.type == 'Accepting') {
      if (active) {
        _style = "fill: red;"
      } else {
        _style = "fill: grey;"
      }
      g.setNode(i, {label: node_names['end'], shape: 'Msquare', style: _style, _type:"end", title:"End Node", orig_tokens:[]});
      g.acceptingNode = i; // Adding attribute
    } else {
      node_shapes = {"=": "rectangle", "-": "circle", "_": "circle"};
      //_label = orig_tokens.join('').replace(/ /g, interpunct);
      _shape = node_shapes[node.type];
      //#node_name = "node_" + match_id; #.style("stroke-width", 1)
      g.setNode(i, {label: '', shape: _shape, style: "stroke:grey; stroke-width: 1; stroke-dasharray: 1,1"});//, orig_tokens:orig_tokens});
    }

  }

  for (var head in base_graph.edge) {
    for (var tail in base_graph.edge[head]) {
      g.setEdge(head, tail,{'style': "stroke:grey; stroke-width: 1; stroke-dasharray: 1,1", arrowhead: "hollowPointInactive"});
    }
  }
  return g;
}

var language = 'en';
function curr_language() {
  return language;
}

var intervals = [[0.0, 4.125714285714288, "cut"], [4.125714285714288, 7.023696449108615, "1"], [8.320000000000002, 11.080045966382015, "2"], [12.651428571428573, 14.756200484663541, "3"], [15.73714285714286, 18.601745013831568, "4"], [19.611428571428576, 22.33145999836452, "5"], [22.33145999836452, 25.150750820636258, "6"], [27.55428571428572, 29.721899445393763, "7"], [30.37714285714286, 32.40006797221399, "8"], [32.994285714285716, 35.62116334050255, "9"], [36.377142857142864, 38.444232142704514, "10"], [39.92, 41.99027150736831, "11"], [43.17714285714286, 46.39093568842475, "12"], [46.39093568842475, 51.2, "cut"]]

var node_names_by_lang = {
  'en': {
    "=": "Long",
    "-": "Short",
    "_": "Uncounted Short",
    "start": "Start",
    "end": "End"
  },
  'hi': {
    "=": "लम्बा",
    "-": "छोटा",
    "_": "Uncounted Short",
    "start": "शुरू",
    "end": "आख़िर"
  },
  'ur': {
    "=": "لمبا",
    "-": "چھوٹا",
    "_": "Uncounted Short",
    "start": "شروع",
    "end": "آخر"
  }
}
var node_names = {
  "=": "Long",
  "-": "Short",
  "_": "Uncounted Short",
  "start": "Start",
  "end": "End"
}

lines = settings.lines;
scans = settings.scans;
labels_of = settings.labels_of;
function dagred3_of_scan_result(line_id){
  scan_result = scans[line_id];
  labels = labels_of[line_id];
  [scan, matches, meter_key] = scan_result; // an array?
  g = dagred3_base_graph(true);
  for (var match_id in matches ) {
    var match = matches[match_id];
    [type, matched_tokens, node_key, orig_tokens, rule_found, token_i, parent_key] = match
    interpunct = "·"
    /*_label = orig_tokens.join('').replace(/ /g, interpunct);*/
    _lang = curr_language()
    _label = labels[_lang][match_id];
    node_shapes = {"=": "rectangle", "-": "circle", "_": "circle"};
    node_names = node_names_by_lang[language];
    node_name = node_names[type];
    _shape = node_shapes[type];

    g.setNode(node_key,
      {"label":_label,
       /*"shape": _shape,*/
       "style": "stroke:black; stroke-width: 2; stroke-dash-array:1,0",
       "name": node_name,
       "orig_tokens": orig_tokens,
       "rule_found": rule_found,
       "token_i": token_i,
       "parent_key": parent_key,
       "_type": type,
       });
    g.setEdge(parent_key, node_key, {'style': 'stroke:black; stroke-width: 2; stroke-dasharray: 1,0'});
  }
  g.setEdge(node_key, g.acceptingNode, {'style': 'stroke:black; stroke-width: 2; stroke-dasharray: 1,0'});

  x = 1;
  return g;
}

var g_scans = { 'cut': dagred3_base_graph() }

for (var line_id in scans) {
  g_scans[line_id] = dagred3_of_scan_result(line_id)
}


var svg = d3.select("svg")
var inner = svg.select("g")
/*
// Set up zoom support
var zoom = d3.zoom().on("zoom", function() {
    inner.attr("transform", d3.event.transform);
  });
svg.call(zoom);
*/
// Create the renderer
var render = new_renderer()/* dagreD3.render();*/


// Run the renderer. This is what draws the initial graph.
g = g_scans['cut']

render(inner, g);//_scans['cut']);/*_scans['cut']);*/
svg.attr('width', g.graph().width)
svg.attr('height', g.graph().height)
/* */



var styleTooltip = function(name, description) {
  return "<p class='name'>" + name + "</p><p class='description'>" + description + "</p>"
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function em(s){
  return " (<strong>"+s+"</strong) ";
}
explication = {"l_bcsc": "At the start of a word, a consonant {1} followed by a short vowel {2} and another consonant {3} is long. If the second consonant {3} was followed by a vowel, a long unit would not be possible here.", "l_bcsc<h+wb>": "A consonant {1} followed by a short vowel {2} and a pronounced {3} is long.", "l_bcv": "A consonant {1} followed by a long vowel {2} can always be long. At the end of a word, this combination could be short.", "l_bcvn": "A consonant {1} followed by a nasalized long vowel {2}{3} can always be long. At the end of a word, this combination could be short.", "l_bsc": "At the start of a word, a short vowel {0} followed by a consonant {1} is long.", "l_bv": "A long vowel {1} at the start of a word is long. It could also join with the consonant of a preceding word to form a long or short unit.", "l_cbsc": "A consonant {0} at the end of a word joins with a short vowel {2} and a consonant {3} at the start of a next word to form a long unit.", "l_csc": "A consonant {0} followed by short vowel {1} and another consonant {2} is long.", "l_csc<h+wb>": "A consonant {0} followed by a short vowel {1} and a pronounced consonant {2} is long.", "l_cv": "A consonant {0} followed by a long vowel {1} can always be long. At the end of a word, it could be short.", "l_cvn": "A consonant {0} followed by a nasalized long vowel {1}{2} here is long. At the end of a word, it could be short.", "l_cvn<(aa)wb>": "A consonant {0} followed by a nasalized long vowel {1}{2} at the end of a word can be long. The nasalization could have happened for the meter.", "s_bcs": "At the start of a word, a short vowel {0} followed by a consonant {1} is short. If this were followed by a consonant at the end of a word or a cluster a cluster of consonants, this short unit would not be possible.", "s_bcsc<h+wb>": "Here a consonant {1} followed by short vowel {2} and an unpronounced {3} is short.", "s_bcv<b>": "A consonant {1} followed by a long vowel {2} at the end of a word is shortened. This combination could also be long.", "s_bcvn<b>": "A consonant {1} followed by a nasalized long vowel {2} at the end of a word is shortened. This combination could also be long.", "s_bnah": "A consonant {0} followed by a short vowel {1} and an unpronounced {2} is short.", "s_c": "The consonant {0} is short, as it is not followed by vowel or preceded by a short vowel.", "s_co": "The consonant {0} followed by the conjunction {1} here is short. This combination could also be long.", "s_cs": "The consonant {0} followed by the short vowel {1} is short.  If this were followed by a consonant at the end of a word or a cluster of consonants, this short unit would not be possible.", "s_cv<b>": "At the end of a word, a consonant {0} followed by a long vowel {1} is shortened. This combination could also be long."};

function token_trans(token){
  return settings.token_trans[token][curr_language()]
}
function verbose(node_id, rule_found, ot){
  function em(x){
    if (typeof(x) != "object") { /* change to check i farray?*/
      x = [x];
    }
    out = "(<strong>";

    for (i=0;i<x.length;i++) {
      out += settings.token_trans[ot[x[i]]][curr_language()]
    }
    out += "</strong>)";
    return out;
  }

  text = explication[rule_found];
  if (!text) {
    return "Missing";
    console.log("missing explication for "+rule_found);
  }

  for (i=0;i<ot.length;i++) {
    text = text.replace(new RegExp("\\{"+i+"\\}", 'g'), "<strong>"+token_trans(ot[i])+"</strong>");
  }
  text = text.replace(new RegExp("</strong><strong>", 'g'), "");
  return text;
}

var node_names = {"=": "Long", "-": "Short", "_": "Uncounted Short",
                  "start": "Start", "end": "End"}

function add_qtips() {
  inner.selectAll("g.node")
    .each(function(v) {
      g = g_scans[currSection];
      node = g.node(v);
      if (node['label'] !== '') {
        node_type = node._type;
        node_name = node_names[node._type];
        orig_tokens = node.orig_tokens
        name = node_name;
        if (orig_tokens) {
          name +=  " (<em>"+node.orig_tokens.join("").replace(" ", interpunct)+"</em>)"
        }
        if (node.rule_found) {
          name += " /"+node.rule_found+"/"+orig_tokens;
        }
        // if (node_type == "start" || node_type == "end") {
        //   name = node_name;
        // } else {
        //
        //   name = node_name + " " + " (<em>"+node.orig_tokens.join("").replace(" ", interpunct)+"</em>)"
        // }
        /*description = htmlEntities(node.rule_found);*/
        description = '';
        if (node.rule_found){
          description = verbose(node_name, node.rule_found, node.orig_tokens);
        }
        //this.title = "BOSS";//"<p class='name'>" + name + "</p><p class='description'>" + description + "</p>";
        //this.title = title;//"TITLE";
        $(this).qtip({
          content: {
            text: description,
            title: name},

          position: {
            my: 'top left',  // Position my top left...
            at: 'bottom left'
          },
          // style: {
          //   classes: 'qtip-blue qtip-shadow'
          // }
        })
      }
  });
}
// add titles

//$('[title]').qtip(); /* apply qtip to all titles. */

svg.attr('width', g.graph().width);
svg.attr('height', g.graph().height);// * initialScale + 40);

/* wavesurfer */

var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '0DB14B',
    progressColor: '18453B',
     scrollParent: true
});


var currSection = '';

function getSection(time) {
  for (i = 0; i < intervals.length; i++) {
    [start, end, label] = intervals[i];
    if (time >= start && time <= end) {
      return label;
    }
  }
  return "cut";
}

var onProgress = function(time, force) {
  var x = time
  var section = getSection(x)
  if (section !== currSection || force === true) {
    var g = g_scans[section]
    $('#poem_text').html(
      settings.lines['ur'][section] + '<br/>' +
      settings.lines['hi'][section] + '<br/>' +
      settings.lines['en'][section] + '<br/>'
    )

    render = new_renderer()
    d3.select("svg > g").selectAll("*").remove();
    render(d3.select("svg > g"), g)

    svg.attr('width', g.graph().width)
    svg.attr('height', g.graph().height)


    currSection = section
    add_qtips()
  }
};
    // x = time;
    // if (x >=10 && x < 25) {
    //   currGraph =
    // }

var onSeek = function(x) {
  var time = window.wavesurfer.getCurrentTime();
  onProgress(time);
  /*alert('hi');*/
}


$("#language-group :input").change(function() {
    language = this.id;
    var time = window.wavesurfer.getCurrentTime();
    g_scans = {'cut': dagred3_base_graph()}
    for (var line_id in scans){
      g_scans[line_id] = dagred3_of_scan_result(line_id);
    }
    onProgress(time, true);
});

wavesurfer.on('audioprocess', onProgress);
wavesurfer.on('seek', onSeek);
/*wavesurfer.on('audioprocess', onProgress);*/

wavesurfer.load('audio/faiz_bol.mp4');
