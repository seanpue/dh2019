function new_renderer() {
  var render = new dagreD3.render()

  render.shapes().rectangle = function(parent, bbox, node) {
    var w = Math.max(bbox.width, bbox.height*1.5),
        shapeSvg = parent.insert("rect", ":first-child")
          .attr("rx", node.rx)
          .attr("ry", node.ry)
          .attr("x", -w / 2)
          .attr("y", -bbox.height / 2)
          .attr("width", w)
          .attr("height", bbox.height);

    node.intersect = function(point) {
      return dagreD3.intersect.rect(node, point);
    };
    return shapeSvg
  }

  intersectRect = dagreD3.intersect.rect;
  intersectPolygon = dagreD3.intersect.polygon;

  render.shapes().square = function(parent, bbox, node) {
    var l = Math.max(bbox.width, bbox.height),
        shapeSvg = parent.insert("rect", ":first-child")
          .attr("rx", node.rx)
          .attr("ry", node.ry)
          .attr("x", -l / 2)
          .attr("y", -l / 2)
          .attr("width", l)
          .attr("height", l);

    node.intersect = function(point) {
      return intersectRect(node, point);
    };
    return shapeSvg;
  }

  render.shapes().Mdiamond = function(parent, bbox, node) {
    var w = (bbox.width * Math.SQRT2) / 2,
        h = (bbox.height * Math.SQRT2) / 2,
        c = Math.sqrt(w **2 + h **2), // hypotenuse
        points = [
          { x:  0, y: -h },
          { x: -w, y:  0 },
          { x:  0, y:  h },
          { x:  w, y:  0 }
        ],
        shapeSvg = parent.insert("polygon", ":first-child")
          .attr("points", points.map(function(p) { return p.x + "," + p.y; }).join(" ")),
        theta_1 = Math.asin(h/c),
        theta_2 = Math.asin(w/c),
        y = Math.sin(theta_1) * c / 3,
        x = Math.sin(theta_2) * c / 3,
        paths = [
           { mx: -x,   my: -h + y,
             lx: x,    ly: -h + y},
           { mx: w-x,  my: -y,
             lx: w-x,  ly: y},
           { mx: -x,   my: h - y,
             lx: x,    ly: h - y},
           { mx: -w+x,  my: -y,
             lx: -w+x,  ly: y}
        ];
        var diagonalsSvg = parent.append("path")
            .attr("d", paths.map(
              function(d) {
                return "M "+d.mx + " " + d.my + " " +
                       "L "+d.lx + " " + d.ly + " "
              }
            ).join(" "));

    node.intersect = function(p) {
      return intersectPolygon(node, points, p);
    };

    return shapeSvg;
  }


  render.shapes().Msquare = function (parent, bbox, node) {

    var l = Math.max(bbox.width, bbox.height),
        diagOffset = l / 3; // diagonal offset

    var shapeSvg = parent.insert("rect", ":first-child")
          .attr("rx", node.rx)
          .attr("ry", node.ry)
          .attr("x", -l / 2)
          .attr("y", -l / 2)
          .attr("width", l)
          .attr("height", l);

     paths = [
      { mx: -l/2,            my: -l/2+diagOffset,
        lx: -l/2+diagOffset, ly: -l/2},
      { mx: l/2-diagOffset,  my: -l/2,
        lx: l/2,             ly: -l/2+diagOffset },
      { mx: l/2,             my: l/2-diagOffset,
        lx: l/2-diagOffset,  ly: l/2},
      { mx: -l/2+diagOffset, my: l/2,
        lx: -l/2,            ly: l/2-diagOffset}

      ];

    var diagonalsSvg = parent.append("path")
      .attr("d", paths.map(
        function(d) {
          return "M "+d.mx + " " + d.my + " " +
                 "L "+d.lx + " " + d.ly + " "
        }
      ).join(" "));

    node.intersect = function(point) {
      return intersectRect(node, point);
    };

    return shapeSvg;
  }


  // Add our custom arrow (a hollow-point)
  render.arrows().hollowPointInactive = function normal(parent, id, edge, type) {
    var marker = parent.append("marker")
      .attr("id", id)
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerUnits", "strokeWidth")
      .attr("markerWidth", 8)
      .attr("markerHeight", 6)
      .attr("orient", "auto");

    var path = marker.append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "1, 0")
      .style("fill", "grey")
      .style("stroke", "grey"); // fill was #FFF; .style("stroke-dasharray", "1,1")
    dagreD3.util.applyStyle(path, edge[type + "Style"]);
  }
  return render
}
