import React from 'react';
import { Button, Platform, ScrollView, Picker, StyleSheet, Text, TextInput, SectionList, View } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { SectionHeader, SectionContent } from '../components/Common';
import Colors from '../constants/Colors';
import { getPropertiesFor } from '../storage';
import { createPointFeature } from '../exports';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { featureActions } from '../store/actions';

const uuid = require('uuid/v4');
// let currentFid = 0;

class AddFeatureScreen extends React.Component {
  constructor(props, context) {
    super(props, context);

    const featureType = this.props.navigation.getParam('featureType');
    const properties = getPropertiesFor(featureType);
    this.state = { location: null, properties };
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
    `accuracy: ${location.coords.accuracy.toFixed(0)} m`;
    this.setState({ location });
  };

  createFeature = async () => {
    const { location, properties } = this.state;
    if (location) {
      const fid = uuid();
      const { latitude, longitude, accuracy, altitude, heading, speed } = location.coords;
      const featureType = this.props.navigation.getParam('featureType');
      let featureProperties = { fid, accuracy, altitude, heading, speed, featureType };
      properties.forEach(({ key, value }) => (featureProperties[key] = value));
      const feature = createPointFeature([longitude, latitude], featureProperties);

      this.props.actions.addFeature(feature);

      this.props.navigation.goBack();
    }
  };

  _updateProperty = async (key, value) => {
    let { properties } = this.state;
    for (let i = 0; i < properties.length; i++) {
      if (properties[i].key === key) {
        properties[i].value = value;
      }
    }
    this.setState({ properties });
  };

  _renderSectionHeader = ({ section }) => {
    return <SectionHeader title={section.title} description={section.description} />;
  };

  _renderItem = ({ item }) => {
    let value = item.value || {};
    if (value.type === 'dropdown') {
      return (
        <SectionContent>
          <Picker
            selectedValue={value.value}
            onValueChange={(itemValue, itemIndex) => {
              this._updateProperty(value.key, itemValue);
            }}
          >
            {value.options.map(({ label, value }) => {
              return <Picker.Item key={`key-${label}`} label={label} value={value} />;
            })}
          </Picker>
        </SectionContent>
      );
    } else if (value.type === 'text') {
      return (
        <SectionContent>
          <TextInput
            style={styles.sectionContentText}
            value={value.value}
            onChangeText={text => {
              this._updateProperty(value.key, text);
            }}
          />
        </SectionContent>
      );
    } else {
      return (
        <SectionContent>
          <TextInput style={styles.sectionContentText} value={`${value.latitude}, ${value.longitude}`} editable={false} />
        </SectionContent>
      );
    }
  };

  render() {
    const { location, properties } = this.state;
    let sections = [];
    sections.push({
      data: [{ value: location ? location.coords : null }],
      title: 'Current location',
      description: `accuracy: ${location ? location.coords.accuracy.toFixed(0) : '100'} meters`
    });
    properties.forEach(property => {
      sections.push({
        data: [{ value: property }],
        title: property.title,
        description: null
      });
    });

    return (
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
        <Button title='Create' onPress={this.createFeature} />
      </ScrollView>
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
    paddingTop: 0
  },
  sectionContentText: {
    // color: '#808080',
    fontSize: 14,
    borderColor: Colors.dark,
    borderWidth: 1,
    paddingHorizontal: 10
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
