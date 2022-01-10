import React from 'react';
import {useContext} from "react";
import { View, Text, Image, StyleSheet } from "react-native";

//Internacionalización
import i18n from 'i18n-js';

const styles = StyleSheet.create({
    authorImage: {
        width: 50,
        height: 50,
        borderRadius: 50/2
    },
    container: {
        flexDirection: 'row',
        marginVertical: 5
    },
    authorStr: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginHorizontal: 10
    }
});

export default function Author(props) {
    const authorStr = (props.author !== null && props.author.username !== null) ? props.author.username : (props.author !== null && props.author.profileName !== null) ? props.author.profileName : i18n.t("anonymous");
    return(
        <View style={styles.container}>
            <View style={styles.authorStr}>
                <Text>{authorStr}</Text>
            </View>
            {(props.author !== null && props.author.photo !== null && props.author.photo.url !== null) ? <Image source={{uri: props.author.photo.url}} style={styles.authorImage} alt={i18n.t("altImgAuthor")+authorStr}></Image> : <></>}
        </View>
    );
}