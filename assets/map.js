import axios from "axios";

module.exports = {
    onLineSelection: (selection) => {
        let myLines = [];
        const icons = {
            bus: {
              url: "https://image.flaticon.com/icons/svg/1432/1432540.svg",
              scaledSize: {
                width: 35,
                height: 35
              }
            },
            tram: {
              url: "https://image.flaticon.com/icons/svg/1646/1646742.svg",
              scaledSize: {
                width: 35,
                height: 35
              }
            },
            metro: {
              url: "https://image.flaticon.com/icons/svg/1646/1646715.svg",
              scaledSize: {
                width: 35,
                height: 35
              }
            }
        };

        let newShape = filterLines(lines, selection.nroLine, selection.variantLine);
        let newStops = filterStops(stops, selection.nroStop, selection.variantStop);
        let icon =
          selection.mode === "Tram"
            ? icons.tram
            : selection.mode === "Bus"
            ? icons.bus
            : selection.mode === "Metro"
            ? icons.metro
            : icons.bus;
    
        let markers = await updateMarkers(
          lines,
          this.stibService,
          newStops,
          selection
        );
    
        myLines.push({
          line: {
            name: selection.nroLine,
            shape: newShape,
            stops: newStops
          },
          markers,
          selection,
          iconType: icon
          // iconType:
        });
    
        this.geojson.features.push(...newShape.features);
        this.geojson.features.push(...newStops);
        this.geojson = Object.assign({}, this.geojson);
      },

      updateMarkers: (lines, getLine, stops, selection) =>
      {
        return new Promise((resolve, reject) => {
          getLine(selection.nroStop).then(data => {
            let newMarkers = [];
            data.msg.lines[0].vehiclePositions.map(vehicle => {
              if (getStopCoordinates(stops, vehicle, selection)) {
                let line = lines.features.filter(
                  line =>
                    line.properties.LIGNE === selection.nroLine &&
                    line.properties.VARIANTE === selection.variantLine
                )[0].geometry.coordinates;
                let coordinates = getPosition(
                  findStop(
                    line,
                    getStopCoordinates(stops, vehicle, selection).geometry
                      .coordinates,
                    0.01
                  ),
                  vehicle.distanceFromPoint
                );
                coordinates
                  ? newMarkers.push([coordinates[0], coordinates[1]])
                  : null;
              }
            });
            if (newMarkers) resolve(newMarkers);
            else reject([]);
          });
        });
      },

      initLines: (allStops) =>{
        let myLines = [];
        allStops.features.map(x => {
          if (
            !myLines.find(
              y =>
                y.nroStop === x.properties.numero_lig &&
                y.direction === x.properties.terminus
            )
          )
            myLines.push({
              nroStop: x.properties.numero_lig,
              variantStop: x.properties.variante,
              direction: x.properties.terminus,
              nroLine: setVariantLine(x.properties.numero_lig, x.properties.mode),
              variantLine: x.properties.variante === "1" ? 901 : 902,
              mode:
                x.properties.mode === "B"
                  ? "Bus"
                  : x.properties.mode === "T"
                  ? "Tram"
                  : x.properties.mode === "M"
                  ? "Metro"
                  : null
            });
        });
      
        return myLines;
      },
      filterLines: (allLines, myLine, variant) =>{
        return {
          ...allLines,
          features: allLines.features.filter(
            line =>
              line.properties.LIGNE === myLine && line.properties.VARIANTE === variant
            
          )
        };
      },

      filterStops: (allStops, line, variant) => {
        return allStops.features.filter(
            stop =>
              stop.properties.numero_lig === line &&
              stop.properties.variante === variant
          );
      },

      getPosition: (line, distanceFromStop) =>{
        return line.find(
          x =>
            distance(
              parseFloat(x[1]),
              parseFloat(x[0]),
              parseFloat(line[0][1]),
              parseFloat(line[0][0]),
              "K"
            ) >=
            parseFloat(distanceFromStop) / 1000
        );
      },

      findStop: (line, stopCoordinates, precision) => 
      {
        return line[0].slice(
          line[0].indexOf(
            line[0].find(
              x =>
                distance(
                  parseFloat(x[1]),
                  parseFloat(x[0]),
                  parseFloat(stopCoordinates[1]),
                  parseFloat(stopCoordinates[0]),
                  "K"
                ) < precision
            )
          )
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
            if (unit == "K") {
              dist = dist * 1.609344;
            }
            if (unit == "N") {
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
              stop.properties.stop_id.includes(vehicle.pointId)
          );
      },

      getLine: (line) => {
          let getUrl = "http://localhost:5000/api/stib/getVehicules/" + line;
          return axios.get(getUrl, {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer bd52af8f28411e9ea23d92151cc57bcd" //the token is a variable which holds the token
            }
          })
          .then(res => {
              if(res.success){
                 return ("success")
              } else {
                return ("error")
              }
          })
          .catch(err => console.log("catch", err))
      }


    }

