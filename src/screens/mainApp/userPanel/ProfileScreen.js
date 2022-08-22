import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    Dimensions, 
    Image,
    Alert,
    Share
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, useIsFocused } from "@react-navigation/native";
import dynamicLinks from '@react-native-firebase/dynamic-links';
import axios from "axios";

import { API, API_USER } from "../../../../config";
import ProfileHeader from "./utils/ProfileHeader";


const { height, width } = Dimensions.get("window");

export default function ProfileScreen({navigation}){

    const [phoneNo, setPhoneNo] = useState();
    const [img, setImg] = useState("");
    const [name, setName] = useState("");
    const isFocused = useIsFocused();
    
    // const link = "link/will/be/here";

    useEffect(()=>{
        if(isFocused){
            getUser();
        };
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
        return unsubscribe();
    },[isFocused]);

    
    const handleDynamicLink = link => {
        if(link){
            console.log("OK");
        }
        else{
            console.log("NOT OK");
        }
    };

    const logOut_alert=()=>{
        Alert.alert(
            "Logging Out",
            "Are you sure?",
            [
                {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
                },
                { text: "OK", onPress: logOut }
            ]
        )
    };

    const logOut=async()=> {
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsed = JSON.parse(json_Val);
        let axiosConfig = {
            headers:{
                Authorization: parsed.token
            }
        };
        axios.get(`${API_USER}/logout`,axiosConfig)
        .then(async res=>{   
            try{
                await AsyncStorage.removeItem("jwt");
                navigation.dispatch(
                    StackActions.replace('SignIn')
                )
            }
            catch(e){
                console.log("logout error: ",e);
            } 
        })
    };

    const getUser=async()=>{
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsed = JSON.parse(json_Val);
        let axiosConfig = {
            headers:{
                Authorization: parsed.token
            }
        };
        axios.get(`${API_USER}/userdetail`,axiosConfig)
        .then(res=>{
            // console.log("user",res.data);
            setPhoneNo(res.data.phoneNo);
            setName(res.data.name);
            setImg(res.data.profileImg);
            // setAddress(res.data.address);
        })
        .catch(err=>{
            console.log(err);
        })
    };

    const onShare = async () => {
        try {
          const result = await Share.share({
            message: link,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
    };

    return(
        <View style={styles.container}>
            <ProfileHeader 
                nav={()=>navigation.navigate("Alert")}
            />
            <View style={styles.body}>
                <View style={styles.bgCard}>
                    <Image style={styles.img} 
                        source={img ==="" || img === undefined || img === null ? require("../../../assets/profile.png") : {uri: img}}
                    />
                    <View style={styles.texts}>
                        {
                            name === "" || name === undefined ? null : <Text style={{color:"#000",fontWeight:"500"}}>{name}</Text>
                        }
                        <Text style={{color:"#000",fontSize: 12}}>+91 {phoneNo}</Text>
                    </View>
                </View>
                <Text style={{marginLeft:25,marginTop:20,color:"#000",marginBottom:5}}>Account</Text>

                <TouchableOpacity 
                    style={styles.smCard}
                   onPress={()=>navigation.navigate('MyCart')}
                    activeOpacity={0.8}
                >
                    <View style={{flexDirection:"row",alignItems:"center",marginLeft:20}}>
                        <Ionicons name="cart" color="#000" size={18} />
                        <Text style={{color:"#000",marginLeft: 20}}>My Cart</Text>
                    </View>
                    <AntDesign name="right" color="#000" size={18} style={{marginRight: 20}} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.smCard}
                   onPress={()=>navigation.navigate('MyCartService')}
                    activeOpacity={0.8}
                >
                    <View style={{flexDirection:"row",alignItems:"center",marginLeft:20}}>
                        <Ionicons name="cart" color="#000" size={18} />
                        <Text style={{color:"#000",marginLeft: 20}}>My Cart Service</Text>
                    </View>
                    <AntDesign name="right" color="#000" size={18} style={{marginRight: 20}} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.smCard}
                    onPress={()=>navigation.navigate("EditProfile")}
                    activeOpacity={0.8}
                >
                    <View style={{flexDirection:"row",alignItems:"center",marginLeft:20}}>
                        <Ionicons name="person-outline" color="#000" size={18} />
                        <Text style={{color:"#000",marginLeft: 20}}>Edit Profile</Text>
                    </View>
                    <AntDesign name="right" color="#000" size={18} style={{marginRight: 20}} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.smCard}
                    activeOpacity={0.8}
                    onPress={()=>navigation.navigate("WishList")}
                >
                    <View style={{flexDirection:"row",alignItems:"center",marginLeft:20}}>
                        <Entypo name="list" color="#000" size={18} />
                        <Text style={{color:"#000",marginLeft: 20}}>Wishlist</Text>
                    </View>
                    <AntDesign name="right" color="#000" size={18} style={{marginRight: 20}} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.smCard}
                    onPress={onShare}
                    activeOpacity={0.8}
                >
                    <View style={{flexDirection:"row",alignItems:"center",marginLeft:20}}>
                        <AntDesign name="sharealt" color="#000" size={18}/>
                        <Text style={{color:"#000",marginLeft: 20}}>Share</Text>
                    </View>
                    <AntDesign name="right" color="#000" size={18} style={{marginRight: 20}} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.smCard}
                    activeOpacity={0.8}
                    onPress={logOut_alert}
                >
                    <View style={{flexDirection:"row",alignItems:"center",marginLeft:20}}>
                        <MaterialIcons name="logout" color="#000" size={20}/>
                        <Text style={{color:"#000",marginLeft: 20}}>Logout</Text>
                    </View>
                    <AntDesign name="right" color="#000" size={18} style={{marginRight: 20}} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f3"
    },
    header: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor:'#f0f0f3'
    },
    headerSub: {
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginTop:40
    },
    round: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f008",
        height: 40,
        width: 40,
        borderRadius: 40/2,
        marginLeft: 10
    },
    body: {
        backgroundColor:"#fff",
        flex:1,
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
    },
    bgCard: {
        marginHorizontal: 20,
        elevation: 5,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
        borderRadius: 10
    },
    img: {
        height: 60,
        width: 60,
        borderRadius: 60/2,
        // backgroundColor: "#ffe4e1",
        marginVertical: 10,
        marginHorizontal: 10
    },
    texts: {
        marginLeft: 10
    },
    smCard: {
        elevation: 5,
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 10,
        flexDirection: "row",
        alignItems:"center",
        justifyContent: "space-between",
        height: 40,
        borderRadius: 10
    }
})