import React from 'react';
import { Alert, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import Constants from 'expo-constants';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';

import { saveAsGeoJson, saveAsDxf } from '../exports';
import { getSetting, SETTINGS } from '../storage';
import Colors from '../constants/Colors';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { featureActions } from '../store/actions';

class HomeScreen extends React.Component {
  async componentDidMount() {
    const fileUri = `${FileSystem.cacheDirectory}collected-data`;
    const { exists } = FileSystem.getInfoAsync(fileUri);
    if (exists === false) {
      FileSystem.makeDirectoryAsync(fileUri);
    }
  }

  addFeature = featureType => {
    this.props.navigation.navigate('AddFeature', { featureType });
  };

  _sendEmail = async () => {
    const { features } = this.props;
    const recipient = await getSetting(SETTINGS.EMAIL);
    const exportType = await getSetting(SETTINGS.DWG_EXPORT_TYPE);
    const targetCRS = await getSetting(SETTINGS.DWG_CRS);

    const fileName = this._getDateFormatted();
    let extension;

    let fileContent;
    switch (exportType) {
      case 'geojson':
        fileContent = await saveAsGeoJson(features, targetCRS);
        fileContent = JSON.stringify(fileContent);
        extension = '.geojson';
        break;
      case 'blocks':
      case 'points':
        fileContent = 'not implemented yet';
        extension = '.scr';
        break;
      case 'dxf':
        fileContent = await saveAsDxf(features, targetCRS);
        extension = '.dxf';
        break;
    }

    const path = `${FileSystem.cacheDirectory}collected-data/${fileName}${extension}`;
    await FileSystem.writeAsStringAsync(path, fileContent);

    await MailComposer.composeAsync({
      recipients: [recipient],
      subject: `${Constants.manifest.name} - ${fileName}`,
      body: `Data collected with ${Constants.manifest.name} app, stored to file:\n${path}`,
      attachments: [path],
      isHtml: false
    });
  };

  _deleteFeatures = async () => {
    this.props.actions.removeAllFeatures();
    const fileUri = `${FileSystem.cacheDirectory}collected-data`;
    const { exists } = await FileSystem.getInfoAsync(fileUri);
    if (exists) {
      const files = await FileSystem.readDirectoryAsync(fileUri);
      files.forEach(async fileName => {
        await FileSystem.deleteAsync(`${fileUri}/${fileName}`);
      });
    }
  };

  _getDateFormatted = () => {
    const now = new Date();
    return `${now.getFullYear()}${now.getMonth() < 10 ? '0' + now.getMonth() : now.getMonth()}${
      now.getDay() < 10 ? '0' + now.getDay() : now.getDay()
    }@${now.getHours() < 10 ? '0' + now.getHours() : now.getHours()}${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()}${
      now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
    }`;
  };

  _handleActionPress = async name => {
    switch (name) {
      case 'bt_add_pylon':
        this.addFeature('pylon');
        break;
      case 'bt_add_manhole':
        this.addFeature('manhole');
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
    const { features } = this.props;
    const actions = [
      {
        text: 'Add Pylon',
        // icon: require('./images/ic_accessibility_white.png'),
        name: 'bt_add_pylon',
        position: 1
      },
      {
        text: 'Add Manhole',
        // icon: require('./images/ic_accessibility_white.png'),
        name: 'bt_add_manhole',
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
  title: 'Features',
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

const mapStateToProps = (features, ownProps) => {
  return { features };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(featureActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
