var map;

//function init() {
$(document).ready(function() {

    map = new mapboxgl.Map({
        container: 'map',
        minZoom: 2,
        maxZoom: 18,
        hash: true,
        style: 'https://geoserveis.icgc.cat/contextmaps/icgc.json',
        center: [1.88979, 41.69589],
        zoom: 13.61,
        attributionControl: false,
        preserveDrawingBuffer: true
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.AttributionControl({
        compact: true
    }));

    var troballocs = Troballocs({ container: "cercaLlocs", map: map });

    //initLlocs('#controlbox');

    $('#bt_capture').on('click', function() {
        map.getCanvas().toBlob(function(blob) {
            saveAs(blob, 'captura_mapa.png');
        });
    });

    $('#bt_pitch').on('click', function() {
        var pitch = parseInt(map.getPitch());
        pitch == 60 ? pitch = 0 : pitch = pitch + 30;
        map.easeTo({
            'pitch': pitch
        });

    });

    $('#toggleBtn').click(function() {
        if ($('#sidebar').hasClass("movein")) {
            $('#sidebar').removeClass("movein").addClass("moveout");
            $('#toggleBtn > i').removeClass("left").addClass("right");
        } else {
            $('#sidebar').removeClass("moveout").addClass("movein");
            $('#toggleBtn > i').removeClass("right").addClass("left");
        }
    });

});