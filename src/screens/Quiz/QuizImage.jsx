import React from 'react';
import {useContext} from "react";
import { StyleSheet, Image, Dimensions } from "react-native";

//Internacionalización
import i18n from 'i18n-js';

const margin = 30;

const styleImage = StyleSheet.create({
    quizImage: {
        width: Dimensions.get('window').width-margin*2,
        height: (Dimensions.get('window').width-margin*2)*108/192,
    },
});

export default function QuizImage(props) {
    if (props.img !== null && props.img.url !== null) {
        return(<Image source={{uri: props.img.url}} style={styleImage.quizImage} alt={i18n.t('altImgQuiz')+props.question}></Image>);
    } else {
        return(<></>);
    }
}