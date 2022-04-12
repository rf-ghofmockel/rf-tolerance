/* Foreach standard defined one exported function
Currently Standard available (2022-04-05):
- DIN13
- DIN286
- DIN2768
By definition null will be returned if an errors occurs or requested Parameters are no valid combination in the standard
*/

// all data is separated in Folder by name of the standard and in single files by mean of data
const din2768Data = require('./data/DIN2768/DIN2768DimensionData.js');

const din13DeviationData = require('./data/DIN13/DIN13DeviationData.js'); ;
const din13PitchDiameterData = require('./data/DIN13/DIN13PitchDiameterData.js');
const din13TurningData = require('./data/DIN13/DIN13TurningData.js');

const din286DeltaData = require('./data/DIN286/DIN286DeltaData.js');
const din286TypeData = require('./data/DIN286/DIN286TypeData.js');
const din286ValueData = require('./data/DIN286/DIN286ValueData.js');

try {
   if (module && module.exports) {
      module.exports = {
         ToleranceForDIN2768,
         ToleranceForDIN286,
         ToleranceForDIN13
      };
   };
} catch (e) {};

/**
 * Get the tolerance-Settings for the requested Parameters
 * Based on standard DIN2768
 * @param {string} shapetype Shape (length or radius)
 * @param {string} toleranceType Tolerance-category to be used
 * @param {number} value Measure for tolerance evaluation
 * @returns Object with minimum, maximum and range; null if not in standard defined
 */
function ToleranceForDIN2768 (shapetype, toleranceType, value) {
   function createResultObject (tolerance) {
      var minimum = tolerance * -1;
      var maximum = tolerance;
      var range = maximum - minimum;

      return {
         'minimum': minimum,
         'maximum': maximum,
         'range': range
      };
   }

   function get (shapetype, toleranceType, value) {
      try {
         var dimensions = din2768Data.getData();

         if (dimensions.has(shapetype)) {
            var shape = dimensions.get(shapetype);

            if (shape.has(toleranceType)) {
               var tolerance = shape
                  .get(toleranceType)
                  .filter(entry => entry[0] < value && entry[1] >= value);

               if (tolerance.length > 0) {
                  return createResultObject(tolerance[0][2]);
               }
            }
         }
      } catch (ex) {
         console.log(ex);
      }

      return null;

   }

   return get(shapetype, toleranceType, value);
}

/**
 * Get the tolerance-Settings for the requested Parameters
 * Based on standard DIN286
 * @param {number} nominal Nominal for evaluation
 * @param {string} type Tolerance-Category to be used
 * @param {number} value value for evaluation
 * @returns Object with minimum, maximum and range; null if not in standard defined
 */
function ToleranceForDIN286 (nominal, type, value) {
   function createResultObject (minimum, maximum) {
      var range = (maximum - minimum) / 1000;

      return {
         'minimum': minimum / 1000,
         'maximum': maximum / 1000,
         'range': range
      };
   }

   function getDeviation (nominal, type, value) {
      var typeData = din286TypeData.getData();
      if (typeData.has(type)) {
         var oneType = typeData.get(type);
         var inValueRange = oneType.filter(a => a.maxValue >= value && a.minValue <= value);

         if (inValueRange.length > 0) {

            var dimensions = [];
            for (let itemInRange of inValueRange) {
               dimensions.push(itemInRange.dimensions.filter(a => a.maximum >= nominal && a.minimum < nominal));
            }

            if (dimensions.length > 0) {
               // hasDelta normaly only defined when possible Delta
               for (let dimension of dimensions) {
                  if (dimension.length > 0) {
                     return {
                        'deviation': dimension[0].deviation,
                        'hasDelta': dimension[0].hasDelta !== undefined && dimension[0].hasDelta
                     };
                  }
               }
            }
         }
      }

      return null;
   }

   function getRangeFromValueData (nominal, value) {
      var valueData = din286ValueData.getData();
      var inValueRange = valueData.filter(a => a.minimum < nominal && a.maximum >= nominal);

      if (inValueRange.length > 0) {
         if (inValueRange[0].data.has(value)) {
            return inValueRange[0].data.get(value);
         }
      }

      return null;
   }

   function getDelta (nominal, value) {
      var deltaData = din286DeltaData.getData();
      var inValueRange = deltaData.filter(a => a.minimum < nominal && a.maximum >= nominal);

      if (inValueRange.length > 0) {
         if (inValueRange[0].data.has(value)) {
            return inValueRange[0].data.get(value);
         }
      }

      return 0;
   }

   function get (nominal, type, value) {
      try {
         var deviationAndHasDelta = getDeviation(nominal, type, value);

         if (deviationAndHasDelta != null) {

            var range = getRangeFromValueData(nominal, value);

            if (range != null) {

               var delta = deviationAndHasDelta.hasDelta ? getDelta(nominal, value) : 0;

               var minimum = 0;
               var maximum = 0;

               if (/^JS$/.test(type) || /^js$/.test(type)) {
                  minimum = -range / 2;
                  maximum = minimum + range;
               } else if (/^[a-h]{1,2}$/.test(type) || /^[J-Z][A-Z]*$/.test(type)) {
                  maximum = deviationAndHasDelta.deviation + delta;
                  minimum = maximum - range;
               } else if (/^[A-H]{1,2}$/.test(type) || /^[j-z][a-z]*$/.test(type)) {
                  minimum = deviationAndHasDelta.deviation + delta;
                  maximum = minimum + range;
               } else {
                  return null;
               }

               return createResultObject(minimum, maximum);
            }
         }
      } catch (ex) {
         console.log(ex);
      }

      return null;

   }

   return get(nominal, type, value);
}

