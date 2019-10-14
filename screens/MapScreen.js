import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Colors from '../constants/Colors';
import { mapStyle } from '../storage';

import { connect } from 'react-redux';

class MapScreen extends React.Component {
  render() {
    const { features } = this.props;

    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          showsUserLocation={true}
          // onUserLocationChange
          customMapStyle={mapStyle}
          initialRegion={{
            latitude: 42.692273,
            longitude: 23.32091,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        >
          {features.map(({ properties, geometry }) => {
            console.log(geometry);
            const fid = properties.fid;
            const [longitude, latitude] = geometry.coordinates;
            const marker = { title: fid, latlng: { latitude, longitude } };
            const isPylon = properties.featureType === 'pylon';
            return (
              <Marker key={fid} anchor={{ x: 0.5, y: 0.5 }} coordinate={marker.latlng} title={marker.title} description={marker.description}>
                <View style={{ backgroundColor: isPylon ? 'yellow' : 'red', padding: 5 }}>
                  <Text>{isPylon ? 'Ст' : 'Ш'}</Text>
                </View>
              </Marker>
            );
          })}
        </MapView>
      </View>
    );
  }
}

MapScreen.navigationOptions = {
  title: 'Map',
  headerStyle: {
    backgroundColor: Colors.background
  },
  headerTintColor: Colors.tintColor,
  headerTitleStyle: {
    fontWeight: 'bold'
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const mapStateToProps = (features, ownProps) => {
  return { features };
};

export default connect(
  mapStateToProps,
  null
)(MapScreen);
