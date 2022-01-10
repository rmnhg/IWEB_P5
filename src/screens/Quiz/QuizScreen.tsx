import React, {useState, useContext, useEffect} from "react";
import { StyleSheet, TextInput, Button, Alert, Dimensions, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EditScreenInfo from '../../../components/EditScreenInfo';
import { Text, View } from '../../../components/Themed';

import QuizButtons from "./QuizButtons";
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

  const _storeData = async () => {
    try {
      await AsyncStorage.setItem(
          '@P5_2021_IWEB:quiz',
          JSON.stringify(quizModel.quizzes)
      );
    } catch (error) {
      // Error saving data
    }
  };

  const _removeData = async () => {
    try {
      await AsyncStorage.removeItem(
          '@P5_2021_IWEB:quiz'
      );
    } catch (error) {
      // Error saving data
    }
  };

  const _retrieveData = async () => {
    setLoading(true);
    try {
      const value = await AsyncStorage.getItem('@P5_2021_IWEB:quiz');
      if (value !== null) {
        // We have data!!
        let nuevoQM = new QuizModel();
        nuevoQM.score = 0;
        nuevoQM.finished = false;
        nuevoQM.currentQuiz = 0;
        nuevoQM.answeredQuizzes = [];
        nuevoQM.quizzes = [...JSON.parse(value)];
        setQuizModel(nuevoQM);
      } else {

      }
    } catch (error) {
      // Error retrieving data
    }
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Image source={spinnerPath} style={styles.spinnerImage} ></Image>
        </View>
    );
  } else {
    return (
        <View style={{flex:1, margin: MARGIN}} >
          <Text numberOfLines={1} style={styles.question}>{quizzes[currentQuiz].question.substring(0, MAX_CHARACTERS)}</Text>
          <QuizImage img={quizzes[currentQuiz].attachment} question={quizzes[currentQuiz].question}/>
          {quizModel.finished ? <TextInput style={styles.input} editable={false} value={quizModel.answeredQuizzes[quizModel.currentQuiz]} /> : <TextInput style={styles.input} onChangeText={setUserAnswer} onSubmitEditing={() => (currentQuiz + 1 < quizModel.quizzes.length) ? setCurrentQuiz(currentQuiz+1) : checkAnswers(i18n.t("finishAlert"))} value={quizModel.answeredQuizzes[quizModel.currentQuiz]} />}
          <QuizButtons fetchData={fetchData} checkAnswers={checkAnswers} currentQuiz={currentQuiz} quizModel={quizModel} setCurrentQuiz={setCurrentQuiz} cheat={cheat} />
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          <Button color='#841584' titleStyle={{fontSize: 10}} buttonStyle={{ borderRadius: 30, height: 30 }} title={i18n.t("save")} onPress={_storeData}></Button>
          <Button color='#841584' titleStyle={{fontSize: 10}} buttonStyle={{ borderRadius: 30, height: 30 }} title={i18n.t("load")} onPress={_retrieveData}></Button>
          <Button color='#841584' titleStyle={{fontSize: 10}} buttonStyle={{ borderRadius: 30, height: 30 }} title={i18n.t("remove")} onPress={_removeData}></Button>
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
    flexDirection: "row",
    justifyContent: 'space-between',
    height: 1,
    width: '100%',
  },
  spinnerImage: {
    width: Dimensions.get('window').width-MARGIN*2,
    height: (Dimensions.get('window').width-MARGIN*2),
  },
  input: {
    borderColor: '#000000',
    borderWidth: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 5,
  }
});
