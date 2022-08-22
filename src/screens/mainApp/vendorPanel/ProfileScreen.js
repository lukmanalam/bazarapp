import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    Image,
    Alert,
    Share,
    ActivityIndicator,
    TextInput
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, useIsFocused } from "@react-navigation/native";
import { BottomSheet } from "react-native-btr";
import axios from "axios";

import { API, API_VENDOR } from "../../../../config";
import ProfileHeader from "./utils/profileHeader";
import GooglePlaces from "./utils/GooglePlaces";


export default function ProfileScreen({navigation}){

    const [phoneNo, setPhoneNo] = useState();
    const [img, setImg] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState({});
    const isFocused = useIsFocused();
    const [isUpdated, setIsUpdated] = useState(false);
    const [indicator, setIndicator] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [area, setArea] = useState('');
    const [address, setAddress] = useState('');
    const [lat_long, setLat_long] = useState({});
    const [locationIndex, setLocationIndex] = useState('0');
    const [preAddress, setPreAddress] = useState('');
    const [preServicArea, setPreServiceArea] = useState(null);

    useEffect(()=>{
        if(isFocused){
            getVendor();
        }
        getLocation();
        getShareLink();
    },[isFocused]);

    const getShareLink=()=>{
        axios.get(`${API}/sharelink`)
        .then(resp=>{
            const link = (resp.data[0].link);
            global.link = link;
        })
        .catch(err=>{
            console.log("share link error:",err);
        })
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
        axios.get(`${API_VENDOR}/logout`,axiosConfig)
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
        .catch(err=>console.log(err))
    };

    const getVendor=async()=>{
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsed = JSON.parse(json_Val);
        let axiosConfig = {
            headers:{
                Authorization: parsed.token
            }
        };
        axios.get(`${API_VENDOR}/vendordetail`,axiosConfig)
        .then(async res=>{
            setPhoneNo(res.data.phoneNo);
            setName(res.data.name);
            setImg(res.data.profileImg);
            res.data.location ? setPreAddress(res.data.location) : setPreAddress("");
            res.data.serviceArea ? setPreServiceArea(res.data.serviceArea) : setPreServiceArea(null);
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

    const getLocation=async()=>{
        try{
            const JSON_OBJ = await AsyncStorage.getItem('location');
            const Parsed = JSON.parse(JSON_OBJ);
            // console.log(Parsed);
            Parsed !== null ? setLocation(Parsed) : setLocation({});
        }
        catch(err){
            console.log("err",err);
        }
    };

    const toggle=()=>{
        setVisible((visible) => !visible)
    };

    if(isUpdated){
        setTimeout(()=>{
            setIsUpdated(false);
        },3000)
    };

    let updateData={
        // locality: location.city,
        // state: location.state,
        // country: location.country,
        latitude: !visible2 ? location.lat : lat_long.lat,
        longitude: !visible2 ? location.long : lat_long.long,
        serviceArea: Number(area),
        location: !visible2 ? location.location : address
    };

    const updateLocation=async()=>{
        setIndicator(true);
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsed = JSON.parse(json_Val);
        let axiosConfig = {
            headers:{
                Authorization: parsed.token
            }
        };
        axios.patch(`${API_VENDOR}/updatevendor`,updateData,axiosConfig)
        .then(res=>{
            // console.log(res.data);
            setIndicator(false);
            setIsUpdated(true);
            getVendor();
        })
        .catch(err=>{
            console.log(err);
            setIndicator(false);
        })
    };

    return(
        <View style={styles.container}>
            <ProfileHeader 
                nav={()=>navigation.navigate("AlertScreen")}
                goBack={()=>navigation.goBack()}
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
                    onPress={()=>navigation.navigate("EditProfile")}
                    activeOpacity={0.8}
                >
                    <View style={{flexDirection:"row",alignItems:"center",marginLeft:20}}>
                        <Ionicons name="person-outline" color="#000" size={18}/>
                        <Text style={{color:"#000",marginLeft: 20}}>Edit Profile</Text>
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
                    onPress={toggle}
                >
                    <View style={{flexDirection:"row",alignItems:"center",marginLeft:20}}>
                        <EvilIcons name="location" color="#000" size={24} />
                        <Text style={{color:"#000",marginLeft:15}}>Update location</Text>
                    </View>
                    <MaterialIcons name="my-location" color="#000" size={18} style={{marginRight: 20}} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.smCard}
                    activeOpacity={0.8}
                    onPress={logOut_alert}
                >
                    <View style={{flexDirection:"row",alignItems:"center",marginLeft:25}}>
                        <MaterialIcons name="logout" color="#000" size={20}/>
                        <Text style={{color:"#000",marginLeft: 15}}>Logout</Text>
                    </View>
                    <AntDesign name="right" color="#000" size={18} style={{marginRight: 20}} />
                </TouchableOpacity>
            </View>
            <BottomSheet
                visible={visible}
                onBackButtonPress={toggle}
                onBackdropPress={toggle}
            >
                {
                    !visible2 ? 
                    <View style={styles.card}>
                    
                    <Text 
                        style={{
                            color:"#000",
                            fontWeight:"700",
                            marginVertical:10
                        }}
                    >My Location</Text>
                    <View 
                        style={{
                            width:"40%",
                            borderWidth: 0.5,
                            marginBottom:10
                        }} 
                    />
                    {
                        (preAddress ||preServicArea) &&
                        <>
                            <View 
                                style={{
                                    alignItems:"center",
                                    borderWidth:0.2,
                                    paddingHorizontal:20,
                                    paddingVertical:20,
                                    marginVertical:10,
                                    borderRadius:5
                                }}
                            >
                                {
                                    preAddress &&
                                    <>
                                        <Text
                                            style={{
                                                color:"#000",
                                                fontWeight:"600"
                                            }}
                                        >Current Service Location :
                                        </Text>
                                        <View>
                                            <Text
                                                style={{
                                                    color:"gray",
                                                    fontSize:13
                                                }}
                                            >{preAddress}</Text>
                                        </View>
                                    </>
                                }
                                {
                                    preServicArea &&
                                    <View style={{flexDirection:"row",alignItems:"flex-end",marginTop:5}}>
                                        <Text
                                            style={{
                                                color:"#000",
                                                fontWeight:"600"
                                            }}
                                        >Current Service Area :
                                        </Text>
                                        <View>
                                            <Text
                                                style={{
                                                    color:"gray",
                                                    fontSize:13,
                                                    marginLeft:5
                                                }}
                                            >{preServicArea} km</Text>
                                        </View>
                                    </View>
                                }
                            </View>
                            <View 
                                style={{
                                    width:"100%",
                                    borderWidth:1,
                                    borderColor:"#aaa",
                                    marginVertical:10,
                                    backgroundColor:"#aaa"
                                }}
                            />
                            <Text style={{color:"#000",fontWeight:"700"}}>Update Service Location</Text>
                            <View 
                                style={{
                                    width:"60%",
                                    borderWidth: 0.5,
                                    marginVertical:10
                                }} 
                            />
                        </>
                    }
                    <View style={{right:-10}}>
                        <TouchableOpacity
                            style={{
                                flexDirection:"row",
                                alignItems:"center",
                                left:-10,
                                marginTop:10
                            }}
                            onPress={()=>setLocationIndex("0")}
                        >
                            <Feather name={locationIndex==='0'?"check-circle":"circle"} color="#000" size={18} />
                            <Text style={{color:"#000",left:10}}>Use My Current Location</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flexDirection:"row",
                                alignItems:"center",
                                left:-10,
                                marginVertical:10
                            }}
                            onPress={()=>{
                                setLocationIndex("1");
                                setVisible2(true);
                            }}
                        >
                            <Feather name={locationIndex==='1'?"check-circle":"circle"} color="#000" size={18} />
                            <Text style={{color:"#000",left:10}}>Update Manually</Text>
                        </TouchableOpacity>
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                            <TextInput 
                                placeholder="service area"
                                placeholderTextColor="gray"
                                style={{
                                    borderRadius:5,
                                    color:"#000",
                                    width:150,
                                    textAlign:"center",
                                    backgroundColor:"#eee",
                                    left:-10
                                }}
                                value={area}
                                onChangeText={(val)=>setArea(val)}
                                keyboardType="numeric"
                            />
                            <Text style={{color:"#000",right:-20}}>(km)</Text>
                        </View>
                    </View>
                    <Text 
                        style={{
                            color:'#000',
                            fontSize:12,
                            marginHorizontal:20,
                            textAlign:"center",
                            marginVertical:10
                        }}
                    >
                        service area will be calculated from above location
                    </Text>
                    {
                        indicator ? 
                        <View style={{marginVertical:20}}>
                            <ActivityIndicator size={30} color="#f008" />
                        </View>
                        :
                        <View
                        style={{
                            flexDirection:"row",
                            alignItems:"center",
                            marginHorizontal:40,
                            marginVertical:20
                        }}
                        >
                            <TouchableOpacity
                                style={{
                                    backgroundColor:"#f008",
                                    paddingHorizontal:8,
                                    paddingVertical:5,
                                    borderRadius:4
                                }}
                                onPress={toggle}
                                activeOpacity={0.7}
                            >
                                <Text style={{color:"#fff",fontWeight:"500"}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor:"#00C897",
                                    paddingHorizontal:8,
                                    paddingVertical:5,
                                    borderRadius:4,
                                    marginLeft:30
                                }}
                                onPress={updateLocation}
                                activeOpacity={0.7}
                            >
                                <Text style={{color:"#fff",fontWeight:"500"}}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        isUpdated && <Text style={{color:"green",fontSize:12,marginBottom:10}}>Successfully Updated</Text>
                    }
                </View>
                :
                <View style={[styles.card,{height: "85%"}]}>
                    <View
                        style={{
                            position:"absolute",
                            right:20,
                            top:10,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                backgroundColor:"#00C897",
                                paddingVertical:5,
                                paddingHorizontal:5,
                                borderRadius:5
                            }}
                            activeOpacity={0.7}
                            onPress={()=>{
                                setLocationIndex("0");
                                setVisible2(false);
                            }}
                        >
                            <Text style={{color:"#fff",fontWeight:"500",fontSize:11}}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                    <Text 
                        style={{
                            color:"#000",
                            fontWeight:"500",
                            marginVertical:10
                        }}
                    >Add Location</Text>
                    <View 
                        style={{
                            width:"80%",
                            borderWidth: 0.5,
                            marginBottom:5
                        }} 
                    />
                    <View style={{width:"80%",marginTop:10,flex:1}}>
                        <View style={{flexDirection:"row",alignItems:"center",marginVertical:20}}>
                            <TextInput 
                                placeholder="service area..."
                                placeholderTextColor="gray"
                                style={{
                                    borderRadius:5,
                                    color:"#000",
                                    width:150,
                                    // textAlign:"center",
                                    backgroundColor:"#eee",
                                    paddingLeft:10
                                }}
                                value={area}
                                onChangeText={(val)=>setArea(val)}
                                keyboardType="numeric"
                            />
                            <Text style={{color:"#000",right:-20}}>(km)</Text>
                        </View>
                        <GooglePlaces 
                            LOCATION={address}
                            setLOCATION={setAddress}
                            setLAT_LONG={setLat_long}
                            isPROGRESS={false}
                        />
                    </View>
                    <Text 
                        style={{
                            color:'#000',
                            fontSize:12,
                            marginHorizontal:20,
                            textAlign:"center",
                            marginVertical:15
                        }}
                    >
                        service area will be calculated from above location
                    </Text>
                    {
                        indicator ? 
                        <View style={{marginVertical:20}}>
                            <ActivityIndicator size={30} color="#f008" />
                        </View>
                        :
                        <View
                        style={{
                            flexDirection:"row",
                            alignItems:"center",
                            marginHorizontal:40,
                            marginBottom:15
                        }}
                        >
                            <TouchableOpacity
                                style={{
                                    backgroundColor:"#f008",
                                    paddingHorizontal:8,
                                    paddingVertical:5,
                                    borderRadius:4
                                }}
                                onPress={toggle}
                                activeOpacity={0.7}
                            >
                                <Text style={{color:"#fff",fontWeight:"500"}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor:"#00C897",
                                    paddingHorizontal:8,
                                    paddingVertical:5,
                                    borderRadius:4,
                                    marginLeft:30
                                }}
                                onPress={updateLocation}
                                activeOpacity={0.7}
                            >
                                <Text style={{color:"#fff",fontWeight:"500"}}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        isUpdated && <Text style={{color:"green",fontSize:12,marginBottom:10}}>Successfully Updated</Text>
                    }
                </View>
                }
            </BottomSheet>
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
        marginBottom: 20
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
        backgroundColor: "#00C897",
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
    },
    card: {
        backgroundColor: "#fff",
        // height: 380,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        alignItems:"center"
    },
})