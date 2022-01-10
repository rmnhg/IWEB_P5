import React, {useState, useContext, useEffect} from "react";
import { StyleSheet, TextInput, Button, Alert, Dimensions, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import EditScreenInfo from '../../../components/EditScreenInfo';
import { Text, View } from '../../../components/Themed';

import QuizzesColumn from "./QuizzesColumn";
import QuizImage from "./QuizImage";
import Author from "./Author";

//Internacionalización
import i18n from 'i18n-js';

import {quizzes} from "../../assets/mock-data";
class QuizModel {
  constructor() {
    this.initialState = {
      score: 0,
      finished: false,
      currentQuiz: 0,
      answeredQuizzes: [],
      quizzes: [...quizzes]
    }
    this.reset();
  }

  reset() {
    this.score = this.initialState.score;
    this.finished = this.initialState.finished;
    this.currentQuiz = this.initialState.currentQuiz;
    this.answeredQuizzes = [];
    for (let i in this.initialState.quizzes) {
      this.answeredQuizzes[i] = "";
    }
    this.quizzes = this.initialState.quizzes;
  }

  setQuizzes(quizzes) {
    this.quizzes = [...quizzes];
    this.initialState.quizzes = [...quizzes];
  }
}

const MARGIN = 30;

export default function QuizScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [quizModel, setQuizModel] = useState(new QuizModel());
  const quizzes = quizModel.quizzes;
  const currentQuiz = quizModel.currentQuiz;
  const MAX_CHARACTERS = 50;

  const setUserAnswer = (answer) => {
    let nuevoQM = new QuizModel();
    nuevoQM.score = quizModel.score;
    nuevoQM.finished = quizModel.finished;
    nuevoQM.currentQuiz = quizModel.currentQuiz;
    nuevoQM.answeredQuizzes = [];
    for (let i in quizModel.answeredQuizzes) {
      nuevoQM.answeredQuizzes[i] = quizModel.answeredQuizzes[i] || "";
    }
    nuevoQM.answeredQuizzes[quizModel.currentQuiz] = answer;
    nuevoQM.quizzes = [...quizModel.quizzes];
    setQuizModel(nuevoQM);
  }

  const checkAnswers = (alertMessage) => {
    let nuevoQM = new QuizModel();
    let score = 0;
    for (let qi in quizModel.answeredQuizzes) {
      score += (quizModel.answeredQuizzes[qi].toLowerCase() === quizModel.quizzes[qi].answer.toLowerCase()) ? 1 : 0;
    }
    nuevoQM.score = score;
    nuevoQM.finished = true;
    nuevoQM.currentQuiz = quizModel.currentQuiz;
    nuevoQM.answeredQuizzes = [];
    for (let i = 0; i < quizModel.quizzes.length; i++) {
      nuevoQM.answeredQuizzes[i] = quizModel.answeredQuizzes[i] || "";
    }
    nuevoQM.quizzes = [...quizModel.quizzes];
    setQuizModel(nuevoQM);
    //alert(alertMessage+score);
      Alert.alert(
          i18n.t('finishedQuiz'),
          alertMessage+score,
          [
            { text: "OK" }
          ]
      );
  }

  const setCurrentQuiz = (currentQuiz) => {
    let nuevoQM = new QuizModel();
    nuevoQM.score = quizModel.score;
    nuevoQM.finished = quizModel.finished;
    nuevoQM.currentQuiz = currentQuiz;
    nuevoQM.quizzes = [...quizModel.quizzes];
    nuevoQM.answeredQuizzes = [...quizModel.answeredQuizzes];
    setQuizModel(nuevoQM);
    // Actualiza el título del documento usando la API del navegador
    navigation.setOptions({
      title: `Quiz - ${quizzes[currentQuiz].question.substring(0, MAX_CHARACTERS)}`,
    })
    return quizModel.answeredQuizzes[currentQuiz] || "";
  }

  const cheat = () => {
    setUserAnswer(quizzes[currentQuiz].answer);
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      quizModel.reset();
      const url_base = "https://core.dit.upm.es/api";
      const token = "e176550118dd9de9e5f0";
      try {
        const res = await fetch(url_base+"/quizzes/random10wa?token="+token);
        const quiz_json = await res.json();
        quizModel.setQuizzes(quiz_json);
      } catch (e) {
        quizModel.setQuizzes(quizzes);
      }
    } catch (e) {}
    setFirstLoad(false);
    setLoading(false);
  };

  useEffect(() => {
    if (firstLoad)
      fetchData();

    // Actualiza el título del documento usando la API del navegador
    navigation.setOptions({
      title: `Quiz - ${quizzes[currentQuiz].question.substring(0, MAX_CHARACTERS)}`,
    })
    // eslint-disable-next-line
  }, []);

  if (loading) {
    let spinnerPath = require("../../assets/spinner.gif")
    return (
        <Image source={spinnerPath} style={styles.spinnerImage} ></Image>
    );
  } else {
    return (
        <View style={{flex:1, margin: MARGIN}} >
        <Text numberOfLines={1} style={styles.question}>{quizzes[currentQuiz].question.substring(0, MAX_CHARACTERS)}</Text>
        <QuizImage img={quizzes[currentQuiz].attachment} question={quizzes[currentQuiz].question}/>
        {quizModel.finished ? <TextInput style={styles.input} editable={false} value={quizModel.answeredQuizzes[quizModel.currentQuiz]} /> : <TextInput style={styles.input} onChangeText={setUserAnswer} value={quizModel.answeredQuizzes[quizModel.currentQuiz]} />}
        {quizModel.finished ? <Button color='#841584' title={i18n.t("restart")} onPress={() => fetchData()}></Button> : <Button color='#841584' title={i18n.t("checkAnswers")} onPress={() => checkAnswers(i18n.t("finishAlert"))}></Button>}
        <Button color='#841584' title={i18n.t("previous")} onPress={() => (currentQuiz - 1 < 0) ? false : setCurrentQuiz(currentQuiz-1)}></Button>
        <Button color='#841584' title={i18n.t("next")} onPress={() => (currentQuiz + 1 < quizModel.quizzes.length) ? setCurrentQuiz(currentQuiz+1) : false}></Button>
        {quizModel.finished ? <Button color='#841584' title={"🤑"} disabled ></Button> : <Button color='#841584' title={"🤑"} onPress={() => cheat()}></Button>}
        <Author author={quizzes[currentQuiz].author}/>
        <Text>
          <Text style={{fontWeight: "bold"}}>{i18n.t("score")}</Text>
          <Text>{quizModel.score}</Text>
        </Text>
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
  question: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: MARGIN,
    height: 1,
    width: '80%',
  },
  spinnerImage: {
    width: Dimensions.get('window').width-MARGIN*2,
    height: (Dimensions.get('window').width-MARGIN*2),
  },
  input: {
    borderColor: '#000000',
    borderWidth: 1
  }
});
