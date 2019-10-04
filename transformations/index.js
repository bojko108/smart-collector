import { HAYFORD, WGS84 } from './constants/ellipsoids';
import { BGS_1930_24, UTM35N, BGS_2005_KK } from './constants/projections';
import { toRad, toDeg, arcLengthOfMeridian, footpointLatitude, calculateQParameter, calculateWParameter, calculateCentralPointX } from './helpers';

/**
 * Transforms geographic coordinates to projected in Lambert projection. You can pass single point or
 * array of points.
 * @public
 * @param {!Array.<Number>|Array} coordinates - coordinates in [Latitude, Longitude] or array of points
 * @param {Object.<String,*>} [outputProjection=BGS_2005_KK] - output projection
 * @param {Object.<String,*>} [outputEllipsoid=WGS84] - output ellipsoid
 * @return {Array.<Number>|Array}
 */
export const transformGeographicToLambert = function(coordinates, outputProjection = BGS_2005_KK, outputEllipsoid = WGS84) {
  // are we transforming single point or set of points
  const isArray = Array.isArray(coordinates[0]);
  // points to be transformed
  let points = isArray ? coordinates : [coordinates];

  const Lon0 = toRad(outputProjection.Lon0),
    Lat1 = toRad(outputProjection.Lat1),
    Lat2 = toRad(outputProjection.Lat2),
    w1 = calculateWParameter(Lat1, outputEllipsoid),
    w2 = calculateWParameter(Lat2, outputEllipsoid),
    Q1 = calculateQParameter(Lat1, outputEllipsoid),
    Q2 = calculateQParameter(Lat2, outputEllipsoid),
    Lat0 = Math.asin(Math.log((w2 * Math.cos(Lat1)) / (w1 * Math.cos(Lat2))) / (Q2 - Q1)),
    Q0 = calculateQParameter(Lat0, outputEllipsoid),
    Re = (outputEllipsoid.a * Math.cos(Lat1) * Math.exp(Q1 * Math.sin(Lat0))) / w1 / Math.sin(Lat0),
    R0 = Re / Math.exp(Q0 * Math.sin(Lat0)),
    x0 = calculateCentralPointX(Lat0, outputEllipsoid);

  let result = points.map(point => {
    let x = 0.0,
      y = 0.0,
      R = 0.0,
      Q = 0.0,
      gama = 0.0,
      lat = toRad(point[0]),
      lon = toRad(point[1]);

    let A = Math.log((1 + Math.sin(lat)) / (1 - Math.sin(lat))),
      B = outputEllipsoid.e * Math.log((1 + outputEllipsoid.e * Math.sin(lat)) / (1 - outputEllipsoid.e * Math.sin(lat)));

    Q = (A - B) / 2;
    R = Re / Math.exp(Q * Math.sin(Lat0));

    gama = (lon - Lon0) * Math.sin(Lat0);

    x = R0 + x0 - R * Math.cos(gama);
    y = outputProjection.y0 + R * Math.sin(gama);

    return [x, y];
  });

  return isArray ? result : result[0];
};
/**
 * Transforms projected in Lambert projection to geographic coordinates. You can pass single point or
 * array of points.
 * @public
 * @param {!Array.<Number>|Array} coordinates - coordinates in [Northing, Easting] or array of points
 * @param {Object.<String,*>} [inputProjection=BGS_2005_KK] - input projection
 * @param {Object.<String,*>} [inputEllipsoid=WGS84] - input ellipsoid
 * @return {Array.<Number>|Array}
 */
export const transformLambertToGeographic = function(coordinates, inputProjection = BGS_2005_KK, inputEllipsoid = WGS84) {
  // are we transforming single point or set of points
  const isArray = Array.isArray(coordinates[0]);
  // points to be transformed
  let points = isArray ? coordinates : [coordinates];

  const Lon0 = toRad(inputProjection.Lon0),
    Lat1 = toRad(inputProjection.Lat1),
    Lat2 = toRad(inputProjection.Lat2),
    w1 = calculateWParameter(Lat1, inputEllipsoid),
    w2 = calculateWParameter(Lat2, inputEllipsoid),
    Q1 = calculateQParameter(Lat1, inputEllipsoid),
    Q2 = calculateQParameter(Lat2, inputEllipsoid),
    Lat0 = Math.asin(Math.log((w2 * Math.cos(Lat1)) / (w1 * Math.cos(Lat2))) / (Q2 - Q1)),
    Q0 = calculateQParameter(Lat0, inputEllipsoid),
    Re = (inputEllipsoid.a * Math.cos(Lat1) * Math.exp(Q1 * Math.sin(Lat0))) / w1 / Math.sin(Lat0),
    R0 = Re / Math.exp(Q0 * Math.sin(Lat0)),
    x0 = calculateCentralPointX(Lat0, inputEllipsoid);

  let result = points.map(point => {
    let lat = 0.0,
      lon = 0.0,
      f1 = 0.0,
      f2 = 0.0,
      Latp = 0.0,
      R = 0.0,
      Q = 0.0,
      gama = 0.0,
      x = point[0],
      y = point[1];

    // determine latitude iteratively
    R = Math.sqrt(Math.pow(y - inputProjection.y0, 2) + Math.pow(R0 + x0 - x, 2));
    Q = Math.log(Re / R) / Math.sin(Lat0);
    Latp = Math.asin((Math.exp(2 * Q) - 1) / (Math.exp(2 * Q) + 1));

    for (let i = 0; i < 10; i++) {
      f1 =
        (Math.log((1 + Math.sin(Latp)) / (1 - Math.sin(Latp))) -
          inputEllipsoid.e * Math.log((1 + inputEllipsoid.e * Math.sin(Latp)) / (1 - inputEllipsoid.e * Math.sin(Latp)))) /
          2 -
        Q;
      f2 = 1 / (1 - Math.pow(Math.sin(Latp), 2)) - inputEllipsoid.e2 / (1 - inputEllipsoid.e2 * Math.pow(Math.sin(Latp), 2));
      lat = Math.asin(Math.sin(Latp) - f1 / f2);

      if (Math.abs(lat - Latp) <= 0.0000000001) {
        break;
      } else {
        Latp = lat;
      }
    }

    // determine longitude
    gama = Math.atan((y - inputProjection.y0) / (R0 + x0 - x));
    lon = gama / Math.sin(Lat0) + Lon0;

    return [toDeg(lat), toDeg(lon)];
  });

  return isArray ? result : result[0];
};

