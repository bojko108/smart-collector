import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text, TextInput, SectionList, View } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { SectionHeader, SectionContent } from '../components/Common';
import Colors from '../constants/Colors';

import { createPointFeature } from '../exports';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { featureActions } from '../store/actions';

const uuid = require('uuid/v4');

class AddFeatureScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { location: null };
  }

  unsubscribe = null;

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      this.unsubscribe = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, timeInterval: 5000, distanceInterval: 0 },
        this._locationChanged
      );
    } else {
      this.setState({ errorMessage: 'Permission to access location was denied!' });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe.remove();
    }
  }

  _locationChanged = location => {
    console.log(`accuracy: ${location.coords.accuracy.toFixed(0)} m`);
    this.setState({ location });
  };

  saveFeature = async () => {
    const { location } = this.state;
    if (location) {
      const fid = uuid();
      const { latitude, longitude, accuracy, altitude, heading, speed } = location.coords;
      const feature = createPointFeature([longitude, latitude], { fid, accuracy, altitude, heading, speed });

      this.props.actions.addFeature(feature);

      this.props.navigation.goBack();
    }
  };

  _renderSectionHeader = ({ section }) => {
    return <SectionHeader title={section.title} description={section.description} />;
  };

  _renderItem = ({ item }) => {
    let coords = item.value || {};
    return (
      <SectionContent>
        <TextInput style={styles.sectionContentText} value={`${coords.latitude}, ${coords.longitude}`} editable={false} />
      </SectionContent>
    );
  };

  render() {
    const { location } = this.state;
    let sections = [];
    sections.push({
      data: [{ value: location ? location.coords : null }],
      title: 'Current location',
      description: `accuracy: ${location ? location.coords.accuracy.toFixed(0) : '100'} meters`
    });

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <SectionList
            style={styles.container}
            renderItem={this._renderItem}
            renderSectionHeader={this._renderSectionHeader}
            stickySectionHeadersEnabled={true}
            keyExtractor={(item, index) => index}
            // ListHeaderComponent={ListHeader}
            sections={sections}
          />
          <Button title='Save' onPress={this.saveFeature} />
        </ScrollView>
      </View>
    );
  }
}

AddFeatureScreen.navigationOptions = {
  title: 'Collect Feature',
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
    flex: 1,
    backgroundColor: Colors.tintColor
  },
  contentContainer: {
    paddingTop: 30
  }
});

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(featureActions, dispatch)
  };
};

export default connect(
  null,
  mapDispatchToProps
)(AddFeatureScreen);
