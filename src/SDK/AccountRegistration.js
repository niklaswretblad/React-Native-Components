
import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Button,
  FlatList,
  Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import InputFeedback from './InputFeedback'

/*
  Matching passwords containing:
    * At least 8 characters
    * One number
    * One Uppercase
    * One lowercase
*/
const defaultValidatePassword = (password) => {
  return String(password).match(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
  )
}

/*
  AccountRegistration

  Customizable form for registering an account for a service. Default version
  only contain input fields for username and password. Users are able to define
  their own input fields, and the form and input fields contain an array of
  different customizable options.

  Params:

  onSubmit - function

  A callback function used to send the results of the form back to the caller/user.
  Takes one parameter, accountInfo which is an array holding the results.
  The accountInfo array has three parameters: one field each for the username and password
  and an options array holding the results of the custom defined input forms.

  Options - Array

  Array containing user defined input fields for the registration form.
  Read below for information how to define an option.

  Option - object

  Object defining a custom input field for the account form. Supplied to the
  AccountForm component via its options parameter.

  Params:

  title - string

  Title of the input field. If supplied the title will be displayed just above
  the input form.

  type - string

  Defines the type of the input field. There are only two types:

  date - the input form contains pickers/selectors for year/month/day
  text - the input form contains a text input

  keyboardType - string

  Determines which keyboardType to be used for the input field if the input field
  is of the type text. Follows the base react native component TextInputs
  keyboardType field. Options are:

  default
  number-pad
  decimal-pad
  numeric
  email-address
  phone-pad

  Can be read about here: https://reactnative.dev/docs/textinput#keyboardtype

  maxLength - integer

  Sets the maximum length of the input text if a text inputfield is used.

  required - boolean

  Defines if the input field is required or not. Required input fields will display
  a red color in the input feedback to the right of the input field if they
  are empty or not accepted (accepted by the user defined or default validatorFunction).
  If a required input field isn't accepted by the time the user clicks on the submit
  button (tries to submit the details of the account), the user will be prompted by
  an alert telling the user to fix the information in the required field.

  validationFunction - function

  A user defined function that is used to control/validate what data is
  accepted in an input field. Takes a string as a parameter, and returns true/false
  whether the supplied text is accepted or not.

  If no user validation function is passed along the option, the default one will
  be used for the input field. The default one simply accepts any input that isn't
  empty, ie. has a length larger than zero.
*/
export default function AccountRegistration(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameApproved, setUsernameApproved] = useState(false)
  const [passwordApproved, setpasswordApproved] = useState(false)
  const [optionValues, setOptionValues] = useState([])
  const [approvedOptions, setApprovedOptions] = useState([])

  const renderOption = (item) => {
    var option = item.item

    if (item.index == 0) {
      return (
        <InputFeedback
          style={styles.inputFeedback}
          type='text'
          title='Username'
          onChange={(text, approved) => {
          setUsername(text)
          setUsernameApproved(approved)
        }}/>
      )
    } else if (item.index == 1) {
      return (
        <InputFeedback
          style={styles.inputFeedback}
          type='text'
          title='Password'
          secureTextEntry={true}
          validationFunction={getPasswordValidator()}
          onChange={(text, approved) => {
            setPassword(text)
            setpasswordApproved(approved)
          }}/>
      )
    } else {
      if (option.type === 'text') {
        return (
          <View>
            <InputFeedback
              style={styles.inputFeedback}
              type={option.type}
              title={option.title}
              validationFunction={option.validationFunction}
              maxLength={option.maxLength}
              keyboardType={option.keyboardType}
              secureTextEntry={option.secureTextEntry}
              key={item.index - 2}
              declinedStyle={!option.required ? styles.notRequiredOptionDeclined : styles.requiredOptionDeclined}
              onChange={(text, approved) => {
                onOptionChange(text, approved, item.index-2)
              }}
              />
          </View>
        )
      } else if (option.type === 'date') {
        return (
          <InputFeedback
            style={styles.inputFeedback}
            type={option.type}
            title={option.title}
            maxLength={option.maxLength}
            keyboardType={option.keyboardType}
            secureTextEntry={option.secureTextEntry}
            key={item.index - 2}
            declinedStyle={!option.required ? styles.notRequiredOptionDeclined : styles.requiredOptionDeclined}
            onChange={(val, approved) => {
              onOptionChange(val, approved, item.index-2)
            }}
            />
        )
      }
    }
  }

  /*
    The onChange callback for all the option inputfeedbacks
    Recieves the result if the text in any of the feedbacks gets changed
  */
  const onOptionChange = (val, approved, idx) => {
    var ov = optionValues
    var ao = approvedOptions

    ov[idx] = val
    ao[idx] = approved

    setOptionValues(ov)
    setApprovedOptions(ao)
  }

  /*
    Checks if all the required options are approved,
    returns true/false depending on the result
  */
  const optionsAreApproved = () => {

    if (!passwordApproved || !usernameApproved) return false

    var appOptions = approvedOptions
    for (let i = 0; i < props.options.length; i++) {
      if (props.options[i].required && appOptions[i] !== true) {
        return false
      }
    }

    return true
  }

  /*
    Displays an alert showing which options needs to
    be filled in before a submit is accepted
  */
  const showNotApprovedAlert = () => {
    var optionsNotApproved = []
    var appOptions = approvedOptions
    for (let i = 0; i < props.options.length; i++) {
      if (props.options[i].required && !appOptions[i]) {
        optionsNotApproved.push(props.options[i].title)
      }
    }

    var msg = "You need to complete the following information to proceed:\n\n"
    if (!usernameApproved) {
      msg = msg + 'Username' + '\n'
    }

    if (!passwordApproved) {
      msg = msg + 'Password' + '\n'
    }


    for (let i = 0; i < optionsNotApproved.length; i++) {
      msg = msg + optionsNotApproved[i] + '\n'
    }

    Alert.alert(
      "Missing information",
      msg,
      [
        { text: "OK", onPress: () => {} }
      ]
    );
  }

  /*
  Called when the user clicks on the submit button.
  Checks whether the input is approved or not. If approved it returns
  the user
  */
  const onSubmitClick = () => {
    // Check if all required options are approved,
    // if so return the option values to the caller
    // otherwise prompt the user which options needs to be filled
    if (optionsAreApproved()) {

      var accountInfo = {
        username: username,
        password: password,
      }

      accountInfo.options = []
      for (let i = 0; i < props.options.length; i++) {
        accountInfo.options[i] = {
          title: props.options[i].title,
          value: optionValues[i],
          key: i
        }
      }

      props.onSubmit(accountInfo)
    } else {
      showNotApprovedAlert()
    }
  }

  /*
    Adds two placeholder values in the beginning of the
    options array. This function is used to retrieve the data
    for the flatlist. Two placeholder values are added in the beginning
    to represent the username and password elements in the flatlist. These
    are added in the renderItem function. When these two elements are
    iterated over, the username/password fields are created
  */
  const fattenOptionsData = () => {
    var additions = [
      {
        placeholder: 'placeholder'
      },
      {
        placeholder: 'placeholder'
      }
    ]

    return additions.concat(props.options)
  }

  /*
    Returns the user defined password validator function
    if one is supplied otherwise returns the default validator
    function.
  */
  const getPasswordValidator = () => {
    if (props.passwordValidation === undefined) {
      return defaultValidatePassword
    } else {
      return props.passwordValidation
    }
  }

  return (
    <View style={[
        styles.container,
      ]}>
        <FlatList
          data={fattenOptionsData()}
          renderItem={renderOption}
          keyExtractor={(item, index) => index.toString()}
          />
        <View style={styles.submitButtonContainer}>
          <Button title='Submit' onPress={onSubmitClick}></Button>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 5,
    marginLeft: 5,
  },
  inputFeedback: {

  },
  submitButtonContainer: {
    marginTop: 10,
    marginBottom: 10
  },
  requiredOptionDeclined: {
    backgroundColor: 'rgba(250, 0, 0, 0.5)'
  },
  notRequiredOptionDeclined: {
    backgroundColor: 'rgba(243, 190, 57, 0.5)'
  }
});
