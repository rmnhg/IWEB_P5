import React from 'react';
import Square from './Square';
import {View, Text, StyleSheet} from 'react-native';

export default function Board(props) {
    function boardClick(rowNumber, columnNumber) {
        props.appClick(rowNumber, columnNumber);
    }

    let board = props.values.map((rowValues, rowIndex) => {
        let row = rowValues.map((value, columnIndex) => {
            return (
                <Square value={value} key={rowIndex + "-" + columnIndex} rowIndex={rowIndex}
                        columnIndex={columnIndex} boardClick={boardClick}/>
            );
        });
        return (
            <View style={styles.boardRow} key={"row" + rowIndex}>
                {row}
            </View>
        );
    });

    return (
        <View style={styles.board}>
            {board}
        </View>
    );

}

const styles = StyleSheet.create({
    board: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    boardRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }

});