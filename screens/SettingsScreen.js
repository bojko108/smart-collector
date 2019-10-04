import React from 'react';
import Constants from 'expo-constants';
import { Alert, SectionList, Image, StyleSheet, Button, TextInput, Text, View, Picker } from 'react-native';

import { getSetting, setSetting, getAllSettings } from '../storage';

export default class SettingsScreen extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { settings: [] };

    this._loadSettings();
  }

  _loadSettings = async () => {
    let settings = getAllSettings();

    for (let i = 0; i < settings.length; i++) {
      settings[i].value = await getSetting(settings[i].key);
    }

    this.setState({ settings });
  };

  _updateSettingInState = async (key, value) => {
    let { settings } = this.state;
    for (let i = 0; i < settings.length; i++) {
      if (settings[i].key === key) {
        settings[i].value = value;
      }
    }
    this.setState({ settings });
  };
  _updateSetting = async ({ key, value }) => {
    await setSetting(key, value);

    Alert.alert('Info', 'Setting was updated!', [{ text: 'OK' }], { cancelable: true });
  };

  _renderSectionHeader = ({ section }) => {
    return <SectionHeader title={section.title} />;
  };

  _renderItem = ({ item }) => {
    const setting = item.value;

    if (setting.type === 'text') {
      return (
        <SectionContent>
          <TextInput style={styles.sectionContentText} value={setting.value} onChangeText={text => this._updateSettingInState(setting.key, text)} />
          <Button title='Save' color='#01ff70' onPress={() => this._updateSetting(setting)} />
        </SectionContent>
      );
    } else {
      return (
        <SectionContent>
          <Text style={styles.sectionContentText}>{setting.value}</Text>
        </SectionContent>
      );
      // dropdown
      return (
        <SectionContent>
          <Picker
            // selectedValue={setting.value}
            style={{ height: 50, width: 100 }}
            onValueChange={(itemValue, itemIndex) => this._updateSetting({ key: setting.key, value: itemValue })}
          >
            {setting.options.map(({ label, value }) => {
              return <Picker.Item key={`key-${label}`} label={label} value={value} />;
            })}
          </Picker>
        </SectionContent>
      );
    }
  };

  render() {
    const { settings } = this.state;
    if (settings.length < 1) return null;

    const sections = settings.map(setting => {
      return { data: [{ value: setting }], title: setting.title };
    });

    return (
      <SectionList
        style={styles.container}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
        stickySectionHeadersEnabled={true}
        keyExtractor={(item, index) => index}
        ListHeaderComponent={ListHeader}
        sections={sections}
      />
    );
  }
}

SettingsScreen.navigationOptions = {
  title: 'Settings'
};

const ListHeader = () => {
  const { manifest } = Constants;

  return (
    <View style={styles.titleContainer}>
      <View style={styles.titleIconContainer}>
        <AppIconPreview iconUrl={manifest.iconUrl} />
      </View>

      <View style={styles.titleTextContainer}>
        <Text style={styles.nameText} numberOfLines={1}>
          {manifest.name}
        </Text>

        <Text style={styles.slugText} numberOfLines={1}>
          {manifest.slug}
        </Text>

        <Text style={styles.descriptionText}>{manifest.description}</Text>
      </View>
    </View>
  );
};

const SectionHeader = ({ title }) => {
  return (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
};

const SectionContent = props => {
  return <View style={styles.sectionContentContainer}>{props.children}</View>;
};

const AppIconPreview = ({ iconUrl }) => {
  if (!iconUrl) {
    iconUrl = 'https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png';
  }

  return <Image source={{ uri: iconUrl }} style={{ width: 64, height: 64 }} resizeMode='cover' />;
};

const Color = ({ value }) => {
  if (!value) {
    return <View />;
  } else {
    return (
      <View style={styles.colorContainer}>
        <View style={[styles.colorPreview, { backgroundColor: value }]} />
        <View style={styles.colorTextContainer}>
          <Text style={styles.sectionContentText}>{value}</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row'
  },
  titleIconContainer: {
    marginRight: 15,
    paddingTop: 2
  },
  sectionHeaderContainer: {
    backgroundColor: '#fbfbfb',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ededed'
  },
  sectionHeaderText: {
    fontSize: 14
  },
  sectionContentContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 15
  },
  sectionContentText: {
    color: '#808080',
    fontSize: 14
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18
  },
  slugText: {
    color: '#a39f9f',
    fontSize: 14,
    backgroundColor: 'transparent'
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 6,
    color: '#4d4d4d'
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  colorPreview: {
    width: 17,
    height: 17,
    borderRadius: 2,
    marginRight: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc'
  },
  colorTextContainer: {
    flex: 1
  }
});
