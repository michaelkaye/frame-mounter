
// Default mount_angle. This is hardly ever wanted to be changed
var frame = { 
    mount_angle: 5
};


// Helper functions that create default configuration
function add_text_input(title, id, default_value) {
    frame[id] = default_value;
    var inputgroup = d3.select('.inputs').append("tr").attr("class","");
    inputgroup.append("td").text(title);
    inputgroup.append("td").attr("colspan",2)
        .append("input")
          .attr("type","text")
          .attr("id",id+"_text")
          .attr("class","params form-control")
          .property("value",default_value);
}

function add_bar_input(title, id, def, min, max) {
    frame[id] = def;
    var inputgroup = d3.select('.inputs').append("tr").attr("class","");
    inputgroup.append("td").text(title);
    inputgroup.append("td")
        .append("input")
          .attr("type","range")
          .attr("id",id+"_bar")
          .attr("class","params form-control")
          .attr("min",min)
          .attr("max",max)
          .property("value",def);
    inputgroup.append("td")
        .append("input")
          .attr("type","text")
          .attr("size","6")
          .attr("id",id+"_box")
          .attr("class","params form-control")
          .property("value",def);
}

function initialize() {
    var inputElems = d3.selectAll('.params');

    inputElems.on('change', function (d, i) {
        var base_name = this.id.replace("_box","").replace("_bar","").replace("_text","");
        d3.select('#'+base_name+"_box")
            .property("value", this.value);
        d3.select('#'+base_name+'_bar')
            .property("value", this.value);
        frame[base_name] = +this.value;
        update();
    });
    update();
}

function top_angle(d) {
    var outer_cut_start_x = d['mount_width'];
    var outer_cut_end_x = d['width'] - d['mount_width'];
    var outer_cut_start_y = d['mount_height'];
    var outer_cut_end_y = d['height'] - d['mount_height'];
    var inner_cut_start_x = d['mount_width'] - d['mount_angle'];
    var inner_cut_end_x = d['width'] - d['mount_width'] + d['mount_angle'];
    var inner_cut_start_y = d['mount_height'] - d['mount_angle'];
    var inner_cut_end_y = d['height'] - d['mount_height'] + d['mount_angle'];
    var zoom = d['zoom'];

    var poly = [
        [outer_cut_start_x,outer_cut_start_y],
        [outer_cut_end_x, outer_cut_start_y],
        [inner_cut_end_x, inner_cut_start_y],
        [inner_cut_start_x, inner_cut_start_y],
        [inner_cut_start_x, inner_cut_end_y],
        [outer_cut_start_x, outer_cut_end_y],
        [outer_cut_start_x, outer_cut_start_y]
    ];
    poly = poly.map(function (point) { return [(point[0] + d['offset_mount_width']), (point[1] + d['offset_mount_height'])]; })
    poly = poly.map(function (point) { return [(point[0] * zoom / 100), (point[1] * zoom / 100)]; })
    return poly.map(function (point) { return point.join(','); }).join(' ');
}

function bottom_angle(d) {
    var outer_cut_start_x = d['mount_width'];
    var outer_cut_end_x = d['width'] - d['mount_width'];
    var outer_cut_start_y = d['mount_height'];
    var outer_cut_end_y = d['height'] - d['mount_height'];
    var inner_cut_start_x = d['mount_width'] - d['mount_angle'];
    var inner_cut_end_x = d['width'] - d['mount_width'] + d['mount_angle'];
    var inner_cut_start_y = d['mount_height'] - d['mount_angle'];
    var inner_cut_end_y = d['height'] - d['mount_height'] + d['mount_angle'];
    var zoom = d['zoom'];

    var poly = [
        [outer_cut_end_x, outer_cut_end_y],
        [outer_cut_start_x, outer_cut_end_y],
        [inner_cut_start_x, inner_cut_end_y],
        [inner_cut_end_x, inner_cut_end_y],
        [inner_cut_end_x, inner_cut_start_y],
        [outer_cut_end_x, outer_cut_start_y],
        [outer_cut_end_x, outer_cut_end_y]
    ];
    poly = poly.map(function (point) { return [(point[0] + d['offset_mount_width']), (point[1] + d['offset_mount_height'])]; })
    poly = poly.map(function (point) { return [(point[0] * zoom / 100), (point[1] * zoom / 100)]; })
    return poly.map(function (point) { return point.join(','); }).join(' ');
}

function mount_colour(d) {
    var min_x = 0;
    var min_y = 0;
    var max_x = d['width'];
    var max_y = d['height'];
    var cut_start_x = d['mount_width'] - d['mount_angle'] + d['offset_mount_width'];
    var cut_end_x = d['width'] - d['mount_width'] + d['mount_angle'] +d['offset_mount_width'];
    var cut_start_y = d['mount_height'] - d['mount_angle'] + d['offset_mount_height'];
    var cut_end_y = d['height'] - d['mount_height'] + d['mount_angle'] + d['offset_mount_height'];
    var zoom = d['zoom'];
    var poly = [
        [min_x,min_y],
        [max_x,min_y],
        [cut_end_x,cut_start_y],
        [cut_start_x, cut_start_y],
        [cut_start_x, cut_end_y],
        [cut_end_x, cut_end_y],
        [cut_end_x, cut_start_y],
        [max_x,min_y],
        [max_x,max_y],
        [min_x,max_y],
        [min_x,min_y]
    ];
    console.log(poly);
    poly = poly.map(function (point) { return [(point[0] * zoom / 100), (point[1] * zoom / 100)]; })
    return poly.map(function (point) { return point.join(','); }).join(' ');
}
function manage(svg) {
    svg
        .attr("width", function(d) { return d['width'] * d['zoom'] / 100;})
        .attr("height", function(d) {return d['height'] * d['zoom'] / 100;});

    var bg = svg.select("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", function(d) {return d['width'] * d['zoom'] / 100;})
        .attr("height", function(d) { return d['height'] * d['zoom'] / 100;});

    var image = svg.select("image")
        .attr("x", function(d) { return ((d['width'] - d['image_width']) / 2  + d['image_offset_width']) * d['zoom'] / 100;})
        .attr("y", function(d) { return ((d['height'] - d['image_height']) / 2  + d['image_offset_height']) * d['zoom'] / 100;})
        .attr("width", function(d) { return d['image_width'] * d['zoom'] / 100;})
        .attr("height", function(d) { return d['image_height'] * d['zoom'] / 100;})
        .attr("preserveAspectRatio","none")
        .attr("xlink:href", function (d) { return d['image_url'];});

    var mount = svg.select("g");
    mount.select('.mount')
        .attr("fill","green")
        .attr("points", mount_colour);
    mount.select('.top_angle')
        .attr("fill","grey")
        .attr("points", top_angle);
    mount.select('.bottom_angle')
        .attr("fill","white")
        .attr("points",bottom_angle);
}

function update() {

    var div = d3.select(".render").selectAll(".frame").data([frame]);
    var svg = div.selectAll('svg');
    svg = div.selectAll('svg');
    manage(svg);

    var new_div = div.enter().append('div').attr("class","frame");
    var new_svg = new_div.append('svg');
    new_svg.append('rect')
    new_svg.append('image')

    var new_g = new_svg.append('g');
    new_g.append('polygon')
      .attr("class","mount");
    new_g.append('polygon')
      .attr("class","top_angle");
    new_g.append("polygon")
      .attr("class","bottom_angle");
    manage(new_svg);    
    div.exit().remove();

   
};
