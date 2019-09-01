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

    let icon =
      selection.mode === 'Tram'
        ? mapFunctions.icons.tram
        : selection.mode === 'Bus'
        ? mapFunctions.icons.bus
        : selection.mode === 'Metro'
        ? mapFunctions.icons.metro
        : mapFunctions.icons.bus;

    let markers = await mapFunctions.updateMarkers(
      lines,
      mapFunctions.getLine,
      newStops,
      selection,
    );

    return {
      line: {
        name: selection.nroLine,
        shape: newShape,
        stops: newStops,
      },
      markers,
      selection,
      iconType: icon,
    };
  },

  updateMarkers: (lines, getLine, stops, selection) => {
    return new Promise((resolve, reject) => {
      getLine(selection.nroStop).then(data => {
        let newMarkers = [];
        if (data.lines[0]) {
          data.lines[0].vehiclePositions.map(vehicle => {
            if (mapFunctions.getStopCoordinates(stops, vehicle, selection)) {
              let line = lines.features.filter(
                line =>
                  line.properties.LIGNE === selection.nroLine &&
                  line.properties.VARIANTE === selection.variantLine,
              )[0].geometry.coordinates;
              let coordinates = mapFunctions.getPosition(
                mapFunctions.findStop(
                  line,
                  mapFunctions.getStopCoordinates(stops, vehicle, selection)
                    .geometry.coordinates,
                  0.01,
                ),
                vehicle.distanceFromPoint,
              );
              coordinates
                ? newMarkers.push([coordinates[0], coordinates[1]])
                : null;
            }
          });
        }

        if (newMarkers) resolve(newMarkers);
        else reject([]);
      });
    });
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

  getStopCoordinates: (allStops, vehicle, selection) => {
    return allStops.find(
      stop =>
        stop.properties.numero_lig === selection.nroStop &&
        stop.properties.variante === selection.variantStop &&
        stop.properties.stop_id.includes(vehicle.pointId),
    );
  },

  getLine: async line => {
    let getUrl =
      'https://opendata-api.stib-mivb.be/OperationMonitoring/4.0/VehiclePositionByLine/' +
      line;
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
          return 'error';
        }
      })
      .catch(err => console.log('catch', err));
  },
};
module.exports = mapFunctions;
