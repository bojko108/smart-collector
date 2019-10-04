/**
 * Convert degrees to radians
 * @public
 * @param {!Number} degrees
 * @return {Number}
 */
export function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}
/**
 * Convert radians to degrees
 * @public
 * @param {!Number} radians
 * @return {Number}
 */
export function toDeg(radians) {
  return (radians / Math.PI) * 180;
}
/**
 * Convert decimal degrees to degrees, minutes and seconds
 * @public
 * @param {!Number} decimalDegrees
 * @return {String}
 */
export function toDMS(decimalDegrees) {
  let input = decimalDegrees,
    minpart,
    min,
    sec;

  decimalDegrees = Math.floor(decimalDegrees);
  minpart = (input - decimalDegrees) * 60;
  min = Math.floor(minpart);
  sec = (minpart - min) * 60;
  if (min < 10) min = `0${min}`;
  if (sec < 10) {
    sec = `0${sec}`;
  } else {
    sec = sec.toFixed(4);
  }
  return `${pad(decimalDegrees)}${pad(min)}${pad(sec)}`;
}
/**
 * Convert degrees, minutes and seconds to decimal degrees
 * @public
 * @param {!String} dms
 * @return {Number}
 */
export function toDD(dms) {
  let deg, min, sec;
  dms = dms.toString();
  deg = dms.substring(0, 2);
  min = dms.substring(2, 4);
  sec = dms.replace(`${deg}${min}`, '');
  return parseFloat(deg) + parseFloat(min) / 60 + parseFloat(sec) / 60 / 60;
}
/**
 * Add `0` in front of number
 * @public
 * @param {!Number} number
 * @param {!Number} size
 * @return {String}
 */
export function pad(number, size = 2) {
  let s = number.toString();
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
}
/**
 * Calculates length of the meridian from the equator to the specified Latitude
 * @public
 * @param {!Number} latitude - in radians
 * @param {!Object.<String,*>} ellipsoid
 * @return {Number} - length in meters
 */
export function arcLengthOfMeridian(latitude, ellipsoid) {
  const m0 = ellipsoid.a * (1 - ellipsoid.e2),
    m2 = (3 / 2) * (ellipsoid.e2 * m0),
    m4 = (5 / 4) * (ellipsoid.e2 * m2),
    m6 = (7 / 6) * (ellipsoid.e2 * m4),
    m8 = (9 / 8) * (ellipsoid.e2 * m6);

  const a0 = m0 + 0.5 * m2 + 0.375 * m4 + 0.3125 * m6 + 0.2734375 * m8,
    a2 = 0.5 * m2 + 0.5 * m4 + 0.46875 * m6 + 0.4375 * m8,
    a4 = 0.125 * m4 + 0.1875 * m6 + 0.21875 * m8,
    a6 = 0.03125 * m6 + 0.0625 * m8;

  return (
    a0 * latitude -
    Math.sin(latitude) *
      Math.cos(latitude) *
      (a2 - a4 + a6 + (2 * a4 - (16 / 3) * a6) * Math.pow(Math.sin(latitude), 2) + (16 / 3) * (a6 * Math.pow(Math.sin(latitude), 4)))
  );
}

/**
 * Calculates base latitude from northing coordinate of a point.
 * @public
 * @param {!Number} northing
 * @param {!Object.<String,*>} ellipsoid
 * @return {Number} - latitude in radians
 */
