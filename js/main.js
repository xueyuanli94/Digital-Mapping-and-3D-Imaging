// have to declare boydMap in the global scope to get some things working
var boydMap;

//function to instantiate the Leaflet map
function createMap(){
    boydMap = L.map('map',{
        center: [72.95,-27.3],
        zoom: 10,
        maxZoom: 13 // Esri World Imagery basemap doesn't work past this zoom level -- consider looking for another basemap? (Custom one from Mapbox?)
    });

    //call getData function
    getData(boydMap);

    // "About Louise" modal
    $('#about-louise').click(function() {
        $('#louiseModal').modal('toggle');
    });

    // "About AGSL" modal
    $('#about-agsl').click(function() {
        $('#agslModal').modal('toggle');
    });

}

//function to retrieve data and place it on the map
function getData(map){

    //add OSM baselayer
    var satellite = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(boydMap);


    var journeyUrl = 'data/journey.png';
    var journeyMapBounds = [[73.1463636399943, -27.8191568294706], [72.7150485066271, -27.2272940697481]];
    var journeyMapLayer = L.imageOverlay(journeyUrl, journeyMapBounds);


    var thirtiesMapUrl = 'data/map.png';
    var thirtiesMapBounds = [[73.1725143552295, -29.075878848967], [71.7000485066271, -25.8007621693321]];
    var thirtiesMapLayer = L.imageOverlay(thirtiesMapUrl, thirtiesMapBounds);


    var histmaps = L.layerGroup([journeyMapLayer, thirtiesMapLayer]);
    var baseMaps = {
        "Aerial Imagery": satellite
    };
    var overlayMaps = {
        "Louise's Journey Map": journeyMapLayer,
        "1933 Topo Map": thirtiesMapLayer
    };
    L.control.layers(baseMaps, overlayMaps).addTo(map);

    // if user selects one of the image layers, turn the other one off
    map.on('overlayremove', function(x) {
        if (map.hasLayer(journeyMapLayer) || map.hasLayer(thirtiesMapLayer)) {
            // do nothing
        } else {
            removeOpacitySlider();
            // if window is small viewport, hide AGSL / About links
//      var windowWidth = $(window).width();
//      if (windowWidth <= 600) {
//        $('#about-agsl').show();
//        $('#about-louise').show();
//      }原来就有的注释
        }
    });

    map.on('overlayadd', function(x) {
        if (x.name === "Louise's Journey Map") {
            removeOpacitySlider();
            setTimeout(function() {
                addOpacitySlider(journeyMapLayer);
                map.removeLayer(thirtiesMapLayer)
            }, 10);
        } else if (x.name === "1933 Topo Map") {
            removeOpacitySlider();
            setTimeout(function() {
                addOpacitySlider(thirtiesMapLayer);
                map.removeLayer(journeyMapLayer)
            }, 10);
        }
        x.layer.setOpacity(1);
        //原来就有的
        // if window is small viewport, hide AGSL / About links
//    var windowWidth = $(window).width();
//    if (windowWidth <= 600) {
//      var mapHasAGSLButton = $('#about-agsl').is(':visible');
//      var mapHasLouiseButton = $('#about-louise').is(':visible');
//      if(mapHasAGSLButton && mapHasLouiseButton) {
//        $('#about-agsl').hide();
//        $('#about-louise').hide();
//      }
//    } 到这里为止的注释
    })

    // var opacitySlider = L.control({position: 'bottomright'});
    // opacitySlider.onAdd = function (map) {
    //     this._div = L.DomUtil.create('div', 'opacity-slider'); // create a div with a class "opacity-slider"
    //     this.update();
    //     return this._div;
    // };
    // // this is where the actual HTML for the custom control will go
    // opacitySlider.update = function (props) {
    //     this._div.innerHTML = '<p>Current opacity: <span id="current-opacity">100%</span></p><input type="range" id="opacity-changer" min="0" max="10" value="10"></input>';
    // };

    // function addOpacitySlider(currentLayer) {
    //     opacitySlider.addTo(map);
    //     // Disable dragging when user's cursor enters the element
    //     opacitySlider.getContainer().addEventListener('mouseover', function () {
    //         map.dragging.disable();
    //     });
    //     // Re-enable dragging when user's cursor leaves the element
    //     opacitySlider.getContainer().addEventListener('mouseout', function () {
    //         map.dragging.enable();
    //     });
    //     // create event listener for opacity range slider
    //     $("#opacity-changer").on("input", function(e) {
    //         var sliderValue = $(this).val();
    //         currentLayer.setOpacity(sliderValue / 10);
    //         $('#current-opacity').text((sliderValue * 10) + "%");
    //     });
    // }

    // function removeOpacitySlider() {
    //     opacitySlider.remove();
    // }

    //load the data
    // $.ajax("data/points.json",{
    //     dataType: "json",
    //     success: function(response){
    //         //create marker options
    //         var geojsonMarkerOptions = {
    //             radius: 10,
    //             fillColor: "#ff7800",
    //             color: "#000",
    //             weight: 1,
    //             opacity: 1,
    //             fillOpacity: 0.8
    //         };
    //
    //         //create a Leaflet GeoJSON layer and add it to the map
    //         var photoPoints = L.geoJSON(response.features, {
    //             pointToLayer: function (feature, latlng){
    //                 //console.log(feature);
    //                 //console.log(latlng);
    //                 return L.circleMarker(latlng, geojsonMarkerOptions);
    //             },
    //             onEachFeature: function (feature, layer) {
    //                 layer.on('click', function(e) {
    //                     popupContent(feature, layer);
    //                 });
    //             }
    //         });
    //
    //         // create a Leaflet markercluster from the GeoJSON layer and add it to the map
    //         //basically just there for the options but empty
    //         var bunchedMarkers = L.markerClusterGroup({
    //             spiderfyOnMaxZoom: false,
    //             showCoverageOnHover: false,
    //             disableClusteringAtZoom: boydMap.options.maxZoom
    //         });
    //
    //         //actually puts data in cluster group which was previously empty and basically just there for the options
    //         bunchedMarkers.addLayer(photoPoints);
    //         bunchedMarkers.addTo(map);
    //
    //         function popupContent(feature, layer) {
    //
    //             // add image to the popup
    //             var imageContent = '<a target="_blank" href="' + feature.properties['URL'] + '"><img class="img-responsive" src="' + feature.properties['Photo'] + '" /></a>';
    //
    //             // add description field(s) to the popup
    //             var dateContent = feature.properties['Date'];
    //             var descriptionContent = '';
    //             var descriptions = ['Desc_', 'Desc2', 'Desc3', 'Desc4', 'Desc5', 'Desc6', 'Desc7', 'Desc8'];
    //             for (var i = 0; i <= (descriptions.length - 1); i++) {
    //                 currentDescriptionField = feature.properties[descriptions[i]];
    //                 if (currentDescriptionField !== null) {
    //                     descriptionContent += currentDescriptionField + ' ';
    //                 }
    //             }
    //
    //             // get digital collections URL
    //             var digitalCollectionsUrl = feature.properties['URL'];
    //
    //
    //             // finally, return the popupContent variable with all the stuff
    //             $('#imageModal .put-image-here').html(imageContent);
    //             $('#imageModal .put-desc-here').html(dateContent + '. ' + descriptionContent);
    //             $('#imageModal .put-url-here').prop('href', digitalCollectionsUrl);
    //             $('#imageModal').modal('toggle');
    //         }
    //
    //         // when image modal opens, hide title/controls
    //         $('#imageModal').on('show.bs.modal', function (e) {
    //             $('#title').slideUp();
    //             $('.leaflet-control-zoom').hide();
    //             $('.leaflet-control-layers').hide();
    //             $('#about-louise').hide();
    //             $('#about-agsl').hide();
    //         });
    //         // when popup modal closes, show title/controls
    //         $('#imageModal').on('hide.bs.modal', function (e) {
    //             $('#title').slideDown();
    //             $('.leaflet-control-zoom').show();
    //             $('.leaflet-control-layers').show();
    //             $('#about-louise').show();
    //             $('#about-agsl').show();
    //         });
    //
    //
    //         // when louise modal opens, hide title/controls
    //         $('#louiseModal').on('show.bs.modal', function (e) {
    //             $('#title').slideUp();
    //             $('.leaflet-control-zoom').hide();
    //             $('.leaflet-control-layers').hide();
    //             $('#about-louise').hide();
    //             $('#about-agsl').hide();
    //         });
    //         // when title modal closes, show title/controls
    //         $('#louiseModal').on('hide.bs.modal', function (e) {
    //             $('#title').slideDown();
    //             $('.leaflet-control-zoom').show();
    //             $('.leaflet-control-layers').show();
    //             $('#about-louise').show();
    //             $('#about-agsl').show();
    //         });
    //
    //
    //         // when agsl modal opens, hide title/controls
    //         $('#agslModal').on('show.bs.modal', function (e) {
    //             $('#title').slideUp();
    //             $('.leaflet-control-zoom').hide();
    //             $('.leaflet-control-layers').hide();
    //             $('#about-agsl').hide();
    //             $('#about-louise').hide();
    //         });
    //
    //         // when agsl modal closes, show title/controls
    //         $('#agslModal').on('hide.bs.modal', function (e) {
    //             $('#title').slideDown();
    //             $('.leaflet-control-zoom').show();
    //             $('.leaflet-control-layers').show();
    //             $('#about-agsl').show();
    //             $('#about-louise').show();
    //         });
    //
    //     }
    // }
        );
}


$(document).ready(createMap);