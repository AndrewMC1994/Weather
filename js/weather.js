function geoLocation() {
    function getCity(latlng) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          'latLng': latlng
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              //console.log(results[0].address_components);
              if (results[0]) {
                var city;
                var i = 0;
                while (!city && i < results[0].address_components.length) {
                  if (results[0].address_components[i].types.indexOf("locality") >= 0) {
                    city = results[0].address_components[i].long_name;                                       
                    weather(city);
                  }
                  i++;
                }
              }
            } 
            else {
              console.log("Could not find city");
            }
          });
    }

    function processUserLoc() {
      //check for navigator
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {

          var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          getCity(latlng);
        });
      } 
      else {
        //error function - location not available
        alert("location is not available")
      }
    }

    processUserLoc();
}

function weather(city){
  var url = "https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?";
  var key = "3a53d3f03d189f460e7bd9e53adfa628"
  
  console.log(url + 'q=' + city + "&APPID=" + key +"&units=metric");
  
  $.getJSON(url + 'q=' + city + "&APPID=" + key +"&units=metric", function(data){
    var main = data.main, weather = data.weather[0], temp = main.temp.toFixed(1) + "&deg; C", name = data.name;
    document.getElementById('temp').innerHTML = temp;      
    document.getElementById('city').innerHTML = name;
    document.getElementById('data').innerHTML =  weather.description.split(' ').map(function(elem){ return elem[0].toUpperCase() + elem.slice(1)}).join(' ');
    var icon = "http://openweathermap.org/img/w/" + weather.icon + ".png";
    document.getElementById('icon').innerHTML = '<img src='+icon+'>';
    background(name);
    setBackgroundGif(weather.main);
  });  
  
}; 

function converter(temp){
  var temp2 = temp.slice(0,2);
  if(temp[temp.length - 1] === 'C'){
    document.getElementById('convert').innerHTML = 'C';
    return (32 + temp2 * 1.8).toFixed(1)  +  "&deg; F";        
  }
  if(temp[temp.length - 1] === 'F') {
    document.getElementById('convert').innerHTML = 'F';
    return Math.round((temp2 - 32) / 1.8).toFixed(1) +  "&deg; C";
  }
}

$('#convert').click(function(){
  var temp = document.getElementById('temp').innerHTML;
  document.getElementById('temp').innerHTML = converter(temp);
});

$('#locate').click(function(e){
  var city = $('#search').val();  
  if(!city){
    $('#search').attr('placeholder', 'Invalid');
  }
  else{
    $('#search').attr('placeholder', 'Enter City Name');
  }
  weather(city);
});

$('#search').keypress(function (e) {
 var key = e.which;
 if(key == 13){
    $('#locate').click();
    return false;  
 }
});   

geoLocation();