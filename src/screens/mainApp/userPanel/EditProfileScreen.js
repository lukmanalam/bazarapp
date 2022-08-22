import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    Alert,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import storage from '@react-native-firebase/storage';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API, API_USER } from "../../../../config";


export default function EditProfile({navigation}){


    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [img, setImg] = useState("");
    const [isUpdated, setIsUpdated] = useState(false);
    const [indicator, setIndicator] = useState(false);
    const [indicator2, setIndicator2] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [process, setProcess] = useState("");
    const [url, setUrl] = useState("");

    useEffect(()=>{
        getUser();
    },[]);

    const openCamera=async()=>{
        const options = {
            storageOptions: {
                path: 'images',
                mediaType: 'photo'
            },
            includeBase64: true
        };
        // let isCameraPermitted = await requestCameraPermission();
        // let isStoragePermitted = await requestLibraryPermission();

        // if(isCameraPermitted && isStoragePermitted){
            launchCamera(options, resp => {
                if(resp.didCancel){
                    console.log("Canceled");
                    setIsVisible(false);
                }
                else if(resp.error){
                    console.log("Error: ", resp.error);
                    setIsVisible(false);
                }
                else{
                    const imgData = resp.assets[0];
                    setIndicator2(true);
                    setIsUploaded(false);
                    try{
                        const task = storage()
                        .ref("USER/profile_image/"+ imgData.fileName)
                        .putString(imgData.base64,"base64");
                        task.on('state_changed',
                            function(snapshot){
                                const rate = Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100);
                                // setProcess(`${rate}%`);
                                console.log(rate);
                            },
                            function(err){
                                console.log(err);
                            },
                            function(){
                                task.snapshot.ref.getDownloadURL().then(function(url){
                                    setUrl(url);
                                })
                            }
                        );                  
                        task.then(() => {
                            console.log('PDF uploaded to the bucket!');
                            setIndicator2(false);
                            setIsUploaded(true);
                        });               
                    }
                    catch(e){
                        console.log(e);
                    }
                    setIsVisible(false);
                }
            })
        // }
    };
    const openLibrary=async()=>{
        const options = {
            storageOptions: {
                path: 'images',
                mediaType: 'photo'
            },
            includeBase64: true
        };
        // let isCameraPermitted = await requestCameraPermission();
        // let isStoragePermitted = await requestLibraryPermission();

        // if(isCameraPermitted && isStoragePermitted){
            launchImageLibrary(options, resp => {
                if(resp.didCancel){
                    console.log("Canceled");
                    setIsVisible(false);
                }
                else if(resp.error){
                    console.log("Error: ", resp.error);
                    setIsVisible(false);
                }
                else{
                    const imgData = resp.assets[0];
                    setIndicator2(true);
                    setIsUploaded(false);
                    try{
                        const task = storage()
                        .ref("USER/profile_image/"+ imgData.fileName)
                        .putString(imgData.base64,"base64");
                        task.on('state_changed',
                            function(snapshot){
                                const rate = Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100);
                                // setProcess(`${rate}%`);
                                console.log(rate);
                            },
                            function(err){
                                console.log(err);
                            },
                            function(){
                                task.snapshot.ref.getDownloadURL().then(function(url){
                                    setUrl(url);
                                })
                            }
                        );                  
                        task.then(() => {
                            console.log('PDF uploaded to the bucket!');
                            setIndicator2(false);
                            setIsUploaded(true);
                        });               
                    }
                    catch(e){
                        console.log(e);
                    }
                    setIsVisible(false);
                }
            })
        // }
    };

    const upload=()=>(
        <View style={styles.alertContainer}>
            <View style={styles.alertBox}>
                <Text style={styles.select}>Select Photo...</Text>
                <View style={styles.line} />
                <View style={{alignItems:"center",marginTop:20}}>
                    <TouchableOpacity style={styles.content}
                        onPress={openCamera}
                    >
                        <Text style={{color:"#fff"}}>launch camera</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginVertical:8}} />
                <View style={{alignItems:"center"}}>
                    <TouchableOpacity style={styles.content}
                        onPress={openLibrary}
                    >
                        <Text style={{color:"#fff"}}>select from storage</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.lastView}>
                    <TouchableOpacity style={styles.cancel}
                        onPress={()=>setIsVisible(false)}
                    >
                        <Text style={{color:"#fff"}}>cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

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
            setPhoneNo(res.data.phoneNo);
            setName(res.data.name);
            setUrl(res.data.profileImg);
            setAddress(res.data.address);
            setEmail(res.data.email);
            setLoading(false);
        })
        .catch(err=>{
            console.log(err);
            setLoading(false);
        })
    };

    const update_alert=()=>{
        Alert.alert(
            "Update your profile",
            "Are you sure?",
            [
                {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
                },
                { text: "OK", onPress: update }
            ]
        )
    };

    let updateData={
        "name": name,
        "phoneNo": phoneNo,
        "address": address,
        "profileImg": url,
        "email": email
    };

    const update=async()=>{
        setIndicator(true);
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsed = JSON.parse(json_Val);
        let axiosConfig = {
          headers:{
            Authorization: parsed.token
          }
        };
        axios.patch(`${API_USER}/updateuser`,updateData,axiosConfig)
        .then(res=>{
            setIndicator(false);
            setIsUpdated(true);
        })
        .catch(err=>{
            console.log(err);
            setIndicator(false);
        })
    };

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <AntDesign name="left" color="#000" size={24} onPress={()=>navigation.goBack()} />
                <Text style={{color:"#000",marginLeft:10,fontSize:16,fontWeight:"500"}}>Account</Text>
            </View>
            <ScrollView style={styles.body}>
                {loading ? 
                <View 
                style={{
                    marginTop: 100,
                }}>
                    <ActivityIndicator size={40} />
                </View>
                :
                <View style={{marginHorizontal:20,marginVertical:20}}>
                    <View style={styles.bodyTitle}>
                        <Text style={{color:"#000"}}>Edit Profile</Text>
                        <Text style={{color:"#05e4ae",fontWeight:"500"}} onPress={update_alert}>Update</Text>
                    </View>
                    <View style={styles.imgView}>
                        <Image style={{height:100,width:100,borderRadius:50,backgroundColor:"#ffe4e1"}} 
                            source={(url ==="" || url === undefined || url === null) ? require("../../../assets/profile.png") : {uri: url}}
                        />
                        <View style={{marginTop:10}}>
                            {
                            indicator2 ? <ActivityIndicator /> : isUploaded ? <Text style={{color:"green",fontSize:10}}>uploaded</Text> : null
                            }
                        </View>
                        <Text style={{color:"#000",fontSize:12,marginTop:10}}
                            onPress={()=>setIsVisible(true)}
                        >+ Update Profile Picture</Text>
                        <View style={styles.stLine} />
                    </View>
                    <View style={styles.smCard}>
                        <TextInput 
                            style={{
                                width:"100%",borderRadius: 10,
                                paddingLeft:20,color:"#000"
                            }}
                            placeholder={name==="" || name===undefined ? "Name" : name}
                            placeholderTextColor="gray"
                            autoCorrect={false}
                            value={name}
                            onChangeText={(val)=>setName(val)}
                        />
                    </View>
                    <View style={styles.smCard1}>
                        <Text style={{color:"#000",marginLeft:20}}>+91</Text>
                        <Text style={{color:"#000",marginLeft:10}}>{phoneNo}</Text>
                    </View>
                    <View style={styles.smCard}>
                        <TextInput 
                            style={{
                                width:"100%",borderRadius: 10,
                                paddingLeft:20,color:"#000"
                            }}
                            placeholder={email==="" || email===undefined ? "Enter email..." : email}
                            placeholderTextColor="gray"
                            autoCorrect={false}
                            value={email}
                            onChangeText={(val)=>setEmail(val)}
                        />
                    </View>
                    <View style={styles.desCard}>
                        <TextInput 
                            style={{
                                textAlignVertical:"top",width:"100%",color:"#000",
                                height:"100%",paddingLeft:20,borderRadius: 10
                            }}
                            placeholder={address==="" || address===undefined ? "Address" : address}
                            placeholderTextColor="gray"
                            multiline={true}
                            value={address}
                            onChangeText={(val)=>setAddress(val)}
                        />
                    </View>
                    <View style={{marginTop:20,alignItems:"center"}}>
                    {
                        indicator ? <ActivityIndicator size={30} color="#f008" /> : isUpdated ? 
                        <Text style={{color:"green",fontSize:12}}>Updated sucessfully</Text> : null
                    }
                    </View>
                </View>}
            </ScrollView>
            {isVisible && upload()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f3"
    },
    header: {
        flexDirection:"row",
        alignItems:"center",
        marginLeft: 20,
        marginTop: 40
    },
    body: {
        marginTop: 20,
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor:"#fff"
    },
    bodyTitle: {
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },
    imgView: {
        alignItems: "center",
        marginTop:20
    },
    stLine: {
        width: 135,
        borderWidth: 0.5,
        marginLeft: 10
    },
    smCard: {
        elevation: 5,
        backgroundColor: "#fff",
        marginTop: 20,
        height: 40,
        borderRadius: 10
    },
    smCard1: {
        elevation: 5,
        backgroundColor: "#fff",
        marginTop: 10,
        flexDirection: "row",
        alignItems:"center",
        height: 40,
        borderRadius: 10
    },
    desCard: {
        elevation: 5,
        backgroundColor: "#fff",
        // marginHorizontal: 20,
        marginTop: 10,
        flexDirection: "row",
        alignItems:"center",
        height: 100,
        borderRadius: 10
    },
    alertContainer: {
        backgroundColor:"rgba(0,0,0,0.7)",
        position:"absolute",
        right:0,
        left:0,
        top:0,
        bottom:0,
        justifyContent:"center",
        alignItems:"center"
    },
    alertBox: {
        height: "40%",
        width: "90%",
        backgroundColor:"#fff",
        borderRadius: 10,
        
    },
    cancel: {
        backgroundColor: "red",
        paddingVertical:8,
        paddingHorizontal: 15,
        borderRadius: 5
    },
    content: {
        backgroundColor:"#42b349",
        paddingHorizontal:30,
        paddingVertical:10,
        borderRadius:10
    },
    select: {
        textAlign:"center",
        fontWeight:"700",
        marginTop:10,
        color:"#000",
        fontSize:16
    },
    lastView: {
        alignItems:"center",
        justifyContent:"flex-end",
        flex:1,
        marginBottom:15
    },
    line: {
        width:"80%",
        borderWidth:0.5,
        alignSelf:"center",
        marginTop:10
    },
})