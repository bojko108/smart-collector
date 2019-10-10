import React from 'react';
import { Alert, Button, Platform, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import Constants from 'expo-constants';
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

    FileSystem.makeDirectoryAsync(`${FileSystem.cacheDirectory}collected-data`).catch(ex => {
      // already exists
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

  async _sendEmail() {
    const recipient = await getSetting(SETTINGS.EMAIL);
    const featureCollection = await saveAsGeoJson(this.state.features);
    const fileName = this._getDateFormatted();
    const path = `${FileSystem.cacheDirectory}collected-data/${fileName}.geojson`;

    await FileSystem.writeAsStringAsync(path, JSON.stringify(featureCollection));

    await MailComposer.composeAsync({
      recipients: [recipient],
      subject: `${Constants.manifest.name} - ${fileName}`,
      body: `Data collected with ${Constants.manifest.name} app, stored to file: ${path}`,
      attachments: [path],
      isHtml: false
    });
  }

  async _deleteFeatures() {
    await setFeatures([]);
    await getFeatures();
    await FileSystem.deleteAsync(`${FileSystem.cacheDirectory}collected-data`);
  }

  _getDateFormatted() {
    const now = new Date();
    return `${now.getFullYear()}${now.getMonth() < 10 ? '0' + now.getMonth() : now.getMonth()}${
      now.getDay() < 10 ? '0' + now.getDay() : now.getDay()
    }@${now.getHours() < 10 ? '0' + now.getHours() : now.getHours()}${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()}${
      now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
    }`;
  }

  _handleActionPress = async name => {
    switch (name) {
      case 'bt_add':
        this.addFeature();
        break;
      case 'bt_send':
        await this._sendEmail();
        break;
      // case 'bt_export':
      //   await this._saveAsGeoJson();
      //   break;
      case 'bt_delete':
        Alert.alert('Delete all collected features!', '', [{ text: 'No', style: 'cancel' }, { text: 'Yes', onPress: this._deleteFeatures }]);
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
        <FloatingAction actions={actions} color={Colors.background} distanceToEdge={10} onPressItem={this._handleActionPress} />
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
