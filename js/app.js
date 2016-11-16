var orientDbUrl = "/command/codemotiondb/";
var orientDbUser = "reader";
var orientDbPass = "reader";

var nodes = [];
var edges = [];
var network = null;




function draw() {
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            borderWidth: 4,
            size: 30,
            color: {
                border: '#222222',
                background: '#666666'
            },
            font: {color: '#eeeeee'}
        },
        edges: {
            color: 'lightgray'
        }
    };
    network = new vis.Network(container, data, options);
    network.on("click", function(params){
        try{
            if(nodes.length>0) {
                showProfileDetails(params.nodes[0]);
            }
        }catch(x){

        }
    });
}

function loadNodes(input) {
    nodes = [];
    input.forEach(function (x) {
        nodes.push({id: x["@rid"], shape: 'circularImage', image: x.img, label: x.name})
    });
}

function loadEdges(input) {
    edges = [];
    input.forEach(function (x) {
        var newEdge = {
            id: x["@rid"],
            from: x["out"],
            to: x["in"],
            arrows: 'to',
        };
        edges.push(newEdge);
    });
}

var loadGraph = function () {
    $.ajax({
        type: "POST",
        url: orientDbUrl + "sql/-/-1",
        dataType: 'json',
        data: JSON.stringify({
            "command": "SELECT FROM Account limit -1",
            "mode": "graph"
        }),
        async: true,
        headers: {
            "Authorization": "Basic " + btoa(orientDbUser + ":" + orientDbPass)
        },
        success: function (data) {
            loadNodes(data.graph.vertices);
            loadEdges(data.graph.edges);
            draw();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseJSON.errors[0].content);
        }
    });
}


function showProfileDetails(nodeId) {
    $.ajax({
        type: "POST",
        url: orientDbUrl + "sql/-/-1",
        dataType: 'json',
        data: JSON.stringify({
            "command": "SELECT FROM "+nodeId,
            "mode": "graph"
        }),
        async: true,
        headers: {
            "Authorization": "Basic " + btoa(orientDbUser + ":" + orientDbPass)
        },
        success: function (data) {
            var queryResult = data.graph.vertices;
            if(queryResult.length > 0){
                window.open("http://twitter.com/"+queryResult[0].name, "_blank");
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseJSON.errors[0].content);
        }
    });
}
