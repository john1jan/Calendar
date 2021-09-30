import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import Calendar from './src/Calendar';

const App = () => {
  return (
    <SafeAreaView>
      <StatusBar />
      <Calendar />
    </SafeAreaView>
  );
};

export default App;
