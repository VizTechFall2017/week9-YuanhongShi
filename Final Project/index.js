var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;


console.log(width, height);


var marginLeft = 0;
var marginTop = 0;



var svg1 = d3.select('#svg1')
.append('g')
.attr('transform', 'translate('+ marginLeft +', '+ marginTop+')');


var svg2 = d3.select('#svg2')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var albersProjection = d3.geoAlbers()
    .scale(170000 )
    .rotate([71.057,0])
    .center([0, 42.313])
    .translate([(width/2), (height/2)]);

var path = d3.geoPath()
.projection(albersProjection);

//import the data from the .csv file
d3.json('./neighborhood_boston.json', function(dataIn){
    //console.log(dataIn);
    svg1.selectAll('path')
        .data(dataIn.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'gainsboro')
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('data-toggle',"tooltip")
        .attr('title', function(d){
            if (d.properties.name == 'Downtown'){
                return 'CLICK ON THE DOT!'
            }
            else
            return d.properties.name;
        })
        .on('mouseover', function(d){
            if (d.properties.name == 'Downtown'){
                d3.select(this)
                    .attr('fill', 'red');
            }
            else{
                d3.select(this)
                    .attr('fill', 'yellow');
            }

        })
        .on('mouseout', function(d){
            d3.select(this)
                .attr('fill', 'gainsboro');
        })
        .on('click', function(d){

        });

 //   $('[data-toggle="tooltip"]').tooltip();

    svg1.selectAll('circle')
        .data(arrayList)
        .enter()
        .append('circle')
        .attr('cx', function (d){
            return albersProjection([d.long, d.lat])[0];
        })
        .attr('cy', function (d){
            return albersProjection([d.long, d.lat])[1];
        })
        .attr('r', 5)
        .attr('fill', 'steelblue')
        .on('mouseover', function(d){
            console.log('show some thing');
            d3.select(this)
                //why this tooltip not work!
                //.attr('data-toggle',"tooltip")
                .attr('data-content', 'CLICK ON ME!')
                .transition()
                .duration(3000)
                .ease(d3.easeBounce)
                .attr('fill', 'red')
                .attr('r', 20)
                .attr('opacity', .8)
                .attr('stroke', 'white')
                .attr('stroke-width', 0.5);

        })

        .on('mouseout', function(d){
            d3.select(this)
                .transition()
                .duration(3000)
                .ease(d3.easeBounce)
                .attr('fill', 'steelblue')
                .attr('stroke', 'none')
                .attr('r', 5);
        })

        .on('click', function(d){
            d3.select(this)
                .attr('fill', 'red')
                .attr('r', 10);
            d3.select('.background')
                .transition()
                .duration(3000)
                .ease(d3.easeBounce)
                .attr('opacity', 1);

        });

    $('[data-toggle="tooltip"]').tooltip();


});

arrayListtest= [
    {long:-71.090508, lat:42.340052},
    {long:-71.086145, lat:42.338542},
    {long:-71.081518, lat:42.341663},
    {long:-71.076440, lat:42.348695}
];



arrayList = [
    {long:-71.056612, lat:42.354175}
];

var defs = svg2.append('defs');
defs.append('pattern')
    .attr('id','bg')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', width)
    .attr('height', height)
    .append('image')
    .attr('xlink:href', 'Background_Single.png')
    .attr('width', width)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0);

svg2.append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'url(#bg)')
    .attr('opacity', 0);


d3.select('#show_point')
    .on('click', function(){
        d3.csv('./inPathData_Enclosure.csv', function(dataIn){

        svg2.selectAll('circle')
            .data(dataIn)
            .enter()
            .append('circle')
            .attr('class','myCircles');

        drawPoints(dataIn);

        svg2.selectAll('circle')
            .transition()
            .duration(2000)
            .ease(d3.easeBounce)
            .attr('opacity', 1);

    });
    });

d3.select('#show_path')
    .on('click', function() {
        d3.csv('./inPathData_Enclosure.csv', function (dataIn) {
            var path = svg2.append('path')
                .data([dataIn])
                .attr('class', 'roadPath')
                .transition()
                .duration(2000)
                .ease(d3.easeBounce)
                .attr("d", lineFunction)
                .attr('opacity', 1);
        });
    });


function drawPoints(dataPoints) {

    svg2.selectAll('.myCircles')
        .data(dataPoints)
        .attr('cx',function(d){
            return d.x*0.7-width*0.07;
        })
        .attr('cy', function(d){
            return d.y*0.7+15;
        })
        .attr('r', function(d){
            return d.r;
        })
        .attr('fill', function(d){
            return d.fill;
        });

}

var lineFunction = d3.line()
    .x(function(d){
        return d.x*0.7 - width*0.07;
    })
    .y(function(d){
        return d.y*0.7+15;
    })
    .curve(d3.curveCardinalClosed);
