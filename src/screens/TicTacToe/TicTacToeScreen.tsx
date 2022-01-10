import React, {useState, useEffect} from "react";
import { StyleSheet, Image, Dimensions } from 'react-native';

import { Text, View } from '../../../components/Themed';

import { useIsFocused } from '@react-navigation/native';

import Header from './Header.jsx';
import Board from './Board.jsx';
import Reset from './Reset.jsx';

//Internacionalización
import i18n from 'i18n-js';

const MARGIN = 30;

export default function TicTacToeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const isFocused = useIsFocused();
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [turn, setTurn] = useState('X');
  const [moves, setMoves] = useState(0);
  const [values, setValues] = useState([
    ['-', '-', '-'],
    ['-', '-', '-'],
    ['-', '-', '-']
  ]);
  const currentTurnStr = i18n.t('turnof') + (turn === 'X' ? i18n.t('PLAYERX') : i18n.t('PLAYER0'));

  /**
   * Reinicia la partida del tres en raya
   */
  function resetClick(){
    setTurn('X');
    setMoves(0);
    setValues([
      ['-', '-', '-'],
      ['-', '-', '-'],
      ['-', '-', '-']
    ]);
    // Actualiza el título del documento usando la API del navegador
    navigation.setOptions({
      title: i18n.t('tictactoetabbutton')+" - "+ i18n.t('turnof') + (turn === 'X' ? i18n.t('PLAYERX') : i18n.t('PLAYER0')),
    })
  }

  function appClick(rowNumber, columnNumber) {
    let valuesCopy = JSON.parse(JSON.stringify(values));
    let newMovement = turn;
    valuesCopy[rowNumber][columnNumber] = newMovement;
    setTurn(turn === 'X' ? '0' : 'X');
    setValues(valuesCopy);
    setMoves(moves + 1);
    navigation.setOptions({
      title: i18n.t('tictactoetabbutton')+" - "+currentTurnStr,
    })
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("http://myjson.dit.upm.es/api/bins/ccr5");
        const myjson = await res.json();
        setTurn(myjson.turn.includes('X') ? 'X' : '0');
        setMoves(myjson.moves);
        setValues(myjson.values);
      } catch (e) {}
      setFirstLoad(false);
      setLoading(false);
    }

    if (firstLoad)
      fetchData();
    // Actualiza el título del documento usando la API del navegador
    navigation.setOptions({
      title: i18n.t('tictactoetabbutton')+" - "+currentTurnStr,
    })
  }, [isFocused]);

  if (loading) {
    let spinnerPath = require("../../assets/spinner.gif")
    return (
        <Image source={spinnerPath} style={styles.spinnerImage} ></Image>
    );
  } else {
    return (
        <View style={{flex: 1, margin: MARGIN}}>
          <Header turn={i18n.t("turn")} text={currentTurnStr}/>
          <Board values={values} appClick={appClick} turnof={currentTurnStr}/>
          <Text style={styles.movements}>{i18n.t("movements") + moves}</Text>
          <Reset resetClick={resetClick}></Reset>
        </View>
    );
  }
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
    marginVertical: MARGIN,
    height: 1,
    width: '80%',
  },
  movements: {
    textAlign: 'center'
  },
  spinnerImage: {
    width: Dimensions.get('window').width-MARGIN*2,
    height: (Dimensions.get('window').width-MARGIN*2),
  }
});
