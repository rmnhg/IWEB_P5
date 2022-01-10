import {Button} from 'react-native';

//Internacionalización
import i18n from 'i18n-js';

export default function Reset(props) {
  function click() {
    props.resetClick();
  }

  return(
    <Button onPress={click} color='#841584' title={i18n.t('restart')} ></Button>
  );
    
}