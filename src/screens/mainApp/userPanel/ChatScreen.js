import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    FlatList,
    TextInput,
    Image,
    ActivityIndicator
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";

import { API_USER } from "../../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatScreen({navigation}){

    const [text, setText] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(()=>{
        if(isFocused){
            getChatList();
        }
    },[isFocused]);

    const searchFilter=(val)=>{
        if(val){
            const newData =  chatList.filter((item)=>{
                const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                const textData = val.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setFilterData(newData);
            setText(val);
        }
        else{
            setFilterData(chatList);
            setText(val);
        }
    };

    const getChatList=async()=>{
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsed = JSON.parse(json_Val);
        let axiosConfig = {
        headers:{
            Authorization: parsed.token
        }
        };
        axios.get(`${API_USER}/userdetail`,axiosConfig)
        .then(resp=>{
            setChatList(resp.data.vendorcontact);
            setFilterData(resp.data.vendorcontact);
            setUserData(resp.data);
            setLoading(false);
        })
        .catch(err=>{
            console.log("server error: ",err);
        })
    };


    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{
                    flexDirection:"row",justifyContent:"space-between",
                    alignItems:"center",marginTop:40
                    }}
                >
                    <Text style={{color:"#000",fontWeight:"bold",fontSize:16}}>Chats</Text>
                    <Fontisto name="bell" color="#000" size={24} onPress={()=>navigation.navigate("Alert")} />
                </View>
                <View style={styles.textInputDiv}>
                    <TextInput 
                        style={styles.textInput}
                        placeholder="Search"
                        placeholderTextColor="#000"
                        value={text}
                        onChangeText={(val)=>searchFilter(val)}
                    />
                    <Feather name="search" size={22} style={{color:"#000"}} />
                </View>
            </View>
            <View style={{
                backgroundColor:"#fff",flex:1,
                borderTopRightRadius:10,
                borderTopLeftRadius:10,bottom:-10
                }}
            >
                <View>
                    {
                        loading ? <ActivityIndicator style={{marginTop:60}} size={40} />
                        :
                        <FlatList 
                        data={filterData}
                        keyExtractor={item ? item=>item._id: null}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item})=>(
                            <TouchableOpacity key={item._id} 
                                style={styles.mainView} 
                                onPress={()=>navigation.navigate("ChatRoom",{totalData: userData,vendorData:item})}
                            >
                                <View style={styles.subView}>
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
                                        {/* <View style={styles.smCircle}>
                                            <Text style={{color:"#000",fontSize:12}}>1</Text>
                                        </View> */}
                                    </View>
                                    <View style={styles.texts}>
                                        {
                                            item.name ? 
                                            <Text style={{color:"#000",top:0,fontWeight:"500"}}>{item.name}</Text>
                                            :
                                            <Text style={{color:"#000",top:0,fontWeight:"500"}}>Vendor{item._id.split("",2)}**</Text>
                                        }

                                        {/* <Text style={{color:"#000",fontSize:11,}}>{item.duration}</Text> */}
                                        {/* <Text style={styles.msg}>{item.msg}</Text> */}
                                    </View>
                                    {/* <View style={styles.time}>
                                        <Text style={{color:"#000"}}>{item.time}</Text>
                                    </View> */}
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
        backgroundColor: "#fff"
    },
    header: {
       // marginHorizontal: 20,
       paddingHorizontal:20,
        backgroundColor:'#f0f0f3'
    },
    textInputDiv: {
        marginHorizontal: 10,
        marginVertical: 20,
        backgroundColor: "#fff",
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
        backgroundColor: "#aaa"
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
        position: "absolute",
        right: 0,
        top: 3
    },
    msg: {
        color:"#aaa",
        fontSize:10,
        top:2,
        marginRight:50
    },
    subView: {
        flexDirection:"row",
        alignItems:"center",
        marginHorizontal:20,
        marginVertical:10
    }
})