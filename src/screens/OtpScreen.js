import React, { useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Dimensions, 
    KeyboardAvoidingView, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator,
    Image,
} from "react-native";
import AsyncStorage  from "@react-native-async-storage/async-storage";
import OTPInputView from '@twotalltotems/react-native-otp-input';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { StackActions } from "@react-navigation/native";
import axios from "axios";

import { API_USER, API_VENDOR } from "../../config";

const { height, width } = Dimensions.get("window");

export default function OtpVerify({route,navigation}){

    const prevData = route.params;
    const fNumber = prevData.number.split("",6);
    let phNum = Number(prevData.number);
    const [num, setNum] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resend, setResend] = useState(false);

    let postData={
        "phoneNo" : phNum,
        "otp": num
    };

    const submit=()=>{
        setLoading(true);
        if(prevData.user === "user"){
            axios.post(`${API_USER}/register/verify`,postData)
            .then(async res => {
                // console.log(res.data);
                setError(false);
                setLoading(false);
                console.log("OTP verified");
                try{
                    const jsonValue = JSON.stringify(res.data);
                    await AsyncStorage.setItem("jwt",jsonValue);
                    await AsyncStorage.setItem("userRole","0");
                    navigation.dispatch(
                        StackActions.replace('UserPanel')
                    )
                }
                catch(e){
                    console.log(e);
                }
            })
            .catch(err=>{
                setError(true);
                setLoading(false);
                console.log(err);
            })
        }
        else if(prevData.user === "vendor"){
            axios.post(`${API_VENDOR}/register/verify`,postData)
            .then(async res => {
                setError(false);
                setLoading(false);
                console.log("OTP verified");
                try{
                    const jsonValue = JSON.stringify(res.data);
                    await AsyncStorage.setItem("jwt",jsonValue);
                    await AsyncStorage.setItem("userRole","1");
                    navigation.navigate("VendorPanel");
                }
                catch(e){
                    console.log(e);
                }
            })
            .catch(err=>{
                setError(true);
                setLoading(false);
                console.log(err);
            })
        }
    };
    const resendOTP=()=>{
        setResend(true);
        if(prevData.user === "user"){
            axios.post(`${API_USER}/register`,{"phoneNo":phNum})
            .then(res=>{
                if(res.status === 200){
                    setError(false);
                    setResend(false);
                    console.log("OTP resend");
                }
                else {
                    // setError(true);
                    setResend(false);
                    console.log(res.status);
                }
            })
            .catch(err=>{
                setResend(false);
                console.log(err);
            })
        }
        else if(prevData.user === "vendor"){
            axios.post(`${API_VENDOR}/register`,{"phoneNo":phNum})
            .then(res=>{
                if(res.status === 200){
                    setError(false);
                    setResend(false);
                    console.log("OTP resend");
                }
                else {
                    // setError(true);
                    setResend(false);
                    console.log(res.status);
                }
            })
            .catch(err=>{
                setResend(false);
                console.log(err);
            })
        }
    };

    return(
        <View style={styles.container}>
            <View style={styles.heading}>
                <Image style={{height:"30%",resizeMode:"contain"}} source={require("../assets/logo.png")} />
                
            </View>
            <View style={styles.modal}>
                <ScrollView style={{marginTop: 20, marginHorizontal: 30}}>
                    <Text style={{color:"#000",fontSize:22,marginBottom:20}}>Sign In</Text>
                    <Text style={{color:"#000",fontSize:14,marginBottom:10}}>Enter your code</Text>
                    <Text style={{color:"#000",fontSize:12}}>Please enter the 4-digit verification code sent</Text>
                    <Text style={{color:"#000",fontSize:12}}>to +91 {fNumber}****</Text>
                    <KeyboardAvoidingView style={styles.textInputDiv}>
                        <OTPInputView
                            style={styles.input}
                            pinCount={4}
                            code={num}
                            onCodeChanged={(code)=>setNum(code)}
                            autoFocusOnLoad={false}
                            codeInputFieldStyle={styles.underlineStyleBase}
                            codeInputHighlightStyle={styles.underlineStyleHighLighted}
                            onCodeFilled = {(code) => setNum(code)}
                        />                       
                        {
                            error ? <Text style={{color:"red",fontSize:12,marginTop:10}}>Invalid OTP</Text> : null
                        }                       
                    </KeyboardAvoidingView>
                    <TouchableOpacity 
                        style={styles.otp} 
                        activeOpacity={0.6}
                        onPress={submit} 
                        disabled={num.length !==4 ? true : false}
                    >
                        {
                            loading ? <ActivityIndicator /> : <Text style={{color:"#fff",fontWeight:"800"}}>Continue</Text>
                        }
                    </TouchableOpacity>
                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color:"blue",marginRight:5}} onPress={resendOTP}>Resend</Text>
                        {
                            resend ? <ActivityIndicator /> : <SimpleLineIcons name="reload" color="blue" size={18} />
                        }
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    heading: {
        marginTop: height/6,
        height: height/4,
        alignItems:"center"
    },
    modal: {
        flex: 1,
        backgroundColor: "#f0f0f3",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    textInputDiv: {
        alignItems:"center",
        marginVertical: 20,
        // backgroundColor:"#fff"
    },
    textInput: {
        height: 60,
        color: "#000",
        paddingLeft: 15,
        width: "80%"
    },
    otp: {
        borderRadius: 10,
        backgroundColor: "#05e4ae",
        elevation: 5,
        marginHorizontal: width/6,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        marginVertical: 20
    },
    underlineStyleBase: {
        width: 57,
        height: 50,
        elevation: 5,
        backgroundColor: "#fff",
        color: "#000",
        borderRadius: 10

    },
    input: {
        width: "80%",
        height: 50
    }
})