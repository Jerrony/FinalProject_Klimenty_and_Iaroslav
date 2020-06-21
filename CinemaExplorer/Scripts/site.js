let userLatitude;// = 45.455492;
let userLongitude;// = -75.764443;

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};




function ShowOnMap(parkName, latitude, longitude) {
    if ($("#route").prop("checked")) {
        $("#map").html("<img src='https://open.mapquestapi.com/staticmap/v5/map?start=" + userLatitude + "," + userLongitude + "&end=" + latitude + "," + longitude + "&key=k9HTG6O937BQskwhxQv5g3zxyU8d2D8D&banner=" + parkName + "&size=800,600' />");
    } else {
        $("#map").html("<img src='https://open.mapquestapi.com/staticmap/v5/map?locations=" + userLatitude + "," + userLongitude + "||" + latitude + "," + longitude + "&key=k9HTG6O937BQskwhxQv5g3zxyU8d2D8D&banner=" + parkName + "&size=800,600' />");
    }
}

$(function () {
    function GetLocation() {
        $("#map").html("<img src='https://open.mapquestapi.com/staticmap/v5/map?locations=" + userLatitude + "," + userLongitude + "&key=k9HTG6O937BQskwhxQv5g3zxyU8d2D8D&banner=Your%20Location&size=800,600' />");

        getParkList();
    }

    function getParkList() {
        $.getJSON("https://maps.ottawa.ca/arcgis/rest/services/Parks_Inventory/MapServer/24/query?where=1%3D1&outFields=*&outSR=4326&f=json", function (data) {
            $("#parkList").empty();
            var counter = 0;
            $.each(data.features, function (index, value) {
                var from = { latitude: userLatitude, longitude: userLongitude };
                var to = { latitude: value.attributes.LATITUDE, longitude: value.attributes.LONGITUDE };
                value.attributes.DISTANCE = calculate(from, to);
                if (parseFloat($("#range").val()) > value.attributes.DISTANCE) {
                    $("#parkList").append("<div class='row park-item'><div><a onclick=\"ShowOnMap('" + value.attributes.NAME + "', '" + value.attributes.LATITUDE + "', '" + value.attributes.LONGITUDE + "');\">" + value.attributes.NAME + "</a></div>"
                        + "<div>" + value.attributes.ADDRESS + "</div>"
                        + "<div>Waterbody access: " + value.attributes.WATERBODY_ACCESS + "</div>"
                        + "<div>Distance: " + value.attributes.DISTANCE + " km</div>");
                    counter++;
                }                
            });
            $("#counter").html(counter); 
            console.log(counter);
        });
    }

    function calculate(from, to) {
        var fromFloat = { latitude: parseFloat(from.latitude), longitude: parseFloat(from.longitude) };
        var toFloat = { latitude: parseFloat(to.latitude), longitude: parseFloat(to.longitude) };

        var R = 6371; // km
        var deltaLatitude = toRadian(toFloat.latitude - fromFloat.latitude);
        var deltaLongitude = toRadian(toFloat.longitude - fromFloat.longitude);
        var latitude1 = toRadian(fromFloat.latitude);
        var latitude2 = toRadian(toFloat.latitude);

        var a = Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
            Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2) * Math.cos(latitude1) * Math.cos(latitude2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d.toFixed(1);
    }

    // Converts numeric degrees to radians
    function toRadian(value) {
        return value * Math.PI / 180;
    }

    function success(pos) {
        let crd = pos.coords;

        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        userLatitude = crd.latitude;
        userLongitude = crd.longitude;
        console.log(userLatitude);

        //return crd;

        GetLocation();
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }


    navigator.geolocation.getCurrentPosition(success, error, options);

    

    $("#range").change(getParkList);
});
