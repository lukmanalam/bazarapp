import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    FlatList,
    Dimensions, 
    Image,
    Linking,
    ActivityIndicator
} from "react-native";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";

import Header from "./utils/header";
import { API_VENDOR } from "../../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const { height, width } = Dimensions.get("window");

export default function VendorChat({navigation}){

    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vendorData, setVendorData] = useState(null);
    const isFocused = useIsFocused();

    useEffect(()=>{
        if(isFocused){
            getChatList();
        }
    },[isFocused]);

    const getChatList=async()=>{
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsed = JSON.parse(json_Val);
        let axiosConfig = {
            headers:{
                Authorization: parsed.token
            }
        };
        axios.get(`${API_VENDOR}/vendordetail`,axiosConfig)
        .then(resp=>{
            setLoading(false);
            setChatList(resp.data.customercontact);
            setVendorData(resp.data);
        })
        .catch(err=>{
            setLoading(false);
            console.log("server error: ",err);
        })
    };

    const _openWhatsapp=(item)=>{
        Linking.openURL('http://api.whatsapp.com/send?phone=91'+item.phoneNo)
      };
   

    return(
        <View style={styles.container}>
            <Header
                title={`Chat(${chatList.length})`}
                notify={()=>navigation.navigate("AlertScreen")}
                profile={()=>navigation.navigate("ProfileScreen")}
                bellColor="#000"
            />
            <View style={{
                backgroundColor:"#fff",
                flex:1,
                borderTopRightRadius:10,
                borderTopLeftRadius:10,
                bottom:-10
                }}
            >
                <View>
                    {
                        loading ? <ActivityIndicator style={{marginTop:100}} size={30} />
                        :
                        <FlatList 
                            data={chatList}
                            keyExtractor={item=>item._id}
                            contentContainerStyle={{paddingBottom:150}}
                            showsVerticalScrollIndicator={false}
                            renderItem={({item})=>(
                                <TouchableOpacity key={item._id} 
                                    style={styles.mainView} 
                                    activeOpacity={0.8}
                                    onPress={()=>navigation.navigate("ChatRoom",{totalData: vendorData,customerData:item})}
                                >
                                    <View style={styles.subView}>
                                        <View style={{flexDirection:"row",alignItems:"center"}}>
                                            <View style={{alignItems:"center"}}>
                                                {
                                                    item.profileImg ? 
                                                    <Image style={styles.bgCircle} 
                                                    source={{uri: item.profileImg}}
                                                    />
                                                    :
                                                    <Image style={styles.bgCircle} 
                                                    source={require("../../../assets/profile.png")}
                                                    />
                                                }
                                            </View>
                                            <View style={styles.texts}>
                                            {
                                                item.name ? 
                                                <Text style={{color:"#000",top:0,fontWeight:"500"}}>{item.name}</Text>
                                                :
                                                <Text style={{color:"#000",top:0,fontWeight:"500"}}>User{item._id.split("",2)}**</Text>
                                            }
                                            </View>
                                        </View>
                                        {/* <TouchableOpacity 
                                            style={styles.btnRound} 
                                            onPress={()=>_openWhatsapp(item)}
                                            activeOpacity={0.8}
                                        >
                                            <FontAwesome name="whatsapp" color="green" size={26} />
                                        </TouchableOpacity> */}
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    }
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee"
    },
    header: {
        marginHorizontal: 20
    },
    textInputDiv: {
        marginHorizontal: 10,
        marginVertical: 20,
        backgroundColor: "#aaa",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    textInput: {
        height: 40,
        color: "#000",
        paddingLeft: 20,
        width: "85%"
    },
    mainView: {
        borderBottomWidth:1,
    },
    bgCircle: {
        borderWidth: 1,
        height: 50,
        width: 50,
        borderRadius: 50/2,
        // backgroundColor: "#aaa"
    },
    smCircle: {
        borderWidth: 1,
        height: 20,
        width: 20,
        borderRadius: 20/2,
        backgroundColor: "#aaa",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5
    },
    texts: {
        marginLeft: 10,
    },
    time: {
        // position: "absolute",
        // right: 0,
        // top: 3
    },
    body: {
        backgroundColor:"#fff",
        flex:1,
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
        // bottom:-10
    },
    subView: {
        flexDirection:"row",
        alignItems:"center",
        marginHorizontal:20,
        marginVertical:10,
        justifyContent:"space-between"
    },
    msg: {
        color:"#aaa",
        fontSize:10,
        top:2,
        marginRight:50
    },
    timetxt: {
        color:"#000",
        fontSize:12,
        top:5
    },
    name: {
        color:"#000",
        top:3,
        fontWeight:"500"
    },
    duration: {
        color:"#000",
        fontSize:11,
    },
    btnRound: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginRight: 10,
        elevation: 9,
      }
})




// {
//     "__v": 1, 
//     "_id": "620f9ceba44c460016e9a3cf", 
//     "active": true, 
//     "createdAt": "2022-02-18T13:19:39.746Z", 
//     "customercontact": [
//         {
//             "__v": 0, 
//             "_id": "620faf9bf604d500167def16", 
//             "active": true, 
//             "createdAt": "2022-02-18T14:39:23.563Z", 
//             "phoneNo": 8939117490, 
//             "profileImg": "https://www.w3schools.com/w3images/avatar5.png", 
//             "role": 0, 
//             "status": "active", 
//             "updatedAt": "2022-02-18T14:41:11.628Z", 
//             "vendorcontact": [Array]
//         }, 
//         {
//             "__v": 0, 
//             "_id": "62108fee99420c0016c44b96", 
//             "active": true, 
//             "createdAt": "2022-02-19T06:36:30.646Z", 
//             "phoneNo": 7407668045, 
//             "profileImg": "https://firebasestorage.googleapis.com/v0/b/multivendor-5d027.appspot.com/o/USER%2Fprofile_image%2Frn_image_picker_lib_temp_fe5dcabb-6753-411f-a3c9-41afebf25b62.jpg?alt=media&token=c09e3247-1a0b-40dd-aa3f-17e713de9c40", 
//             "role": 0, 
//             "status": "active", 
//             "updatedAt": "2022-02-21T07:21:15.017Z", 
//             "vendorcontact": [Array]
//         }
//     ], 
//     "numOfReviews": 1, 
//     "phoneNo": 7407668045, 
//     "profileImg": "https://www.w3schools.com/w3images/avatar5.png", 
//     "ratings": 4, 
//     "reviews": [
//         {
//             "_id": "621092bd99420c0016c44bc0", 
//             "rating": 4, 
//             "user": [Object]
//         }
//     ], 
//     "role": 1, 
//     "services": [], 
//     "status": "active", 
//     "updatedAt": "2022-02-19T06:48:29.725Z"
// }