import axios from 'axios';
import stops from './info/stops';
import lines from './info/lines';

const mapFunctions = {
  icons: {
    bus: require('./img/bus.png'),
    tram: require('./img/tram.png'),
    metro: require('./img/metro.png'),
  },

  addToMyLines: async selection => {
    let newShape = mapFunctions.filterLines(
      lines,
      selection.nroLine,
      selection.variantLine,
    );

    let newStops = mapFunctions.filterStops(
      stops,
      selection.nroStop,
      selection.variantStop,
    );

    return {
      newLine: {
        line: {
          name: selection.nroLine,
          shape: newShape,
          stops: newStops,
        },
        selection,
      },
    };
  },

  getVehicles: async stops => {
    return new Promise((resolve, reject) => {
      mapFunctions
        .getLine(stops.join('%2C'))
        .then(data => {
          if (data) resolve(data);
          //else reject ("error")
        })
        .catch(err => reject(err));
    });
  },

  getTerminalName: stopId => {
    return stops.features.find(stop => stop.properties.stop_id === stopId);
  },

  getStopFromVehiclePosition: vehicle => {
    return stops.features.filter(
      stop =>
        stop.properties.stop_id === vehicle.pointId &&
        stop.properties.terminus ===
          mapFunctions.getTerminalName(vehicle.pointId).properties.terminus,
    );
  },

  getLineShape: stopShape => {
    let LIGNE = mapFunctions.setVariantLine(
      stopShape.properties.numero_lig,
      stopShape.properties.mode,
    );
    let VARIANTE = stopShape.properties.variante === '1' ? 901 : 902;
    return lines.features.find(
      line =>
        line.properties.LIGNE === LIGNE &&
        line.properties.VARIANTE === VARIANTE,
    );
  },

  updateAllVehicles: async nroStops => {
    let features = [];
    return nroStops.map(async stop => {
      return new Promise(async (resolve, reject) => {
        let data = await mapFunctions.getVehicles(stop);
        if (data.lines.length > 0) {
          data.lines.map(line => {
            line.vehiclePositions.map(vehicle => {
              let stopsShape = mapFunctions.getStopFromVehiclePosition(vehicle);
              stopsShape.map(stop => {
                let linesShape = mapFunctions.getLineShape(stop);
                if (linesShape) {
                  let coordinates = mapFunctions.getPosition(
                    mapFunctions.findStop(
                      linesShape.geometry.coordinates,
                      stop.geometry.coordinates,
                      0.01,
                    ),
                    vehicle.distanceFromPoint,
                  );
                  coordinates
                    ? features.push(
                        mapFunctions.createVehicleFeature(
                          [coordinates[0], coordinates[1]],
                          stop,
                        ),
                      )
                    : null;
                }
              });
            });
          });
        }
        if (features.length > 0) resolve(features);
      });
    });
  },

  createVehicleFeature: (coordinates, stop) => {
    return {
      type: 'Feature',
      properties: {
        numero_lig: stop.properties.numero_lig,
        variante: stop.properties.variante,
        mode: stop.properties.mode,
      },
      geometry: {type: 'Point', coordinates: coordinates},
    };
  },

  initLines: allStops => {
    let allLines = [];
    allStops.features.map(x => {
      if (
        !allLines.find(
          y =>
            y.nroStop === x.properties.numero_lig &&
            y.direction === x.properties.terminus,
        )
      )
        allLines.push({
          nroStop: x.properties.numero_lig,
          variantStop: x.properties.variante,
          direction: x.properties.terminus,
          nroLine: mapFunctions.setVariantLine(
            x.properties.numero_lig,
            x.properties.mode,
          ),
          variantLine: x.properties.variante === '1' ? 901 : 902,
          mode:
            x.properties.mode === 'B'
              ? 'Bus'
              : x.properties.mode === 'T'
              ? 'Tram'
              : x.properties.mode === 'M'
              ? 'Metro'
              : null,
          icon:
            x.properties.mode === 'B'
              ? mapFunctions.icons.bus
              : x.properties.mode === 'T'
              ? mapFunctions.icons.tram
              : x.properties.mode === 'M'
              ? mapFunctions.icons.metro
              : mapFunctions.icons.bus,
        });
    });

    return allLines;
  },

  setVariantLine: (variantStop, mode) => {
    let toStrArr = String(variantStop)
      .split('')
      .reverse();
    while (toStrArr.length < 3) {
      toStrArr.push('0');
    }
    return toStrArr.reverse().join('') + mode.toLowerCase();
  },

  filterLines: (allLines, myLine, variant) => {
    let features = allLines.features.filter(
      line =>
        line.properties.LIGNE === myLine &&
        line.properties.VARIANTE === variant,
    );

    return {
      ...allLines,
      features: allLines.features.filter(
        line =>
          line.properties.LIGNE === myLine &&
          line.properties.VARIANTE === variant,
      ),
    };
  },

  filterStops: (allStops, line, variant) => {
    return allStops.features.filter(
      stop =>
        stop.properties.numero_lig === line &&
        stop.properties.variante === variant,
    );
  },

  getPosition: (line, distanceFromStop) => {
    return line.find(
      x =>
        mapFunctions.distance(
          parseFloat(x[1]),
          parseFloat(x[0]),
          parseFloat(line[0][1]),
          parseFloat(line[0][0]),
          'K',
        ) >=
        parseFloat(distanceFromStop) / 1000,
    );
  },

  findStop: (line, stopCoordinates, precision) => {
    return line[0].slice(
      line[0].indexOf(
        line[0].find(
          x =>
            mapFunctions.distance(
              parseFloat(x[1]),
              parseFloat(x[0]),
              parseFloat(stopCoordinates[1]),
              parseFloat(stopCoordinates[0]),
              'K',
            ) < precision,
        ),
      ),
    );
  },

  distance: (lat1, lon1, lat2, lon2, unit) => {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == 'K') {
        dist = dist * 1.609344;
      }
      if (unit == 'N') {
        dist = dist * 0.8684;
      }
      return dist;
    }
  },

  getStopCoordinates: (allStops, vehicle, lineId) => {
    return allStops.find(
      stop =>
        stop.properties.numero_lig === lineId &&
        stop.properties.stop_id.includes(vehicle.pointId),
    );
  },

  getLine: async line => {
    // let getUrl =
    //   'https://opendata-api.stib-mivb.be/OperationMonitoring/4.0/VehiclePositionByLine/' +
    //   line;

    //  return axios
    //   .get(getUrl, {
    //     headers: {
    //       Accept: 'application/json',
    //       Authorization: 'Bearer bd52af8f28411e9ea23d92151cc57bcd', //the token is a variable which holds the token
    //     },
    //   })

    let getUrl = 'http://localhost:5000/getVehicules/' + line;

    return axios
      .get(getUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer bd52af8f28411e9ea23d92151cc57bcd', //the token is a variable which holds the token
        },
      })

      .then(res => {
        if (res.status === 200) {
          return res.data;
        } else {
          return 'Error API Response not 200';
        }
      })
      .catch(err => console.log('Error API Response: ', err));
  },
};
module.exports = mapFunctions;
