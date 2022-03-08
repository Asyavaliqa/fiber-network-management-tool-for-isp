import coreColor from '../../utility/coreColor.js';

export default function (connection, map) {
  const {
    name,
    location,
    totalCore,
    totalConnected,
    type,
    childrens,
    _id,
    markers,
  } = connection;
  const polyline = new google.maps.Polyline({
    path: location.coordinates.map((item) => {
      return { lat: item[0], lng: item[1] };
    }),
    geodesic: true,
    strokeColor: '#142F43',
    strokeOpacity: 1.0,
    strokeWeight: 4,
  });

  polyline.setMap(map);

  const colorCores = coreColor.slice(0, totalCore);

  let coreUsed = '';
  colorCores.forEach((item) => {
    const targetColor = childrens.find(
      (child) => child.color === item.colorName
    );
    if (targetColor) {
      coreUsed += `
        <p class="mb-1">${item.colorName} : used</p>
        `;
    } else {
      coreUsed += `
        <p class="mb-1">${item.colorName} : available</p>
        `;
    }
  });

  const lengthInMeters = google.maps.geometry.spherical.computeLength(
    polyline.getPath()
  );

  const infoWindow = new google.maps.InfoWindow({
    content: `
    <p class="mb-1 fw-bold">${name}</p>
    <hr class="my-1" />
    <p class="mb-1"><span class="fw-bold">Connection Type:</span> ${type}</p>
    <p class="mb-1"><span class=" fw-bold">total Used Core:</span> ${totalConnected}/${totalCore}</p>
    <p class="mb-1"><span class=" fw-bold">Distance:</span> ${Math.ceil(
      lengthInMeters
    )}m</p>
    <p class="mb-1 fw-bold">Core Available: </p>
    <hr class="my-1 w-50" />
    ${coreUsed}
    `,
  });

  google.maps.event.addListener(polyline, 'click', function (event) {
    window.selectPolyline(event.latLng, _id);
  });

  polyline.addListener('mouseover', (event) => {
    infoWindow.setPosition(event.latLng);
    infoWindow.open(map);
  });

  polyline.addListener('mouseout', () => {
    infoWindow.close();
  });

  // printing tj box on the map

  const icon = {
    url: '../../../assets/img/tj.png',
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(15, 15),
  };
  markers.forEach((item) => {
    const [lat, lng] = item.location.coordinates;
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      icon,
    });
    google.maps.event.addListener(marker, 'click', function (event) {
      window.selectPolyline(event.latLng, _id);
    });
  });
}
