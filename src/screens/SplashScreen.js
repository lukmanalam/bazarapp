import React from "react";
import { View, StyleSheet, Animated } from "react-native";


export default function SplashScreen(){

    //initial opacity
    let fadeValue = new Animated.Value(0);

    // starting animation by updating opacity in 5 sec
    Animated.timing(fadeValue,{
        toValue: 1,
        duration: 3500,
        useNativeDriver: false
    }).start();         // important for starting the animation

    return(
        <View style={styles.container}>
            <Animated.Image 
                style={[styles.img,{opacity: fadeValue}]}
                source={require("../assets/logo.png")}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#ffe4e1",
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },
    img: {
        height: "30%",
        width: "30%"
    }
});