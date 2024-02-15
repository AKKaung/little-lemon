import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const LogoTitle = () => {
  return (
    <Image style={headerStyles.logo} source={require('../img/littleLemonLogo.png')} />
  );
}

export default function LittleLemonHeader() {
  return (
    <View style={headerStyles.container}>
      {/* <Text style={headerStyles.subText} numberOfLines={1}>
        Little Lemon
      </Text> */}
      <LogoTitle />
    </View>
  );
}

const headerStyles = StyleSheet.create({
  // mainText: { padding: 40, fontSize: 30, color: 'black' },
  subText: {
    paddingTop: 50,
    paddingBottom: 10,
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
  logo: {
    height: 30,
    padding: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
