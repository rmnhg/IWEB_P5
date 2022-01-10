import React from 'react';
import {TouchableHighlight, Text, StyleSheet} from 'react-native';

const squareStyle = {
  height: '100px',
  width: '100px',
};

export default function Square(props) {

  function squareClick() {
    if(props.value === "-") {
      props.boardClick(props.rowIndex, props.columnIndex);
    }
  }

  return(
      <TouchableHighlight style={styles.square} onPress={squareClick} disabled={props.value != '-'}>
        <Text style={styles.squareText}>
          {props.value}
        </Text>
      </TouchableHighlight>
  );

}

const styles = StyleSheet.create({
  square: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#841584'
  },
  squareText: {
    fontSize: 60,
    color: 'white'
  }

});