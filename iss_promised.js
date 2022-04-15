const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org/?format=json');
};

const fetchCoordsByIP = function(body) {
  let ip = JSON.parse(body).ip; 
  return request(`https://api.freegeoip.app/json/${ip}?apikey=95709d00-bc2c-11ec-bd59-bd465d705079`);
};

const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  return request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
}

const printPassTimes = function(passTimes) {
  for (let pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    console.log(`Next pass at ${datetime.toString()} for ${pass.duration} seconds!`);
  }
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    })
}; 


module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation, printPassTimes };