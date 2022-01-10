import { StyleSheet, Image } from 'react-native';

import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import { useIsFocused } from '@react-navigation/native';

import {useState, useEffect } from "react";

//Internacionalización
import i18n from 'i18n-js';

const styleImage = StyleSheet.create({
    logo: {
        width: 320,
        height: 214,
    },
});

export default function InfoScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const isFocused = useIsFocused();
  const imagePath = i18n.locale.includes('es') ? require("../assets/juegos_es.png") : require("../assets/juegos_en.png");

  useEffect(() => {
      //Updates the state you want to be updated
  } , [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('pagetitle')}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>{i18n.t('infol1')}</Text>
      <Text>{i18n.t('infol2')}</Text>
      <Text>{i18n.t('infol3')}</Text>
      <Image
          style={styleImage.logo}
          source={imagePath}
      />
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
