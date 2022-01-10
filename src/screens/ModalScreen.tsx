import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react";
import { Platform, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';

//Para la internacionalización
import i18n from 'i18n-js';
import * as Localization from 'expo-localization';

export default function ModalScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const [selectedValue, setSelectedValue] = useState(i18n.locale);

  const updateLanguage = (lang) => {
      if (lang === 'default') {
          setSelectedValue(Localization.locale);
          i18n.locale = Localization.locale;
      } else {
          setSelectedValue(lang);
          i18n.locale = lang;
      }
      // Actualiza el título del documento usando la API del navegador
      navigation.setOptions({
          title: i18n.t('language'),
      })
  };
  useEffect(() => {
        // Actualiza el título del documento usando la API del navegador
        navigation.setOptions({
            title: i18n.t('language'),
        })
   }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('language')}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Picker
          selectedValue={selectedValue}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) => updateLanguage(itemValue)}
      >
        <Picker.Item label={i18n.t('es')} value="es" />
        <Picker.Item label={i18n.t('en')} value="en" />
        <Picker.Item label={i18n.t('systemLanguage')} value="default" />
      </Picker>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
