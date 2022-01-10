import React from "react";
import { StyleSheet, TextInput, Button } from 'react-native';

import { Text, View } from '../../../components/Themed';

//Internacionalización
import i18n from 'i18n-js';

export default function QuizScreen(props) {
    return(
    <View style={{flexDirection: "row", justifyContent: 'space-between'}}>
        <View>
            {props.quizModel.finished ? <Button color='#841584' title={i18n.t("restart")} onPress={() => props.fetchData()}></Button> : <Button color='#841584' title={i18n.t("checkAnswers")} onPress={() => props.checkAnswers(i18n.t("finishAlert"))}></Button>}
        </View>
        <View>
            <Button color='#841584' title={i18n.t("previous")} onPress={() => (props.currentQuiz - 1 < 0) ? false : props.setCurrentQuiz(props.currentQuiz-1)}></Button>
        </View>
        <View>
            <Button color='#841584' title={i18n.t("next")} onPress={() => (props.currentQuiz + 1 < props.quizModel.quizzes.length) ? props.setCurrentQuiz(props.currentQuiz+1) : false}></Button>
        </View>
        <View>
            {props.quizModel.finished ? <Button color='#841584' title={"🤑"} disabled ></Button> : <Button color='#841584' title={"🤑"} onPress={() => props.cheat()}></Button>}
        </View>
    </View>
    );
}