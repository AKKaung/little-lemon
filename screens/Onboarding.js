import React, { useContext, useEffect, useState } from "react";
import { ValidateEmail } from "../utils/ValidateEmail";
import AuthContext from '../AuthContext';
import { useNavigation } from "@react-navigation/native";

import {
    Text,
    Image,
    View,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Pressable,
    StyleSheet,
    ScrollView
} from "react-native";
import { style } from "deprecated-react-native-prop-types/DeprecatedViewPropTypes";

const Onboarding = () => {
    const navigation = useNavigation();
    // const route = useRoute();
    const { login, user, isLoggedIn } = useContext(AuthContext);
    // console.log("context login value ", user);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const [isFirstNameValid, setIsFirstNameValid] = useState(false);
    const [isLastNameValid, setIsLastNameValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isLog, setIsLog] = useState(false);

    const handleFirstNameValid = (input) => {
        setFirstName(input);
        if (input.length > 0) {
            setIsFirstNameValid(true);
        } else {
            setIsFirstNameValid(false);
        }
    };

    const handleLastNameValid = (input) => {
        setLastName(input);
        if (input.length > 0) {
            setIsLastNameValid(true);
        } else {
            setIsLastNameValid(false);
        }
    };

    const handleEmailChange = (input) => {
        setEmail(input);
        if (input != '' && ValidateEmail(input)) {
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
        }
    };

    const handleLogin = (userData) => {
        console.log(`LogIn Click -------${userData}`);
        login(userData);
    };

    useEffect(() => {
        if (user != null && isLoggedIn) {
            console.log("NOOOOOOOO", user);
            navigation.navigate('Profile', user);
        }
    }, [user, isLoggedIn]);

    console.log('Render........+++++++++++++');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ScrollView keyboardDismissMode="on-drag" >
                <>
                    <View style={styles.headerSection}>
                        <Text style={styles.headerTitle}>Little Lemon</Text>
                        <Text style={styles.headerDescription}>Chicago</Text>
                        <View style={styles.headerBodySection}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.headerBody}>We are a family owned Mediterranean restaurant,
                                    focused on traditional recipes served with a modern twist.</Text>
                            </View>
                            <Image
                                style={styles.headerSectionImage}
                                source={require('../img/hero_image.png')} />
                        </View>
                    </View>
                    <View style={{ padding: 10 }} >
                        <Text style={styles.inputLabel}>First Name*</Text>
                        <TextInput style={styles.input}
                            // placeholder='Your First Name'
                            value={firstName}
                            onChangeText={handleFirstNameValid}
                            clearButtonMode="always" />

                        <Text style={styles.inputLabel}>Last Name*</Text>
                        <TextInput style={styles.input}
                            // placeholder='Your Last Name'
                            value={lastName}
                            onChangeText={handleLastNameValid}
                            clearButtonMode="always" />

                        <Text style={styles.inputLabel}>Email*</Text>
                        <TextInput style={styles.input}
                            // placeholder='Your Email'
                            value={email}
                            onChangeText={handleEmailChange}
                            keyboardType='email-address'
                            clearButtonMode="always" />
                    </View>
                </>

                <Pressable
                    // style={[styles.subscribeBtn, !isEmailValid && styles.subscribeBtnDisable]}
                    style={[
                        styles.subscribeBtn,
                        isFirstNameValid && isEmailValid && styles.subscribeBtn, // Apply greenButton style if both values are true
                        (!isFirstNameValid || !isEmailValid) && styles.subscribeBtnDisable, // Apply redButton style if either of the values is false
                    ]}
                    onPress={() => {
                        if (firstName != '' && lastName != '' && email != '' && ValidateEmail(email)) {
                            // Alert.alert('You are successfully login...');
                            const userData = {
                                avatar: '',
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                phoneNumber: '',
                                notification: {}
                                // Add other user data as needed
                            };
                            // console.log('Navigating to Profile with params:', userData);
                            handleLogin(userData);
                            // login(userData);
                            // navigation.replace('Profile', { screen: 'Aung'});

                        } else {
                            Alert.alert('You must log in first!');
                        }


                    }}>
                    {/* <Text style={styles.btnText}>{!isFirstNameValid || !isEmailValid ? "Next" : "Login"}</Text> */}
                    <Text style={styles.btnText}>{"Login"}</Text>
                </Pressable>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerSection: {
        height: 'auto',
        backgroundColor: '#495E57',
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 30,
    },
    headerBodySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 0,
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 30,
        fontStyle: 'normal',
        color: '#F4CE14',
        letterSpacing: 2,
    },
    headerDescription: {
        fontWeight: 'normal',
        fontSize: 24,
        fontStyle: 'normal',
        color: '#fff',
    },
    headerBody: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'auto',
        lineHeight: 26,
    },
    headerSectionImage: {
        width: 130,
        height: 150,
        backgroundColor: '#f0efef',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: 20,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 28,
        color: '#474F7A',
        textAlign: 'center',
        marginVertical: 50,
        margin: 0,
    },
    inputLabel: {
        fontSize: 18,
        marginLeft: 20,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderWidth: 0.3,
        padding: 10,
        fontSize: 16,
        borderColor: '#000',
        backgroundColor: 'white',
        marginBottom: 20,
        borderRadius: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    subscribeBtnDisable: {
        backgroundColor: 'gray',
        opacity: 0.5,
        borderRadius: 10,
        paddingStart: 50,
        paddingEnd: 50,
        marginEnd: 50,
        marginVertical: 0,
        alignSelf: "flex-end",
        margin: 20,
    },
    subscribeBtn: {
        backgroundColor: '#495E57',
        borderRadius: 10,
        padding: 10,
        paddingStart: 50,
        paddingEnd: 50,
        marginEnd: 50,
        marginVertical: 0,
        alignSelf: "flex-end",
        margin: 20,
    },
    btnText: {
        color: '#fff',
        textAlign: "center",
    },
    onboardLogo: {
        width: 140,
        height: 140,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 100,
        marginBottom: 30,
    }
});

export default Onboarding;