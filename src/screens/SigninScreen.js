import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Dimensions, 
    TextInput, 
    KeyboardAvoidingView, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator,
    Image
} from "react-native";
import axios from "axios";
import { API_USER, API_VENDOR } from "../../config";
import { StackActions } from "@react-navigation/native";


const { height, width } = Dimensions.get("window");

export default function SignIn({navigation,route}){

    const preData = route.params;
    const [num, setNum] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const [error2, setError2] = useState(false);
    const [loading, setLoading] = useState(false);

    const inputHandler=()=>{
        if(num==="" || num.length !== 10){
            setError(true);
        }
        else{
            setError(false);
        }
    };
    const inputHandler2=()=>{
        if(email === ""){
            setError2(true);
        }
        else{
            setError2(false);
        }
    };


    const submit=()=>{
        if(num === "" || num.length !== 10){
            setError(true)
        }
        // else if(email === ""){
        //     setError2(true)
        // }
        else{
            setLoading(true);
            if(!preData){
                let navData = {
                    "number": num,
                    "user": "user"
                };
                axios.post(`${API_USER}/register`,{"phoneNo": Number(num)})
                .then(res=>{
                    if(res.status === 200){
                        setLoading(false);
                        navigation.dispatch(
                            StackActions.replace("OtpVerify",navData)
                        )
                        // navigation.navigate("OtpVerify",navData);
                    }
                    else {
                        console.log(res.status);
                        setLoading(false);
                    }
                })
                .catch(err=>{
                    console.log(err);
                    setLoading(false);
                })
            }
            else {
                let navData = {
                    "number": num,
                    "user": "vendor"
                };
                axios.post(`${API_VENDOR}/register`,{"phoneNo": Number(num)})
                .then(res=>{
                    if(res.status === 200){
                        setLoading(false);
                        navigation.dispatch(
                            StackActions.replace("OtpVerify",navData)
                        )
                        // navigation.navigate("OtpVerify",navData);
                    }
                    else {
                        console.log(res.status);
                        setLoading(false);
                    }
                })
                .catch(err=>{
                    console.log(err);
                    setLoading(false);
                })
            }
        }
    };

    return(
        <View style={styles.container}>
            <View style={styles.heading}>
                <Image style={{height:"30%",resizeMode:"contain"}} source={require("../assets/logo.png")} />
                
            </View>
            <View style={styles.modal}>
                <ScrollView style={{marginHorizontal: 30}}contentContainerStyle={{paddingVertical:20}} >
                    <View style={{flexDirection:"row",alignItems:"center",marginBottom:20,justifyContent:"space-between"}}>
                        <Text style={{color:"#000",fontSize:22}}>Sign In</Text>
                    </View>
                    <Text style={{color:"#000",fontSize:14,marginBottom:10}}>Enter your phone number</Text>
                    <Text style={{color:"#000",fontSize:12}}>You will receive a 4-digit code for phone</Text>
                    <Text style={{color:"#000",fontSize:12}}>number verification</Text>
                    <View style={{alignItems:"center"}}>
                        <KeyboardAvoidingView style={styles.textInputDiv}>
                            <Text style={{color:"#000",marginLeft:10}}>+91</Text>
                            <TextInput style={styles.textInput} 
                                placeholder="Phone number"
                                value={num}
                                onChangeText={(val)=>setNum(val)}
                                keyboardType="number-pad"
                                placeholderTextColor="gray"
                                onBlur={inputHandler}
                                maxLength={10}
                            />
                        </KeyboardAvoidingView>
                        {error ? <Text style={{fontSize:12,color:"red",textAlign:"center"}}>please enter a valid number</Text>: null}
                        {/* <KeyboardAvoidingView style={styles.textInputDiv}>
                            <TextInput style={styles.emailInput} 
                                placeholder="Email I'd..."
                                value={email}
                                onChangeText={(val)=>setEmail(val)}
                                // keyboardType="email"
                                placeholderTextColor="gray"
                                onBlur={inputHandler2}
                            />
                        </KeyboardAvoidingView> */}
                        {/* {error2 ? <Text style={{fontSize:12,color:"red",textAlign:"center"}}>please enter a valid email id</Text>: null} */}
                    </View>
                    <TouchableOpacity 
                        style={styles.otp} 
                        activeOpacity={0.6} 
                        onPress={submit}
                        disabled={loading ? true : false}
                    >
                        {
                            loading ? <ActivityIndicator /> : <Text style={{color:"#fff",fontWeight:"800"}}>Get OTP</Text>
                        }
                    </TouchableOpacity>
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
        height: height/4.5,
        alignItems:"center"
    },
    modal: {
        flex: 1,
        backgroundColor: "#eee",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 16
    },
    textInputDiv: {
        marginHorizontal: 20,
        marginVertical: 20,
        elevation: 5,
        backgroundColor: "#fff",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        overflow:"hidden"
    },
    textInput: {
        height: 60,
        color: "#000",
        paddingLeft: 15,
        width: "80%",
    },
    emailInput: {
        height: 60,
        color: "#000",
        paddingLeft: 15,
        width: "95%",
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
    dropdownBtnStyle: {
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 5,
        marginHorizontal: 5,
        width: width/2.5,
        marginVertical: 2,
    },
    rowStyle: {
        borderRadius: 20,
    },
    error1: {
        color:"red",
        textAlign:"center",
        fontSize:12,
        top: -10
    }
})