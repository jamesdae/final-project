import React from 'react';

export default function DirectionsPanel({ setPrevList, setViewingIds, mappedIds, viewingIds, addedLocations }) {
  if (!Array.isArray(viewingIds) || !viewingIds.length > 1) return;
  const coordinatesWithNulls = mappedIds.map(place => {
    if (viewingIds.includes(place.locationId)) {
      return `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`;
    } else {
      return null;
    }
  });
  const coordinates = coordinatesWithNulls.filter(coordinate => coordinate !== null);
  const waypoints = coordinates.slice(1, -1).map(coord => ({ location: coord }));
  const daddr = coordinates[coordinates.length - 1];
  const origin = coordinates[0];

  const savedroute = viewingIds.map(id => addedLocations.find(location => location.locationId === id));

  const link = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${daddr}&waypoints=${waypoints.map(waypoint => waypoint.location).join('|')}`;

  return (
    <div className="offcanvas offcanvas-start" data-bs-backdrop="false" tabIndex="-1" id="offcanvasDirections" aria-labelledby="offcanvasHeader">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasHeader">Route Options</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
      </div>
      <div className="offcanvas-body">
        <div id='panel' />
        <div className="dropdown mt-3">
          <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            More Options
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => {
              // eslint-disable-next-line no-console
              console.log(savedroute);
              savedroute.forEach(location => {
                const request = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Access-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFzdGVyIiwiaWF0IjoxNjc2ODU1MjEyfQ.FtJD2rQSLeEKLrJ6EWEJZBE9JYYf0ENjYbcWF9arKno'
                  },
                  body: JSON.stringify({ myListItemsId: location.myListItemsId })
                };
                fetch('/api/routelocations', request)
                  .then(res => res.json())
                  // .then(newLocation => {
                  //   console.log(newLocation);
                  // })
                  .catch(err => console.error('Error:', err));
              });
            }}><i className="fa-solid fa-road-circle-check listicon" />Save Route</a></li>
            <li><a className="dropdown-item" href="#" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => {
              setPrevList();
              setViewingIds();
            }}><i className="fa-solid fa-trash-can listicon" />Clear Pins</a></li>
            {Array.isArray(viewingIds) && viewingIds.length > 1
              ? (
                <li><a className="dropdown-item" href={link} target="_blank" rel="noopener noreferrer" aria-label="Close"><i className="fa-brands fa-google listicon" />Open route in Google Maps </a></li>
                )
              : (
                  null
                )
            }
          </ul>
        </div>
      </div>
    </div>
  );
}