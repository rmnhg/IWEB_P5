import { Text, View } from '../../../components/Themed';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    turn: {
        fontSize: 16
    },
    turnTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 10,
        height: 1,
        width: '60%',
    },
});

export default function Header(props) {
    return (<View>
            <Text style={styles.turnTitle}>{props.turn}</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <Text style={styles.turn}>{props.text}</Text>
        </View>
    );
}