/**
 * Transforms geographic coordinates to projected in UTM projection. You can pass single point or
 * array of points.
 * @public
 * @param {!Array.<Number>|Array} coordinates - coordinates in [Latitude, Longitude] or array of points
 * @param {Object.<String,*>} [outputUtmProjection=UTM35N] - output projection
 * @param {Object.<String,*>} [inputEllipsoid=WGS84] - input ellipsoid
 * @return {Array.<Number>|Array}
 */
export const transformGeographicToUTM = function(coordinates, outputUtmProjection = UTM35N, inputEllipsoid = WGS84) {
  return transformGeographicToGauss(coordinates, outputUtmProjection, inputEllipsoid);
};
/**
 * Transforms projected in UTM projection to geographic coordinates. You can pass single point or
 * array of points.
 * @public
 * @param {!Array.<Number>|Array} coordinates - coordinates in [Northing, Easting] or array of points
 * @param {Object.<String,*>} [inputUtmProjection=UTM35N] - input projection
 * @param {Object.<String,*>} [outputEllipsoid=WGS84] - input ellipsoid
 * @return {Array.<Number>|Array}
 */
export const transformUTMToGeographic = function(coordinates, inputUtmProjection = UTM35N, outputEllipsoid = WGS84) {
  return transformGaussToGeographic(coordinates, inputUtmProjection, outputEllipsoid);
};
/**
 * Transforms geographic coordinates to projected in Gauss-Kruger projection. You can pass single point or
 * array of points.
 * @public
 * @param {!Array.<Number>|Array} coordinates - coordinates in [Latitude, Longitude] or array of points
 * @param {Object.<String,*>} [outputProjection=BGS_1930_24] - output projection
 * @param {Object.<String,*>} [inputEllipsoid=HAYFORD] - input ellipsoid
 * @return {Array.<Number>|Array}
 */
export const transformGeographicToGauss = function(coordinates, outputProjection = BGS_1930_24, inputEllipsoid = HAYFORD) {
  // are we transforming single point or set of points
  const isArray = Array.isArray(coordinates[0]);
  // points to be transformed
  let points = isArray ? coordinates : [coordinates];

  const Lon0 = toRad(outputProjection.Lon0);

  let result = points.map(point => {
    const latitude = toRad(point[0]);
    const longitude = toRad(point[1]);

    let easting = 0.0,
      northing = 0.0;

    let phi = arcLengthOfMeridian(latitude, inputEllipsoid),
      nu2 = inputEllipsoid.ep2 * Math.pow(Math.cos(latitude), 2.0),
      n = Math.pow(inputEllipsoid.a, 2.0) / (inputEllipsoid.b * Math.sqrt(1 + nu2)),
      t = Math.tan(latitude),
      t2 = t * t,
      l = longitude - Lon0,
      coef13 = 1.0 - t2 + nu2,
      coef14 = 5.0 - t2 + 9 * nu2 + 4.0 * (nu2 * nu2),
      coef15 = 5.0 - 18.0 * t2 + t2 * t2 + 14.0 * nu2 - 58.0 * t2 * nu2,
      coef16 = 61.0 - 58.0 * t2 + t2 * t2 + 270.0 * nu2 - 330.0 * t2 * nu2,
      coef17 = 61.0 - 479.0 * t2 + 179.0 * (t2 * t2) - t2 * t2 * t2,
      coef18 = 1385.0 - 3111.0 * t2 + 543.0 * (t2 * t2) - t2 * t2 * t2;

    easting =
      n * Math.cos(latitude) * l +
      (n / 6.0) * Math.pow(Math.cos(latitude), 3.0) * coef13 * Math.pow(l, 3.0) +
      (n / 120.0) * Math.pow(Math.cos(latitude), 5.0) * coef15 * Math.pow(l, 5.0) +
      (n / 5040.0) * Math.pow(Math.cos(latitude), 7.0) * coef17 * Math.pow(l, 7.0);

    northing =
      phi +
      (t / 2.0) * n * Math.pow(Math.cos(latitude), 2.0) * Math.pow(l, 2.0) +
      (t / 24.0) * n * Math.pow(Math.cos(latitude), 4.0) * coef14 * Math.pow(l, 4.0) +
      (t / 720.0) * n * Math.pow(Math.cos(latitude), 6.0) * coef16 * Math.pow(l, 6.0) +
      (t / 40320.0) * n * Math.pow(Math.cos(latitude), 8.0) * coef18 * Math.pow(l, 8.0);

    northing *= outputProjection.scale;
    easting *= outputProjection.scale;
    easting += outputProjection.y0;

    return [northing, easting];
  });

  return isArray ? result : result[0];
};
/**
 * Transforms projected in Gauss-Kruger projection to geographic coordinates. You can pass single point or
 * array of points.
 * @public
 * @param {!Array.<Number>|Array} coordinates - coordinates in [Northing, Easting] or array of points
 * @param {Object.<String,*>} [inputProjection=BGS_1930_24] - input projection
 * @param {Object.<String,*>} [outputEllipsoid=HAYFORD] - input ellipsoid
 * @return {Array.<Number>|Array}
 */
