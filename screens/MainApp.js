import React, { useContext } from "react"
import AuthContext from "../AuthContext"
import { NavigationContainer, useNavigation } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding from "./Onboarding";
import Profile from "./Profile";
import Splash from "./Splash";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import Home from "./Home";

const Stack = createNativeStackNavigator();

export default MainApp = () => {
  const { user, isLoading, isLoggedIn } = useContext(AuthContext);
  console.log(`Loading : ${isLoading} and Login : ${isLoggedIn} and User : ${JSON.stringify(user)}`);

  // Render different screens based on onboarding status and loading state
  if (isLoading) {
    // Still loading from AsyncStorage, show Splash Screen
    return <Splash style={styles.container} />;
  }

  const LogoTitle = () => {
    return (
      <>
        <Image style={styles.logo} source={require('../img/littleLemonLogo.png')} />
      </>
    );
  };

  const UserAvator = () => {
    const navigation = useNavigation();

    const renderUserAvator = () => {
      if (user.avatar === '') {
        // Display initials placeholder
        const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
        return (
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: 'white' }}>{initials}</Text>
          </View>
        );
      } else {
        // Display the selected image
        return (
          <Image source={{ uri: user.avatar }} style={{ width: 34, height: 34, borderRadius: 17 }} />
        );
      }
    };

    return (
      <View style={styles.header}>
        <Image style={styles.logo} source={require('../img/littleLemonLogo.png')} />
        <Pressable onPress={() => { navigation.navigate('Profile') }}>
          {renderUserAvator()}
        </Pressable>
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          // Onboarding completed, user is signed in
          <>
            <Stack.Screen
              name='Home'
              component={Home}
              options={
                {
                  title: '',
                  headerTitle: (props) => <UserAvator {...props} />,
                }
              } />
            <Stack.Screen
              name='Profile'
              component={Profile}
              options={
                {
                  title: '',
                  headerTitle: () => <LogoTitle />,
                }
              } />
          </>
        ) : (
          // User is NOT signed in
          <Stack.Screen
            name='Onboarding'
            component={Onboarding}
            options={
              {
                title: '',
                headerTitle: () => <LogoTitle />,
              }
            } />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    height: 35,
    width: 300,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});