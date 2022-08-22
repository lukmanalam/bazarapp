import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    Image
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StackActions, useIsFocused} from '@react-navigation/native';
import axios from "axios";
import MenuHeader from "./utils/menuHeader";
import { API, API_USER, API_VENDOR } from "../../../../config";
import VendorsNearby from "./utils/VendorsNearby";
import { ImageSlider } from "./utils/img-slider";


const { height, width } = Dimensions.get("window");

export default function Menu({navigation}){

    const [data, setData] = useState([]);
    const [indicator, setIndicator] = useState(true);
    const [indicator1, setIndicator1] = useState(true);
    const [location, setLocation] = useState({});
    const [bannerImg, setBannerImg] = useState([]);
    const [userData, setUserData] = useState({});
    const [isExpand, setIsExpand] = useState(false);
    const [isHeaderReady, setIsHeaderReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serviceData, setServiceData] = useState([]);
    const [token, setToken] = useState(null);

    const IMAGES = [];

    const isFocused = useIsFocused();

    useEffect(()=>{
        getProducts();
        getToken();
        getLocation();
        getBanner();
        getServices();
        if(isFocused){
            getUser();
        }
    },[isFocused]);

    const getToken = async () => {
        try {
          const Json = await AsyncStorage.getItem('jwt');
          const Parsed = JSON.parse(Json);
          setToken(Parsed);
        } catch (e) {
          console.log('Token Error: ', e);
        }
      };

    const getBanner=()=>{
        axios.get(`${API}/banner`)
        .then(resp=>{
            resp.data.map(item=>{
                if(item.imgUrl){
                    var innerObj = {img: item.imgUrl};
                    IMAGES.push(innerObj);
                    setBannerImg(IMAGES);
                } else {

                }
            });
        })
        .catch(err=>{
            console.log("banner err:",err);
        })
    };

    const getProducts=()=>{
        axios.get(`${API}/allproducts`)
        .then(resp=>{
            setData(resp.data);
            setIndicator(false);
        })
        .catch(e=>{
            console.log("server error: ",e);
        })
    };

    const getServices = async() => {
        const json_Val = await AsyncStorage.getItem("jwt");
                const parsedJWT = JSON.parse(json_Val);
                let axiosConfig = {
                    headers:{
                      Authorization: parsedJWT.token
                    }
                };
        axios.get(`${API}/service`,axiosConfig)
        .then(resp => {
        
        setServiceData(resp.data);
        setIndicator1(false);
        console.log(resp.data)
        })
        .catch(err => {
        console.log('server error: ', err);
        setIndicator1(false);
        });
    };

    const getLocation=async()=>{
        try{
            const JSON_OBJ = await AsyncStorage.getItem('location');
            const Parsed = JSON.parse(JSON_OBJ);
            if(Parsed){
                setLocation(Parsed);
                const json_Val = await AsyncStorage.getItem("jwt");
                const parsedJWT = JSON.parse(json_Val);
                let axiosConfig = {
                    headers:{
                      Authorization: parsedJWT.token
                    }
                };
                let updateLatLong = {
                    "latitude": Parsed.lat,
                    "longitude": Parsed.long
                };
                axios.patch(`${API_USER}/updateuser`,updateLatLong,axiosConfig)
                .then(res=>{
                    console.log("updated lat-long");
                })
                .catch(err=>{
                    console.log(err);
                });
            }
            else {
                setLocation({});
            }
        }
        catch(err){
            console.log("err",err);
        }
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
            setUserData(res.data);
            setIsHeaderReady(true);
        })
        .catch(err=>{
            console.log(err);
        })
    };

    const vendorLogin=async()=>{
        setLoading(true);
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsed = JSON.parse(json_Val);
        let axiosConfig = {
          headers:{
            Authorization: parsed.token
          }
        };
        axios.get(`${API_USER}/logout`,axiosConfig)
        .then(resp=>{
            console.log(resp.data);
            axios.post(`${API_VENDOR}/switch/register`,{phoneNo:userData.phoneNo},axiosConfig)
            .then( async resp => {
                try{
                    const jsonValue = JSON.stringify(resp.data);
                    await AsyncStorage.setItem("jwt",jsonValue);
                    await AsyncStorage.setItem("userRole","1");
                    setLoading(false);
                    navigation.dispatch(
                        StackActions.replace("VendorPanel")
                    )
                }
                catch(e){
                    console.log(e);
                    setLoading(false);
                }
            })
            .catch(err=>{
                console.log("error switching user: ",err);
                setLoading(false);
            })
        })
        .catch(err=>{
            console.log("error logging out: ",err);
            setLoading(false);
        })
    };

    
    return(
        <View style={styles.container}>
            <MenuHeader
                alert={()=>navigation.navigate("Alert")}
                LOCATION={location.location}
                U_NAME={userData.name}
                expand={isExpand}
                SET_Expand={()=>setIsExpand(expand => !expand)}
                isU_Name={userData.name ? true : false}
                ready={isHeaderReady}
            />

            <ScrollView
                contentContainerStyle={{paddingBottom:100}}
                showsVerticalScrollIndicator={false}
            >
                {
                    bannerImg.length !== 0 ?
                    <ImageSlider
                        data={bannerImg}
                        autoPlay={true}
                        closeIconColor="#fff"
                        showIndicator={false}
                        caroselImageContainerStyle={{height:150}}
                        timer={5000}
                    />
                    :
                    <View style={{
                        height:150,alignItems:"center",justifyContent:"center",
                        borderTopWidth:0.5,borderBottomWidth:0.5}}
                    >
                        <Text style={{color:"#000",fontWeight:"500"}}>Loading...</Text>
                    </View>
                }
                <VendorsNearby
                    vendorProfile={(item)=>navigation.navigate("VendorProfile",item)}
                    login={vendorLogin}
                    isLoading={loading}
                />
                <View style={{marginLeft:20,marginTop:20}}>
                    <Text style={styles.products}>Latest Products</Text>
                    {
                        indicator ? <ActivityIndicator style={{left: -10,marginTop: 20}} size={30} />
                        :
                        <ScrollView
                            horizontal={true}
                        >
                            {
                                data.map(item=>(
                                    <TouchableOpacity
                                        key={item._id}
                                        style={styles.box}
                                        activeOpacity={0.7}
                                        onPress={()=>navigation.navigate("ProductDetails", item)}
                                    >
                                        <Image style={styles.img}
                                            source={{uri: item.images[0]}}
                                        />
                                        <View style={{marginLeft:10,marginTop:5}}>
                                            <Text style={styles.title}>{item.title}</Text>
                                        </View>
                                        <View style={styles.enquire}>
                                            <Text style={{color:"#000",fontSize:10}}>Enquire</Text>
                                            <EvilIcons name="arrow-right" color="#000" size={22} />
                                        </View>
                                    </TouchableOpacity>
                                )).reverse()
                            }
                        </ScrollView>
                    }
                </View>
                <View style={{marginLeft:20}}>
                    <Text style={styles.products}>Latest Services</Text>
                    {
                        indicator1 ? <ActivityIndicator style={{left: -10,marginTop: 20}} size={30} />
                        :
                        <ScrollView
                            horizontal={true}
                        >
                            {
                                serviceData.map(item=>(
                                    <TouchableOpacity
                                        key={item._id}
                                        style={styles.box}
                                        activeOpacity={0.7}
                                        onPress={()=>navigation.navigate("ServiceDetails", item)}
                                    >
                                        {
                                            item.images ?
                                            <Image style={styles.img}
                                                source={{uri: item.images}}
                                            />
                                            :
                                            <View style={[styles.img,{alignItems:"center",justifyContent:"center"}]}>
                                                <Text style={{fontSize:11}}>No image available</Text>
                                            </View>
                                        }
                                        <View style={{marginLeft:10,marginTop:5}}>
                                            <Text style={styles.title}>{item.title}</Text>
                                        </View>
                                        <View style={styles.enquire}>
                                            <Text style={{color:"#000",fontSize:10}}>Enquire</Text>
                                            <EvilIcons name="arrow-right" color="#000" size={22} />
                                        </View>
                                    </TouchableOpacity>
                                )).reverse()
                            }
                        </ScrollView>
                    }
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",
    },
    box: {
        paddingBottom:10,
        width: width/2.4,
        backgroundColor: "#fff",
        marginHorizontal:5,
        marginBottom:10,
        elevation: 5,
        borderRadius: 10
    },
    products: {
        color:"#000",
        fontWeight:"bold",
        marginBottom:10,
        fontSize:16,
        marginLeft:5
    },
    img: {
        height: width/3.5,
        backgroundColor:"#eee",
        width:"100%",
        borderRadius:10
    },
    title: {
        color:"#000",
        fontSize:12,
        textTransform:"capitalize"
    },
    enquire: {
        flexDirection:"row",
        justifyContent:"center",
        marginVertical:5
    }
})
