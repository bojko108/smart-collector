import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text, TextInput, SectionList, View } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { ListHeader, SectionHeader, SectionContent } from '../components/Common';
import Colors from '../constants/Colors';

import { MonoText } from '../components/StyledText';
import { saveAsGeoJson, createPointFeature } from '../exports';
import { setFeatures, getFeatures } from '../storage';

const uuid = require('uuid/v4');

export default class AddFeatureScreen extends React.Component {
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
      let features = await getFeatures();
      features.push(feature);
      await setFeatures(features);

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

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return <Text style={styles.developmentModeText}>You are not in development mode: your app will run at full speed.</Text>;
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tintColor
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)'
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center'
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center'
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center'
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7'
  }
});
