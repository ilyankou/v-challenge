/**
 * Vinolygics Challenge
 * Tools: JavaScript + jQuery for getJSON() and post() functions
 * Author: Ilya Ilyankou
 * Email: ilya.ilyankou@trincoll.edu, ilyankou@gmail.com
 */

var projectID = 'mhsyd0UyTzyur42ZDI0v';
var domain = 'https://challenge.vinolytics.com/api/';

/**
 * Return a new array that does not contain duplicate objects
 * Objects are considered equal if their prop value is equal
 */
function removeDuplicates(arr, prop) {
  var newArray = [];
  var temp = {};  // temporary object to store unique wine objects

  for (i in arr) {
    temp[arr[i][prop]] = arr[i];
  }
  for (i in temp) {
    newArray.push(temp[i]);
  }
  return newArray;
 }


/**
 * Send a GET request to the API, retrieves and processes the wine list
 */
$.getJSON(domain + 'wines?project=' + projectID, function(data) {
  var wines = removeDuplicates(data.data, 'uuid');  // array of wines with duplicates removed

  var maxVintage = 0;
  var sumPrices = 0;

  var years = {}; // object where keys are years, and values are number of wine bottles to be consumed

  for (i in wines) {
    // Sum up all prices to figure out price for the average bottle
    sumPrices += wines[i].bottlePrice;

    // Update current maximum vintage if needed
    if (wines[i].vintage > maxVintage) {
      maxVintage = wines[i].vintage;
    }

    // Add this bottle to all years within its drinking window
    for (j = wines[i].windowBegin; j <= wines[i].windowEnd; j++) {
      if (years[j]) {
        years[j]++;
      } else {
        years[j] = 1;
      }
    }
  }

  var avgBottlePrice = sumPrices / wines.length;

  // Figure out all years with max number of wine bottles possible to consume
  var yearsMax = [];
  var yearsMaxValue = Math.max(...Object.values(years));
  for (y in years) {
    if (years[y] == yearsMaxValue) {
      yearsMax.push(parseInt(y));
    }
  }

  // Create a resulting object for final submission
  var result = {
    project: projectID,
    type: 'analytics',
    data: {
      avgBottlePrice: avgBottlePrice,
      maxVintage: maxVintage,
      commonYears: yearsMax
    }
  }

  console.log(result);

  // Submit solution
  $.post(domain + 'submit', result)
    .done(function(data) {
      console.log(data)
    });

});