export const transformGaussToGeographic = function(coordinates, inputProjection = BGS_1930_24, outputEllipsoid = HAYFORD) {
  // are we transforming single point or set of points
  const isArray = Array.isArray(coordinates[0]);
  // points to be transformed
  let points = isArray ? coordinates : [coordinates];

  const Lon0 = toRad(inputProjection.Lon0);

  let result = points.map(point => {
    let latitude = 0.0,
      longitude = 0.0;

    let easting = point[1];
    easting -= inputProjection.y0;
    easting /= inputProjection.scale;
    let northing = point[0];
    northing /= inputProjection.scale;

    let phif,
      Nf,
      Nfpow,
      nuf2,
      tf,
      tf2,
      tf4,
      cf,
      x1frac,
      x2frac,
      x3frac,
      x4frac,
      x5frac,
      x6frac,
      x7frac,
      x8frac,
      x2poly,
      x3poly,
      x4poly,
      x5poly,
      x6poly,
      x7poly,
      x8poly;

    phif = footpointLatitude(northing, outputEllipsoid);

    cf = Math.cos(phif);
    nuf2 = outputEllipsoid.ep2 * Math.pow(cf, 2.0);
    Nf = Math.pow(outputEllipsoid.a, 2.0) / (outputEllipsoid.b * Math.sqrt(1 + nuf2));
    Nfpow = Nf;
    tf = Math.tan(phif);
    tf2 = tf * tf;
    tf4 = tf2 * tf2;
    x1frac = 1.0 / (Nfpow * cf);
    Nfpow *= Nf;
    x2frac = tf / (2.0 * Nfpow);
    Nfpow *= Nf;
    x3frac = 1.0 / (6.0 * Nfpow * cf);
    Nfpow *= Nf;
    x4frac = tf / (24.0 * Nfpow);
    Nfpow *= Nf;
    x5frac = 1.0 / (120.0 * Nfpow * cf);
    Nfpow *= Nf;
    x6frac = tf / (720.0 * Nfpow);
    Nfpow *= Nf;
    x7frac = 1.0 / (5040.0 * Nfpow * cf);
    Nfpow *= Nf;
    x8frac = tf / (40320.0 * Nfpow);

    x2poly = -1 - nuf2;
    x3poly = -1 - 2 * tf2 - nuf2;
    x4poly = 5.0 + 3.0 * tf2 + 6.0 * nuf2 - 6.0 * tf2 * nuf2 - 3.0 * (nuf2 * nuf2) - 9.0 * tf2 * (nuf2 * nuf2);
    x5poly = 5.0 + 28.0 * tf2 + 24.0 * tf4 + 6.0 * nuf2 + 8.0 * tf2 * nuf2;
    x6poly = -61.0 - 90.0 * tf2 - 45.0 * tf4 - 107.0 * nuf2 + 162.0 * tf2 * nuf2;
    x7poly = -61.0 - 662.0 * tf2 - 1320.0 * tf4 - 720.0 * (tf4 * tf2);
    x8poly = 1385.0 + 3633.0 * tf2 + 4095.0 * tf4 + 1575 * (tf4 * tf2);

    latitude =
      phif +
      x2frac * x2poly * Math.pow(easting, 2) +
      x4frac * x4poly * Math.pow(easting, 4.0) +
      x6frac * x6poly * Math.pow(easting, 6.0) +
      x8frac * x8poly * Math.pow(easting, 8.0);

    longitude =
      Lon0 +
      x1frac * easting +
      x3frac * x3poly * Math.pow(easting, 3.0) +
      x5frac * x5poly * Math.pow(easting, 5.0) +
      x7frac * x7poly * Math.pow(easting, 7.0);

    return [toDeg(latitude), toDeg(longitude)];
  });

  return isArray ? result : result[0];
};
