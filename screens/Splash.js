import React from "react";
import { View, Image, StyleSheet } from "react-native";

const Splash = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image style={styles.container} source={require('../img/splash_logo.png')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        alignSelf: "center",
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    }
});

export default Splash;