/**
 * Get the tolerance-Settings for the requested Parameters
 * Based on standard DIN13
 * @param {number} nominal Nominal for evaluation
 * @param {boolean} inner Is inner contour
 * @param {number} pitch Pitch for evaluation
 * @param {string} toleranceDeviation Tolerance-Deviation to be used
 * @param {number} toleranceValue Tolerance-Value to be used
 * @returns Object with roughing{minimum, maximum}, pitchDiameter{minimum, maximum}, reservedDiameter, depth; null if not in standard defined
 */
function ToleranceForDIN13 (nominal, inner, pitch, toleranceDeviation, toleranceValue) {
   function createResultObject (turnedMinimum, turnedMaximum, pitchMinimum, pitchMaximum, reservedDiameter, depth) {
      return {
         'roughing': {
            'minimum': turnedMinimum,
            'maximum': turnedMaximum
         },
         'pitchDiameter': {
            'minimum': pitchMinimum,
            'maximum': pitchMaximum
         },
         'reservedDiameter': reservedDiameter * 2,
         'depth': depth
      };
   }

   function getDeviation (pitch, inner, toleranceDeviation) {
      var data = din13DeviationData.getData();
      var inValueRange = data.filter(a =>
         a[0] === pitch &&
            a[1] === inner &&
            a[2] === toleranceDeviation);

      if (inValueRange.length > 0) {
         return inValueRange[0][3];
      }

      return null;
   }

   function getTolerancePitch (nominal, pitch, inner, toleranceValue) {
      var data = din13PitchDiameterData.getData();
      var inValueRange = data.filter(a =>
         a[0] < nominal &&
            a[1] >= nominal &&
            a[2] === pitch &&
            a[3] === inner &&
            a[4] === String(toleranceValue));

      if (inValueRange.length > 0) {
         return inValueRange[0][5];
      }
      return null;
   }

   function getToleranceTurning (pitch, inner, toleranceValue) {
      var data = din13TurningData.getData();
      var inValueRange = data.filter(a =>
         a[0] === pitch &&
            a[1] === inner &&
            a[2] === String(toleranceValue));
      if (inValueRange.length > 0) {
         return inValueRange[0][3];
      }

      return null;
   }

   function get (nominal, inner, pitch, toleranceDeviation, toleranceValue) {
      try {
         var tolerancePitch = getTolerancePitch(nominal, pitch, inner, toleranceValue);

         if (tolerancePitch !== null) {
            var toleranceTurning = getToleranceTurning(pitch, inner, toleranceValue);

            if (toleranceTurning != null) {
               var deviation = getDeviation(pitch, inner, toleranceDeviation);

               if (deviation !== null) {
                  var H = Math.sqrt(3) * pitch / 2;
                  var H1 = 5 / 8 * H;

                  var D2 = -3 / 4 * H;

                  var turnedMinimum = 0.0;
                  var turnedMaximum = 0.0;
                  var pitchMinimum = 0.0;
                  var pitchMaximum = 0.0;
                  var depth = 0.0;
                  var reservedDiameter = 0.0;

                  if (inner) {
                     var D1 = -2 * H1;
                     turnedMinimum = D1 + deviation / 1000;
                     turnedMaximum = D1 + (deviation + toleranceTurning) / 1000;

                     pitchMinimum = D2 + deviation / 1000;
                     pitchMaximum = D2 + (deviation + tolerancePitch) / 1000;

                     depth = 5 / 8 * H;

                     reservedDiameter = turnedMaximum + depth;

                  } else {
                     turnedMinimum = (deviation - toleranceTurning) / 1000;
                     turnedMaximum = deviation / 1000;

                     pitchMinimum = D2 + (deviation - tolerancePitch) / 1000;
                     pitchMaximum = D2 + deviation / 1000;

                     depth = 17 / 24 * H;

                     reservedDiameter = turnedMinimum - depth;
                  }

                  return createResultObject(turnedMinimum, turnedMaximum, pitchMinimum, pitchMaximum, reservedDiameter, depth);
               }
            }
         }
      } catch (ex) {
         console.log(ex);
      }

      return null;
   }

   return get(nominal, inner, pitch, toleranceDeviation, toleranceValue);
}
