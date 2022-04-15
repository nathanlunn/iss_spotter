const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation, printPassTimes } = require('./iss_promised');

// fetchMyIP()
//   .then(fetchCoordsByIP)
//   .then(fetchISSFlyOverTimes)
//   .then(nextISSTimesForMyLocation)
//   .catch(error => console.log(error));


nextISSTimesForMyLocation()
  .then(printPassTimes)
  .catch(error => console.log(error));
