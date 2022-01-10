/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

//Screens
import ModalScreen from '../src/screens/ModalScreen';
import NotFoundScreen from '../src/screens/NotFoundScreen';
import InfoScreen from '../src/screens/InfoScreen';
import TicTacToeScreen from '../src/screens/TicTacToe/TicTacToeScreen';
import QuizScreen from '../src/screens/Quiz/QuizScreen';

//Internazionalización
import i18n from 'i18n-js';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const isFocused = useIsFocused();
  const colorScheme = useColorScheme();

  React.useEffect(() => {
     //Updates the state you want to be updated
  } , [isFocused]);

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="Home"
        component={InfoScreen}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          title: i18n.t('hometabbutton'),
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TicTacToe"
        component={TicTacToeScreen}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          title: i18n.t('tictactoetabbutton'),
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
            headerRight: () => (
                <Pressable
                    onPress={() => navigation.navigate('Modal')}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                    })}>
                    <FontAwesome
                        name="info-circle"
                        size={25}
                        color={Colors[colorScheme].text}
                        style={{ marginRight: 15 }}
                    />
                </Pressable>
            ),
        })}
      />
      <BottomTab.Screen
        name="Quiz"
        component={QuizScreen}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          title: i18n.t('quiztabbutton'),
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
            headerRight: () => (
                <Pressable
                    onPress={() => navigation.navigate('Modal')}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                    })}>
                    <FontAwesome
                        name="info-circle"
                        size={25}
                        color={Colors[colorScheme].text}
                        style={{ marginRight: 15 }}
                    />
                </Pressable>
            ),
        })}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
