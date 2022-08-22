import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Image,
    ActivityIndicator
} from "react-native";
import axios from "axios";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import CategoryHeader from "./utils/CategoryHeader";
import { API } from "../../../../config";


const { height, width } = Dimensions.get("window");

export default function Categories({route,navigation}){

    const preData = route.params;
    const [data, setData] = useState([]);
    const [indicator, setIndicator] = useState(true);

    useEffect(()=>{
        getCategories();
    },[]);

    const getCategories=()=>{
        axios.get(`${API}/products/category/${preData.id}`)
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
            <View style={{flex:1}}>
                {
                    indicator ? 
                    <View style={{justifyContent:"center",alignItems:"center",flex:0.9}}>
                        <ActivityIndicator size={50} /> 
                    </View>
                    :
                    <FlatList 
                        data={data}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item=>item._id}
                        columnWrapperStyle={styles.wrapper}
                        renderItem={({item})=>(
                            <TouchableOpacity 
                                key={item._id} 
                                style={styles.box}
                                activeOpacity={0.7}
                                onPress={()=>_details(item)}
                            >
                                <Image 
                                    style={styles.images}
                                    source={{uri: item.images[0]}}
                                />
                                <View style={{marginLeft:10,marginTop:5}}>
                                    <Text style={{color:"#000",fontSize:12,textTransform:"capitalize"}}>{item.title}</Text>
                                    {/* <Text style={{color:"#000",fontSize:12}}>{item.content.replace(/\s/g, '')}</Text> */}
                                </View>
                                <View style={styles.enquire}>
                                    <Text style={{color:"#000",fontSize:10}}>Enquire</Text>
                                    <EvilIcons name="arrow-right" color="#000" size={22} />
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                }
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#f0f0f3"
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
        paddingBottom:10,
        width: "48%",
        backgroundColor: "#fff",
        elevation: 5,
        borderRadius: 10,
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
    }
})