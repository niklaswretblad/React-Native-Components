
import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image
} from 'react-native';

const CHECK_MARK_IMG = require('./assets/checkmark.png')
const X_IMG = require('./assets/x.png')
import ModalDropdown from 'react-native-modal-dropdown';

const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const DAYS = [...Array(31).keys()].map(i => (i + 1).toString());
const YEARS = [...Array(50).keys()].map(i => (i + 1971).toString());

/*
  InputFeedback

  Customizable form for registering an account for a service. Default version
  only contain input fields for username and password. Users are able to define
  their own input fields, and the form and input fields contain an array of
  different customizable options.

  Params:

  onChange - function

  A callback function used to send the results of the form back to the caller/user.
  Takes two parameters, first a parameter containing the value changed, and
  the second is a bool that returns whether or not the value is accepted or not. The
  user need to define their own and supply this function to the component to
  recieve  the results.

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

  validationFunction - function

  A user defined function that is used to control/validate what data is
  accepted in the input field. Takes a string (the entered text) as a parameter,
  and returns true/false whether the supplied text is accepted or not.

  If no user validation function is passed along the option, the default one will
  be used for the input field. The default one simply accepts any input that isn't
  empty, ie. has a length larger than zero.
*/
export default function InputFeedback(props) {
  const [accepted, setAccepted] = useState(false)
  const [focused, setFocused] = useState(false)
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedDay, setSelectedDay] = useState('')

  const onChangeText = useCallback((text) => {
    var acc = false
    if (props.validationFunction === undefined) {
      acc = defaultValidationFunction(text)
    } else {
      acc = props.validationFunction(text)
    }
    setAccepted(acc)
    props.onChange(text, acc)
  })

  const defaultValidationFunction = useCallback((text) => {
    if (text.length > 0) {
      return true
    } else {
      return false
    }
  })

  useEffect(() => {
    validateDate()
  }, [selectedYear, selectedMonth, selectedDay])

  const validateDate = useCallback(() => {
    if (selectedYear.length > 0 &&
        selectedMonth.length > 0 &&
        selectedDay.length > 0) {
        setAccepted(true)
        props.onChange({
            year: selectedYear,
            month: selectedMonth,
            day: selectedDay
          },
          true)
        return
    }
    setAccepted(false)
  })

  const onDropdownWillShow = useCallback(() => {
    setFocused(true)
  }, []);

  const onDropdownWillHide = useCallback(() => {
    setFocused(false)
  }, []);

  const handleFocus = useCallback(() => {
    setFocused(true)
  })

  const handleBlur = useCallback(() => {
    setFocused(false)
  })

  const getApprovedStyle = useCallback(() => {
    if (props.approvedStyle !== undefined) {
      return props.approvedStyle
    } else {
      return styles.feedbackApproved
    }
  })

  const getDeclinedStyle = useCallback(() => {
    if (props.declinedStyle !== undefined) {
      return props.declinedStyle
    } else {
      return styles.feedbackDeclined
    }
  })

  const renderContent = () => {
    if (props.type === 'text') {
      return (
        <TextInput style={styles.textInput}
                   placeholder={props.placeholder}
                   onChangeText={onChangeText}
                   onFocus={handleFocus}
                   onBlur={handleBlur}
                   maxLength={props.maxLength}
                   secureTextEntry={props.secureTextEntry}
                   keyboardType={props.keyboardType}
                   />
      )
    } else if (props.type === 'date') {
      return (
        <View style={styles.dateContainer}>
          <ModalDropdown style={styles.dropDownContainer}
                         options={YEARS}
                         defaultValue='Year'
                         onDropdownWillHide={onDropdownWillHide}
                         onDropdownWillShow={onDropdownWillShow}
                         onSelect={(idx, value) => setSelectedYear(value)}/>
          <ModalDropdown style={styles.dropDownContainer}
                        options={MONTHS}
                        defaultValue='Month'
                        onDropdownWillHide={onDropdownWillHide}
                        onDropdownWillShow={onDropdownWillShow}
                        onSelect={(idx, value) => setSelectedMonth(value)}/>
          <ModalDropdown style={styles.dropDownContainer}
                        options={DAYS}
                       defaultValue='Day'
                       onDropdownWillHide={onDropdownWillHide}
                       onDropdownWillShow={onDropdownWillShow}
                       onSelect={(idx, value) => setSelectedDay(value)}/>
        </View>
      )
    }
  }

  useEffect(() => {
    props.onChange('', accepted)
  }, [])

  return (
    <View style={[props.style,]}>
      {!(props.title === undefined) && <Text>{props.title}</Text>}
      <View style={[
          styles.contentContainer,
          focused ? styles.focused : styles.notFocused
        ]}>
        <View style={styles.inputContainer}>
          {renderContent()}
        </View>
        <View style={[
            styles.feedbackContainer,
            accepted ? getApprovedStyle() : getDeclinedStyle()
          ]}>
          <Image style={styles.feedbackImg}
                 source={accepted ? CHECK_MARK_IMG : X_IMG}/>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {

  },
  contentContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  feedbackContainer: {
    justifyContent: 'center',
    backgroundColor: 'rgba(43, 176, 43, 0.5)'
  },
  feedbackApproved: {
    backgroundColor: 'rgba(43, 176, 43, 0.5)'
  },
  feedbackDeclined: {
    backgroundColor: 'rgba(250, 0, 0, 0.5)'
  },
  textInput: {
    padding: 5,
  },
  feedbackImg: {
    width: 15,
    height: 15,
    margin: 15
  },
  focused: {
    borderColor: '#17a7ff',
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notFocused: {
    borderColor: '#d1d1d1',
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  dateContainer: {
    flexDirection: 'row'
  },
  dropDownContainer: {
    borderWidth: 1,
    borderColor: '#d1d1d1',
    padding: 10,
    marginRight: 10,
    borderRadius: 5
  }
});
