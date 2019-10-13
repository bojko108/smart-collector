import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import Colors from '../constants/Colors';
import { mapStyle } from '../storage';

export default class MapScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          showsUserLocation={true}
          customMapStyle={mapStyle}
          initialRegion={{
            latitude: 42.692273,
            longitude: 23.32091,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
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
