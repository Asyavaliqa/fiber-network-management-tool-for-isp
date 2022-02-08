import drawAllPolyline from '../googleMap/drawAllPolyline.js';

let map;

const script = document.createElement('script');
script.src =
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyCzBmP_s-e1BUzOyvk9YnoZtIX40PwWfoM&callback=initMap';
script.async = true;

window.initMap = function () {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 23.919524586722066, lng: 90.25663246242456 },
    zoom: 15,
  });
  drawAllPolyline(map);
};

document.head.appendChild(script);
