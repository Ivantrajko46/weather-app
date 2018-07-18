$(function() {

    const DARK_SKY_API_KEY = '6214be8799876cf770c28aea2c351644';
    const URL = 'https://api.darksky.net/forecast/';
    let icons = [{
        "clear-day": "sun",
        "clear-night": "moon",
        "rain": "rain",
        "snow": "snow",
        "sleet": "sleet",
        "wind": "wind",
        "fog": "fog",
        "cloudy": "cloud",
        "partly-cloudy-day": "cloud sun",
        "partly-cloudy-night": "cloud moon",
        "hail": "hail",
        "thunderstorm": "lightning",
        "tornado": "tornado"
    }];

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pozicija, errorPozicija);
        } else {
            console.error("Vas browser ne podrzava geolocation");
        }
    }

    function pozicija(position) {
        console.log(position);
        //todo pozivamo api
        getDarkSky(position.coords.latitude, position.coords.longitude);
        getLocationName(position.coords.latitude, position.coords.longitude).done(function(data) {
            console.log(data);
            $('.current-name-location .name')
                .html(data.results[1].formatted_address);
        });

    }

    function errorPozicija(err) {
        console.log(err);
        //todo obavesti koja je greska
    }

    function getDarkSky(lat, lng) {
    	$("ul.all-day").empty();
        $.ajax({
            url: `${URL}${ DARK_SKY_API_KEY}/${lat},${lng}?units=si&exclude=hourly%2Cminutely&lang=sr`,
            type: 'GET',
            dataType: 'jsonp',
            crossDomain: true

        }).done(function(data) {

            console.log(data);

            let curentlyLeft = $('.current-temperature .left');
            let curentlyRight = $('.current-temperature .right');

            curentlyLeft.find('.temperature').html(`${Math.floor(data.currently.temperature)} &#8451;`);
            curentlyLeft.find('.temperature-2').html(`${data.currently.summary}`);

            curentlyRight.find('ul li.mba span').html(`${Math.floor(data.currently.pressure)} mba`);
            curentlyRight.find('ul li.humedity span').html(`${Math.floor(data.currently.humidity * 100)} %`);
            curentlyRight.find('ul li.wind span').html(`${Math.floor(data.currently.windSpeed * 10)} m/s`);



            data.daily.data.forEach(function(item, index) {

                if (index != 0) {

                    $("ul.all-day").append(`<li class="hide">
                <div class="name-day">
                    ${getWeatherTime(item.time)[0]["dan"]}
                </div>
                <div class="icon">
                    <i class="climacon ${icons[0][item.icon]}"></i> 
                </div>
                <div class="temperature">
                   ${Math.ceil(item.temperatureMax)}&#8451; <br>
                   ${Math.ceil(item.temperatureMin)}&#8451;
                </div>
            </li> `);
                }

            });

            let interval = 1000;
            $("ul.all-day").children().each(function(index, item) {
                setTimeout(function() {
                    $(item)
                        .removeClass('hide')
                        .addClass('slideInUp')
                        .addClass('animated');
                    interval += 1000;
                });

            });


        }).fail(function(err) {
            console.log(err);
        })
    }

    function getWeatherTime(timestamp) {
        var d = new Date(timestamp * 1000);

        var dan = d.getDate();
        var mesec = d.getMonth();
        var weekday = d.getDay();
        var h = d.getHours();

        var daniunedelji = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Cetvrtak', 'Petak', 'Subota'];
        var meseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];

        var response = [{ "datum": dan, "mesec": meseci[mesec], "dan": daniunedelji[weekday], "sati": h }];
        return response;
        //time.text(daniunedelji[weekday] + ', ' + dan + '. ' + meseci[mesec] + ' - ' + h + 'h');
    }




    function getLocationName(lat, lng) {
        return $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyCO6KL5ndPErjDY1xEuGM6lRn6f3JjjBpQ',
            dataType: 'json'
        });
    }

    function getLocationLatLng(address) {
        return $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyCO6KL5ndPErjDY1xEuGM6lRn6f3JjjBpQ',
            dataType: 'json'
        });
    }

    $('button#goAddress').click(function() {

        let input = $('#addressInput')[0];
        if ($(input).val().length > 0) {
            getLocationLatLng($(input).val())
                .done(function(response) {

                    let position = response.results[0].geometry.location;
                    getDarkSky(position.lat, position.lng);
                    getLocationName(position.lat, position.lng).done(function(data) {
                        console.log(data);
                        $('.current-name-location .name')
                            .html(data.results[1].formatted_address);
                    });

                });
        }
    });

    getLocation();

});