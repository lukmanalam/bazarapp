import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList,
    Dimensions, 
    Image
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Fontisto from "react-native-vector-icons/Fontisto";
import AsyncStorage from '@react-native-async-storage/async-storage';


const { height, width } = Dimensions.get("window");

export default function AlertScreen({navigation}){

    const [notification, setNotification] = useState([]);


    useEffect(()=>{
        getNotification();
    },[]);

    const getNotification=async()=>{
        const msg = await AsyncStorage.getItem("notifications");
        const parse = JSON.parse(msg);
        console.log(parse);
        parse !== null ? setNotification(parse) : setNotification([]);
    };


    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerSub}>
                    <AntDesign name="left" color="#000" size={24} onPress={()=>navigation.goBack()} />
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{color:"#000",fontWeight:"500",fontSize:16}}>Alerts</Text>
                        <View style={styles.round}>
                            <Fontisto name="bell" color="#fff" size={22} />
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.body}>
                <View>
                    {
                        notification.length !== 0 ? 
                        <FlatList 
                        data={notification}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item,index})=>(
                            <View key={item.messageId} style={styles.mainView}>
                                <View style={styles.subView}>
                                    <View style={styles.circleView}>
                                        <Image style={styles.bgCircle} source={require('../../../assets/logo.png')} />
                                    </View>
                                    <View style={styles.texts}>
                                        <Text style={styles.name}>{item.notification.title}</Text>
                                        <Text style={styles.msg}>{item.notification.body}</Text>
                                        {/* <Text style={styles.msg}>{item.msg}</Text> */}
                                    </View>
                                    {/* <View style={styles.time}>
                                        <Text style={styles.timeTxt}>{item.time}</Text>
                                    </View> */}
                                </View>
                            </View>
                        )}
                    />
                    :
                    <Text style={{color:"#aaa",fontWeight:"600",textAlign:"center",marginTop:20}}>No notification yet</Text>
                    }
                </View>
            </View>
        </View>
    )
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
    textInput: {
        height: 40,
        color: "#000",
        paddingLeft: 20,
        width: "85%"
    },
    mainView: {
        borderBottomWidth:1,
        // justifyContent:"center"
    },
    bgCircle: {
        // borderWidth: 1,
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
        position: "absolute",
        right: 0,
        top: 0
    },
    subView: {
        flexDirection:"row",
        alignItems:"center",
        marginHorizontal:20,
        marginVertical:15
    },
    headerSub: {
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginTop:40
    },
    body: {
        backgroundColor:"#fff",
        flex:1,
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
        bottom:-10
    },
    alert: {
        color:"#000",
        fontWeight:"bold",
        fontSize:16
    },
    msg: {
        color:"#aaa",
        fontSize:10,
        top:2,
        marginRight:50
    },
    name: {
        color:"#000",
        fontWeight:"500"
    },
    timeTxt: {
        color:"#000",
        fontSize:12
    },
    round: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#05e4ae",
        height: 40,
        width: 40,
        borderRadius: 40/2,
        marginLeft: 10
    },
    circleView: {
        borderRadius: 25,
        borderWidth: 0.5,
        borderColor:"gray"
    }
})