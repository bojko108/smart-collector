import React from 'react';
import { Alert, Button, Platform, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';

import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';

import { saveAsGeoJson } from '../exports';
import { getFeatures, setFeatures, getSetting, SETTINGS } from '../storage';
import Colors from '../constants/Colors';

export default class HomeScreen extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { features: [] };
  }

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
      this.getFeatures();
    });
    this.didBlurSubscription = this.props.navigation.addListener('didBlur', () => {
      this.setState({ isFocused: false });
    });
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
    this.didBlurSubscription.remove();
  }

  async getFeatures() {
    const features = await getFeatures();
    console.log(features.length);
    this.setState({ features });
  }

  addFeature = () => {
    this.props.navigation.navigate('AddFeature');
  };

  async _saveAsGeoJson() {
    const featureCollection = await saveAsGeoJson(this.state.features);
    console.log(FileSystem.documentDirectory);
    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}geojson`);
    await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}geojson/test.json`, JSON.stringify(featureCollection));
  }

  async _sendEmail() {
    const recipient = await getSetting(SETTINGS.EMAIL);
    console.log(recipient);
    await MailComposer.composeAsync({ recipients: [recipient], subject: 'title', body: 'body' });
  }

  async _deleteFeatures() {
    await setFeatures([]);
    await getFeatures();
  }

  _handleActionPress = async name => {
    switch (name) {
      case 'bt_add':
        this.addFeature();
        break;
      case 'bt_send':
        await this._sendEmail();
        break;
      case 'bt_export':
        await this._saveAsGeoJson();
        break;
      case 'bt_delete':
        Alert.alert('Delete all collected features!', '', [{ text: 'No', type: 'cancel' }, { text: 'Yes', onPress: this._deleteFeatures }]);
        break;
    }
  };

  render() {
    const { features } = this.state;
    const actions = [
      {
        text: 'Add Feature',
        // icon: require('./images/ic_accessibility_white.png'),
        name: 'bt_add',
        position: 1
      },
      {
        text: 'Send Features',
        // icon: require('./images/ic_accessibility_white.png'),
        name: 'bt_send',
        position: 2
      },
      {
        text: 'Export Features',
        // icon: require('./images/ic_accessibility_white.png'),
        name: 'bt_export',
        position: 3
      },
      {
        text: 'Delete All Features',
        // icon: require('./images/ic_accessibility_white.png'),
        name: 'bt_delete',
        position: 4
      }
    ];
    return (
      <View style={styles.container}>
        {features.map((feature, index) => (
          <TouchableOpacity key={feature.properties.fid} style={styles.item} onPress={() => console.log(feature)}>
            <Text key={`text-${feature.properties.fid}`} style={styles.text}>
              {`${index + 1} - precision: ${feature.properties.accuracy.toFixed()} meters`}
            </Text>
          </TouchableOpacity>
        ))}
        <FloatingAction actions={actions} color='#f4511e' distanceToEdge={10} onPressItem={this._handleActionPress} />
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  title: 'Smart Collector',
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
    backgroundColor: Colors.tintColor,
    padding: 20
  },
  item: {
    padding: 10,
    marginTop: 3,
    backgroundColor: Colors.background
  },
  text: {
    color: Colors.tintColor
  }
});