export function footpointLatitude(northing, ellipsoid) {
  let x_, alpha_, beta_, gamma_, delta_, epsilon_;

  alpha_ = ((ellipsoid.a + ellipsoid.b) / 2.0) * (1 + Math.pow(ellipsoid.n, 2.0) / 4 + Math.pow(ellipsoid.n, 4.0) / 64);
  x_ = northing / alpha_;
  beta_ = (3.0 * ellipsoid.n) / 2.0 + (-27.0 * Math.pow(ellipsoid.n, 3.0)) / 32.0 + (269.0 * Math.pow(ellipsoid.n, 5.0)) / 512.0;
  gamma_ = (21.0 * Math.pow(ellipsoid.n, 2.0)) / 16.0 + (-55.0 * Math.pow(ellipsoid.n, 4.0)) / 32.0;
  delta_ = (151.0 * Math.pow(ellipsoid.n, 3.0)) / 96.0 + (-417.0 * Math.pow(ellipsoid.n, 5.0)) / 128.0;
  epsilon_ = (1097.0 * Math.pow(ellipsoid.n, 4.0)) / 512.0;

  return x_ + beta_ * Math.sin(2.0 * x_) + gamma_ * Math.sin(4.0 * x_) + delta_ * Math.sin(6.0 * x_) + epsilon_ * Math.sin(8.0 * x_);
}

export function calculateQParameter(latitude, ellipsoid) {
  return (
    (1 / 2) *
    (Math.log((1 + Math.sin(latitude)) / (1 - Math.sin(latitude))) -
      ellipsoid.e * Math.log((1 + ellipsoid.e * Math.sin(latitude)) / (1 - ellipsoid.e * Math.sin(latitude))))
  );
}
/**
 * @public
 * @param {!Number} latitude - in radians
 * @param {!Object.<String,*>} ellipsoid
 * @return {Number}
 */
export function calculateWParameter(latitude, ellipsoid) {
  return Math.sqrt(1 - ellipsoid.e2 * Math.pow(Math.sin(latitude), 2));
}
/**
 * @public
 * @param {!Number} latitude - in radians
 * @param {!Object.<String,*>} ellipsoid
 * @return {Number}
 */
export function calculateCentralPointX(lat0, ellipsoid) {
  const m0 = ellipsoid.a * (1 - ellipsoid.e2),
    m2 = 1.5 * ellipsoid.e2 * m0,
    m4 = 1.25 * ellipsoid.e2 * m2,
    m6 = (7 / 6) * (ellipsoid.e2 * m4),
    m8 = 1.125 * ellipsoid.e2 * m6,
    a0 = m0 + 0.5 * m2 + 0.375 * m4 + 0.3125 * m6 + 0.2734375 * m8,
    a2 = 0.5 * m2 + 0.5 * m4 + 0.46875 * m6 + 0.4375 * m8,
    a4 = 0.125 * m4 + 0.1875 * m6 + 0.21875 * m8,
    a6 = 0.03125 * m6 + 0.0625 * m8;

  return (
    a0 * lat0 -
    Math.sin(lat0) *
      Math.cos(lat0) *
      (a2 - a4 + a6 + (2 * a4 - (16 / 3) * a6) * Math.pow(Math.sin(lat0), 2) + (16 / 3) * a6 * Math.pow(Math.sin(lat0), 4))
  );
}

/**
 * Builds an extent that includes all passed points
 * @public
 * @param {Array.<Number>} [points=[]] - array of points
 * @return {Array.<Number>}
 */
export function calculateExtent(points = []) {
  let extent = createExtent();

  points.forEach(p => {
    if (p[0] < extent[0]) {
      extent[0] = p[0];
    }
    if (p[0] > extent[2]) {
      extent[2] = p[0];
    }
    if (p[1] < extent[1]) {
      extent[1] = p[1];
    }
    if (p[1] > extent[3]) {
      extent[3] = p[1];
    }
  });

  return extent;
}

/**
 * Creates an empty extent
 * @public
 * @return {Array.<Number>}
 */
export function createExtent() {
  return [Infinity, Infinity, -Infinity, -Infinity];
}

/**
 * Buffers an extent and returns it
 * @public
 * @param {!Array.<Number>} extent
 * @param {Number} value - extend this extent with (in meters)
 * @return {Array.<Number>}
 */
export function buffer(extent, value = 0) {
  return [extent[0] - value, extent[1] - value, extent[2] + value, extent[3] + value];
}
