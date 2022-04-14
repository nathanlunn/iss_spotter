const request = require('request');
/*
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
*/
const fetchMyIP = function(callback) {
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, JSON.parse(body).ip);
    return;
  });
};

const fetchCoordsByIp = function(ip, callback) {
  request(`https://api.freegeoip.app/json/${ip}?apikey=95709d00-bc2c-11ec-bd59-bd465d705079`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body);

    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(cords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${cords.latitude}&lon=${cords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS fly over times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const passTimes = JSON.parse(body).response;
    callback(null, passTimes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
      if (error) {
        return callback(error, null);
      }
      // next
      fetchCoordsByIp(ip, (error, coordinates) => {
          if (error) {
            return callback(error, null);
          }
          // next
          fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
              if (error) {
                return callback(error, null);
              }
              callback(error, passTimes);
            });
        });
    });
}

module.exports = { fetchMyIP, fetchCoordsByIp, fetchISSFlyOverTimes, nextISSTimesForMyLocation };