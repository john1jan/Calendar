import React, {useEffect, useState, useRef} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

const Calendar = () => {
  const [curDate, setCurDate] = useState(new Date());
  const [cal, setCal] = useState(null);
  const [curDet, setCurDet] = useState([
    new Date().getMonth(),
    new Date().getFullYear(),
  ]);
  const [inputDate, setInputDate] = useState('');
  const [inputDateForWeek, setInputDateForWeek] = useState('');
  const [activeDate, setActiveDate] = useState(null);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    let date = new Date();
    setCurDate(date);
    let year = date.getFullYear();
    let month = date.getMonth();
    let curDeets = [];
    curDeets.push(month);
    curDeets.push(year);
    setCurDet(curDeets);
    displayCalendarView(year, month);
  }, []);

  useEffect(() => {
    if (activeDate) {
      let year = activeDate.getFullYear();
      let month = activeDate.getMonth();
      displayCalendarView(year, month);
    }
  }, [activeDate]);

  // display monthly calendar view according to year and month
  const displayCalendarView = (year, month) => {
    let noOfDays = 32 - new Date(year, month, 32).getDate();
    var firstDay = new Date(year, month, 1).getDay();
    var counter = 1;
    var calendar = [];
    calendar[0] = weekDays;
    for (var row = 1; row < 7; row++) {
      calendar[row] = [];
      for (var col = 0; col < 7; col++) {
        calendar[row][col] = -1;
        if (row === 1 && col >= firstDay) {
          calendar[row][col] = counter++;
        } else if (row > 1 && counter <= noOfDays) {
          calendar[row][col] = counter++;
        }
      }
    }
    displayDates(calendar);
  };

  // creating dates according to the no of days in the month
  const displayDates = calendar => {
    var rows = [];
    rows = calendar.map((row, rowIndex) => {
      var rowItems = row.map((item, colIndex) => {
        return (
          <Text
            style={{
              flex: 1,
              height: 20,
              textAlign: 'center',
              backgroundColor: rowIndex == 0 ? 'rgba(255,149,116,255)' : '#fff',
              color: colIndex == 0 ? '#a00' : '#000',
              fontWeight: item === curDate.getDate() ? 'bold' : '',
              backgroundColor:
                (item === curDate.getDate() &&
                  curDate.getMonth() === curDet[0]) ||
                item === activeDate?.getDate()
                  ? 'rgba(255,149,116,255)'
                  : '#fff',
              borderRadius: 25,
              fontSize: 17,
            }}>
            {item != -1 ? item : ''}
          </Text>
        );
      });
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: 15,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          {rowItems}
        </View>
      );
    });
    setCal(rows);
  };

  // check if user has entered a valid date or not
  const isDateValidated = (year, month, day, noOfDays) => {
    if (
      year.length === 4 &&
      month.length === 2 &&
      parseInt(month) >= 0 &&
      parseInt(month) < 12 &&
      day.length === 2 &&
      parseInt(day) > 0 &&
      parseInt(day) <= noOfDays
    ) {
      return true;
    }
    return false;
  };

  // search for a particular date
  const searchDate = () => {
    let dateArr = inputDate.split('-');
    let month = dateArr[1];
    let year = dateArr[0];
    let date = dateArr[2];
    let noOfDays = 32 - new Date(year, month, 32).getDate();
    if (isDateValidated(year, month, date, noOfDays)) {
      let upadtedDeets = [];
      upadtedDeets.push(parseInt(month) - 1);
      upadtedDeets.push(year);
      setCurDet(upadtedDeets);
      setActiveDate(new Date(inputDate));
    } else {
      Alert.alert('Invalid date format. Please enter in YYYT-MM-DD format');
    }
  };

  // search for the week according to the input date
  const searchWeek = () => {
    let dateArr = inputDateForWeek.split('-');
    let month = dateArr[1];
    let year = dateArr[0];
    let date = dateArr[2];
    let noOfDays = 32 - new Date(year, month, 32).getDate();
    if (isDateValidated(year, month, date, noOfDays)) {
      let upadtedDeets = [];
      upadtedDeets.push(parseInt(month) - 1);
      upadtedDeets.push(year);
      setCurDet(upadtedDeets);
      searchWeekByDate(new Date(inputDateForWeek));
    } else {
      Alert.alert('Invalid date format. Please enter in YYYY-MM-DD format');
    }
  };

  // getting all the dates that comprise in the week of the date entered by the user
  const searchWeekByDate = date => {
    let upadtedDeets = [];
    upadtedDeets.push(date.getMonth());
    upadtedDeets.push(date.getFullYear());
    setCurDet(upadtedDeets);
    var firstSunday = new Date(date.setDate(date.getDate() - date.getDay())),
      weekArray = [new Date(firstSunday).getDate()];
    while (
      firstSunday.setDate(firstSunday.getDate() + 1) &&
      firstSunday.getDay() !== 0
    ) {
      weekArray.push(new Date(firstSunday).getDate());
    }
    displayWeek(weekArray);
  };

  const displayWeek = weekArray => {
    var calendar = [];
    calendar[0] = weekDays;
    calendar[1] = weekArray;
    displayDates(calendar);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Enter a date in YYYY-MM-DD format"
          placeholderTextColor="gray"
          onChangeText={text => setInputDate(text)}
          style={styles.searchTextInput}
        />
        <TouchableOpacity onPress={() => searchDate()}>
          <Image
            source={require('./assets/search.png')}
            resizeMode="contain"
            style={{height: 45}}
          />
          {/* <Text>Search</Text> */}
        </TouchableOpacity>
      </View>
      {curDet && (
        <Text style={styles.heading}>
          {months[curDet[0]] + ' ' + curDet[1]}{' '}
        </Text>
      )}
      <View style={styles.calendarView}>
        <View style={styles.arrow}>
          <TouchableOpacity
            onPress={() => {
              displayCalendarView(curDet[1] - 1, curDet[0]);
              let upadtedDeets = [];
              upadtedDeets.push(curDet[0]);
              upadtedDeets.push(curDet[1] - 1);
              setCurDet(upadtedDeets);
            }}>
            {/* <Text>Prev Year</Text> */}
            <Image
              source={require('./assets/dLeft.png')}
              resizeMode="contain"
              style={styles.arrowLeft}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              let prev = curDet[0] - 1;
              let year = curDet[1];
              if (prev < 0) {
                prev = 11;
                year--;
              }
              displayCalendarView(year, prev);
              let upadtedDeets = [];
              upadtedDeets.push(prev);
              upadtedDeets.push(year);
              setCurDet(upadtedDeets);
            }}>
            {/* <Text>Prev Month</Text> */}
            <Image
              source={require('./assets/left.png')}
              resizeMode="contain"
              style={styles.arrowLeft}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.arrow}>
          <TouchableOpacity
            onPress={() => {
              let next = curDet[0] + 1;
              let year = curDet[1];
              if (next > 11) {
                next = 0;
                year++;
              }
              displayCalendarView(year, next);
              let upadtedDeets = [];
              upadtedDeets.push(next);
              upadtedDeets.push(year);
              setCurDet(upadtedDeets);
            }}>
            {/* <Text>Next Month</Text> */}
            <Image
              source={require('./assets/left.png')}
              resizeMode="contain"
              style={styles.rotated}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              displayCalendarView(curDet[1] + 1, curDet[0]);
              let upadtedDeets = [];
              upadtedDeets.push(curDet[0]);
              upadtedDeets.push(curDet[1] + 1);
              setCurDet(upadtedDeets);
            }}>
            {/* <Text>Next Year</Text> */}
            <Image
              source={require('./assets/dLeft.png')}
              resizeMode="contain"
              style={styles.rotated}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View styel={styles.calendar}>{cal}</View>

      <View style={styles.getWeek}>
        <TextInput
          placeholder="Enter a date in YYYY-MM-DD format to get week"
          placeholderTextColor="gray"
          style={styles.textInput}
          onChangeText={text => setInputDateForWeek(text)}
        />
        <TouchableOpacity onPress={() => searchWeek()} style={styles.btn}>
          <Text>Get Week</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: 'white', height: '100%', padding: '5%'},
  searchContainer: {
    borderRadius: 25,
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    paddingHorizontal: '3%',
    marginVertical: '5%',
    alignSelf: 'center',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: '5%',
    textAlign: 'center',
  },
  searchTextInput: {color: 'black'},
  calendarView: {flexDirection: 'row', justifyContent: 'space-between'},
  arrow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '10%',
  },
  rotated: {height: 30, width: 25, transform: [{rotate: '180deg'}]},
  arrowLeft: {height: 30, width: 25},
  calendar: {flex: 1},
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 25,
    width: '95%',
    color: 'black',
    alignSelf: 'center',
    marginVertical: '5%',
  },
  btn: {
    backgroundColor: 'rgba(255,149,116,255)',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    width: '40%',
    alignSelf: 'center',
  },
});

export default Calendar;
