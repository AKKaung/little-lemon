import React, {  } from 'react';
import { StyleSheet } from 'react-native';
import AuthProvider from './provider/AuthProvider';
import MainApp from './screens/MainApp';

const App = () => {
  return (
    <AuthProvider>
      <MainApp/>
    </AuthProvider>
  );
}

export default App;
