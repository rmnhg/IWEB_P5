import {useContext, useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

//Para la internazionalizción
import es from './src/lang/es.json';
import en from './src/lang/en.json';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

//Se prepara la internazionalización
const dictionaryList = { en, es };
i18n.fallbacks = true;
i18n.translations = dictionaryList;
i18n.locale = Localization.locale;

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
      </SafeAreaProvider>
    );
  }
}
