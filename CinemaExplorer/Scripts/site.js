let userLatitude, userLongitude;

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function ShowOnMap(cinemaName, latitude, longitude) {
    if ($("#route").prop("checked")) {
        $("#map").html("<img src='https://open.mapquestapi.com/staticmap/v5/map?start=" + userLatitude + "," + userLongitude + "&end=" + latitude + "," + longitude + "&key=k9HTG6O937BQskwhxQv5g3zxyU8d2D8D&banner=" + cinemaName + "&size=850,600' />");
    } else {
        $("#map").html("<img src='https://open.mapquestapi.com/staticmap/v5/map?locations=" + userLatitude + "," + userLongitude + "||" + latitude + "," + longitude + "&key=k9HTG6O937BQskwhxQv5g3zxyU8d2D8D&banner=" + cinemaName + "&size=850,600' />");
    }
}

$(function () {
    function GetLocation() {
        $("#map").html("<img src='https://open.mapquestapi.com/staticmap/v5/map?locations=" + userLatitude + "," + userLongitude + "&key=k9HTG6O937BQskwhxQv5g3zxyU8d2D8D&banner=Your%20Location&size=850,600' />");
        $("#userLocation").append("<div class='location'><div><h4><label>Latitude:</label>" + userLatitude + "</h4></div>"
            + "<div><h4><label>Longitude:</label>" + userLongitude + "</h4></div></div>"
        );                
    }    

    function getCinemaList() {
        $.ajaxSetup({
            headers: {
                'apikey': 'Rtg62UFwNintRmobP0JhlY8GpDJ0IK89'
            }
        });
        //$.getJSON('https://api.internationalshowtimes.com/v4/cinemas/?countries=CA', function (data) {
        $.getJSON('https://api.internationalshowtimes.com/v4/cinemas/?location=' + userLatitude + ',' + userLongitude + '&distance=' + $("#range").val(), function (data) {
            console.log(data);
            $("#cinemaList").empty();

            var counter = 0;
            $.each(data.cinemas, function (index, value) {
                    var from = { latitude: userLatitude, longitude: userLongitude };
                    var to = { latitude: value.location.lat, longitude: value.location.lon };
                    value.location.distance = calculate(from, to);

                $("#cinemaList").append("<div class='cinema-item'><div><h3 id='cinemaName'><a onclick=\"ShowOnMap('" + value.name + "', '" + value.location.lat + "', '" + value.location.lon + "');\">" + value.name + "</a></h3></div>"
                    + "<div id='cinemaDetails'><div><strong>Address: </strong>" + value.location.address.display_text + "</div>"
                    + "<div><strong>Website: </strong><a href='" + value.website + "'>" + value.website +"</a></div>"
                    + "<div><strong>Telephone: </strong><a href='tel:" + value.telephone + "'>" + value.telephone + "</a></div>"
                    + "<div><strong>Distance: </strong> " + value.location.distance + " km</div></div>");
                counter++;
            });
            $("#counter").html(counter);
        });
    }

    function calculate(from, to) {
        var fromFloat = { latitude: parseFloat(from.latitude), longitude: parseFloat(from.longitude) };
        var toFloat = { latitude: parseFloat(to.latitude), longitude: parseFloat(to.longitude) };

        var R = 6371;
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

        GetLocation();

        getCinemaList();
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);

    $("#range").change(getCinemaList);
});
