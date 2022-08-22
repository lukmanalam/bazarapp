import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Image,
    ActivityIndicator,
    ScrollView
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import CategoryHeader from "./utils/CategoryHeader";
import axios from "axios";
import { API, API_USER } from "../../../../config";


const { height, width } = Dimensions.get("window");

export default function Services({route,navigation}){

    const preData = route.params;
    const [data, setData] = useState([]);
    const [indicator, setIndicator] = useState(true);

    useEffect(()=>{
        getServices();
    },[]);

    const getServices=()=>{
        axios.get(`${API}/products/service/${preData.id}`)
        .then(resp=>{
            setData(resp.data);
            setIndicator(false);
        })
        .catch(e=>{
            console.log("server error: ",e);
        })
    };

    const _details=(item)=>{
        navigation.navigate("ProductDetails",item);
    };

    return(
        <View style={styles.container}>
            <CategoryHeader 
                route={preData.title}
                back={()=>navigation.goBack()}
                nav={()=>navigation.navigate("Alert")}
            />
            <ScrollView style={{flex:1}} contentContainerStyle={{paddingHorizontal:10}}>
                {
                    indicator ? 
                    <View style={{justifyContent:"center",alignItems:"center",flex:0.9}}>
                        <ActivityIndicator size={50} /> 
                    </View>
                    :
                    <View style={styles.mapContainer}>
                        {
                            data.map(item=>(
                                <TouchableOpacity 
                                    key={item._id} 
                                    style={styles.box}
                                    activeOpacity={0.6}
                                    onPress={()=>_details(item)}
                                >
                                    <Image style={styles.images}
                                        source={{uri: item.images[0]}}
                                    />
                                    <View style={{marginLeft:10,marginTop:5}}>
                                        <Text style={{
                                            color:"#000",fontSize:12,textTransform:"capitalize"
                                        }}>
                                            {item.title}
                                        </Text>
                                        {/* <Text style={{color:"#000",fontSize:12}}>{item.content.replace(/\s/g, '')}</Text> */}
                                    </View>
                                    <View style={styles.enquire}>
                                        <Text style={{color:"#000",fontSize:10}}>Enquire</Text>
                                        <EvilIcons name="arrow-right" color="#000" size={22} />
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                }
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex:1,
    backgroundColor: '#f0f0f3',
    },
    header: {
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginHorizontal: 20,
        marginTop: 40,
        marginBottom: 20
    },
    subView: {
        flexDirection: "row",
        alignItems: "center"
    },
    catText: {
        fontWeight:"600",
        color:"#000",
        fontSize: 15,
        marginLeft: 20
    },
    box: {
        minHeight: width/2,
        width: "48%",
        backgroundColor: "#fff",
        elevation: 5,
        borderRadius: 10,
        marginBottom: 10
    },
    images: {
        height: width/3.5,
        backgroundColor:"#00C897",
        width:"100%",
        borderRadius:10
    },
    wrapper: {
        justifyContent:"space-between",
        marginHorizontal:20,
        marginBottom:10
    },
    enquire: {
        flexDirection:"row",
        justifyContent:"center",
        marginTop:5
    },
    mapContainer: {
        flexDirection:"row",
        flexWrap:"wrap",
        justifyContent:"space-between"
    }
})