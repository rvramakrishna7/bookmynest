mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat].
  zoom: 9, // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: "cornflowerblue" })
  .setLngLat(coordinates)
  .addTo(map);
6;
