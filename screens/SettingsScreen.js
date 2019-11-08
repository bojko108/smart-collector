import React from 'react';
import { SectionList, StyleSheet, TextInput, Picker } from 'react-native';
import { ListHeader, SectionHeader, SectionContent } from '../components/Common';
import { getSetting, setSetting, getAllSettings } from '../storage';
import Colors from '../constants/Colors';

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
  /**
   * Updates a setting value in current state and AsyncStorage
   */
  _updateSetting = async (key, value) => {
    let { settings } = this.state;
    for (let i = 0; i < settings.length; i++) {
      if (settings[i].key === key) {
        settings[i].value = value;
      }
    }
    this.setState({ settings });
    await setSetting(key, value);
  };

  _renderSectionHeader = ({ section }) => {
    return <SectionHeader title={section.title} description={section.data[0].value.description} />;
  };

  _renderItem = ({ item }) => {
    const setting = item.value;

    if (setting.type === 'text') {
      return (
        <SectionContent>
          <TextInput
            style={styles.sectionContentText}
            value={setting.value}
            editable={setting.editable}
            onChangeText={text => {
              this._updateSetting(setting.key, text);
            }}
          />
        </SectionContent>
      );
    } else {
      // dropdown
      return (
        <SectionContent>
          <Picker
            selectedValue={setting.value}
            onValueChange={(itemValue, itemIndex) => {
              this._updateSetting(setting.key, itemValue);
            }}
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

    const sections = settings
      .filter(setting => setting.visible)
      .map(setting => {
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
  title: 'Settings',
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
  sectionContentText: {
    // color: '#808080',
    fontSize: 14,
    borderColor: Colors.dark,
    borderWidth: 1,
    paddingHorizontal: 10
  }
});
