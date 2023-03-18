
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AccountRegistration from './src/SDK/AccountRegistration'

/*
  Returning true if the supplied string is a password containing:
    * At least 8 characters
    * One number
    * One Uppercase
    * One lowercase
*/
const validatePassword = (password) => {
  return String(password).match(
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
  ) !== null;
}

/*
  Returns true if the supplied string matches an email, false otherwise
*/
const emailValidation = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) !== null;
}

/*
  Options for the AccountRegistration. Contains the custom fields
  we want in our account registration form.
*/
const options = [
  {
    title: 'E-mail',
    type: 'text',
    keyboardType: 'email-address',
    required: true,
    validationFunction: emailValidation
  },
  {
    title: 'First name',
    type: 'text',
    keyboardType: 'default',
    required: false,
    maxLength: 20
  },
  {
    title: 'Last name',
    type: 'text',
    keyboardType: 'default',
    required: false,
    maxLength: 20
  },
  {
    title: 'Birth date',
    type: 'date',
    required: true,
  }
]

export default function App() {
  const [accountInfo, setAccountInfo] = useState({})

  const onAccountSubmit = (accountInfo) => {
    setAccountInfo(accountInfo)
  }

  const displayAccountInfo = () => {
    var elements = []

    if (accountInfo.username !== undefined) {
      elements.push(<Text key='username'>{'Username: ' + accountInfo.username}</Text>)
    }

    if (accountInfo.username !== undefined) {
      elements.push(<Text key='password'>{'Password: ' + accountInfo.password}</Text>)
    }

    if (accountInfo.options !== undefined && accountInfo.options.length > 0) {
      elements = elements.concat(accountInfo.options.map(option => <Text key={option.key}>{option.title + ': ' + option.value}</Text>))
    }

    return elements
  }

  return (
    <View style={styles.container}>
      <AccountRegistration options={options} onSubmit={onAccountSubmit}/>
      {displayAccountInfo()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight
  }
});
