import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    TextInput,
    Image,
    Button,
    Platform
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomSheet } from "react-native-btr";
import axios from "axios";
import PushNotification from "react-native-push-notification";

import SearchHeader from "./utils/searchHeader";
import { API, API_USER, API_VENDOR } from "../../../../config";




export default function SearchScreen({navigation}){

    const [catData, setCatData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [indicator1, setIndicator1] = useState(true);
    const [indicator2, setIndicator2] = useState(true);
    const [indicator3, setIndicator3] = useState(false);
    const [indicator4, setIndicator4] = useState(false);
    const [success, setSuccess] = useState(false);
    const [text, setText] = useState("");
    const [location, setLocation] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [userData, setUserData] = useState({});
    const [isHeaderReady, setIsHeaderReady] = useState(false);
    const [isExpand, setIsExpand] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [selectedCategory_name, setSelectedCategory_name] = useState('');
    const [selectedCategory_ID, setSelectedCategory_ID] = useState('');
    const [productsData, setProductsData] = useState([]);
    const [filterProductsData, setFilterProductsData] = useState([]);
    const [filterCatData, setFilterCatData] = useState([]);
    const [filterServiceData, setFilterServiceData] = useState([]);


    useEffect(()=>{
        getCategories();
        getServices();
        getLocation();
        getUser();
        getProducts();
    },[]);

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

    const getLocation=async()=>{
        try{
            const JSON_OBJ = await AsyncStorage.getItem('location');
            const Parsed = JSON.parse(JSON_OBJ);
            Parsed !== null ? setLocation(Parsed) : setLocation({});
        }
        catch(err){
            console.log("err",err);
        }
    };

    const getCategories=async()=>{
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsedJWT = JSON.parse(json_Val);
        let axiosConfig = {
            headers:{
              Authorization: parsedJWT.token
            }
        };
        axios.get(`${API}/category`,axiosConfig)
        .then(resp=>{
            setCatData(resp.data);
            setFilterCatData(resp.data);
            setIndicator1(false);
        })
        .catch(e=>{
            console.log("server error: ",e);
        })
    };
    const getServices=async()=>{
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsedJWT = JSON.parse(json_Val);
        let axiosConfig = {
            headers:{
              Authorization: parsedJWT.token
            }
        };
        axios.get(`${API}/service`, axiosConfig)
        .then(resp=>{
            setServiceData(resp.data);
            setFilterServiceData(resp.data);
            setIndicator2(false);
        })
        .catch(e=>{
            console.log("server error: ",e);
        })
    };

    const getProducts=async()=>{
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsedJWT = JSON.parse(json_Val);
        let axiosConfig = {
            headers:{
              Authorization: parsedJWT.token
            }
        };
        axios.get(`${API}/allproducts`,axiosConfig)
        .then(resp=>{
            setProductsData(resp.data);
            setFilterProductsData(resp.data);
            setIndicator4(false);
        })
        .catch(e=>{
            console.log("server error: ",e);
        })
    };

    const Products=()=>(
        <>
        {
            filterProductsData.length === 0 ? 
            <Text style={{color:"gray",fontWeight:"500",textAlign:"center"}}>No Product found</Text>
            :
            <View style={styles.boxContainer}>
            {
                filterProductsData.map((item,index)=>{
                    for(let i=index;i<10;i++){
                        return(
                            <TouchableOpacity 
                                style={styles.cat} key={item._id}
                                activeOpacity={0.8}
                                onPress={()=>navigation.navigate("ProductDetails",item)}
                            >
                                <View style={styles.subView}>
                                    <Image style={styles.smImg} source={{uri: item.images[0]}} />
                                    <Text style={styles.name}>{item.title}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                })
            }
            </View>
        }
        </>
    );

    const Categories=()=>(
        <>
        {
            filterCatData.length === 0 ? 
            <Text style={{color:"gray",fontWeight:"500",textAlign:"center"}}>No Product found</Text>
            :
            <ScrollView
                horizontal={true}
                contentContainerStyle={{}}
                showsHorizontalScrollIndicator={false}
            >
            {
                filterCatData.map(item=>(
                    <TouchableOpacity
                        style={{
                            height:40,
                            paddingRight:10,
                            // maxWidth:"48%",
                            backgroundColor:"#fff",
                            borderRadius:10,
                            justifyContent:"center",
                            marginBottom:10,
                            marginRight:10
                        }} 
                        key={item._id}
                        activeOpacity={0.8}
                        onPress={()=>navigation.navigate("Categories",{"title": item.name,"id": item._id})}
                    >
                        <View style={styles.subView}>
                            {
                                item.imgUrl ?
                                <Image style={styles.smImg} source={{uri: item.imgUrl}} />
                                :
                                <View style={styles.smImg} />
                            }
                            <Text style={styles.name}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            }
            </ScrollView>
        }
        </>
    );
    const Services=()=>(
        <>
        {
            filterServiceData.length === 0 ?
            <Text style={{color:"gray",fontWeight:"500",textAlign:"center",marginTop:40}}>No Service found</Text>
            :
            <View style={styles.boxContainer}>
            {
                filterServiceData.map(item=>(
                    <TouchableOpacity 
                        style={styles.cat} key={item._id}
                        activeOpacity={0.8}
                        onPress={()=>navigation.navigate("ServiceDetails",item)}
                    >
                        <View style={styles.subView}>
                        {
                                item.images ?
                                <Image style={styles.smImg} source={{uri: item.images}} />
                                :
                                <View style={styles.smImg} />
                            }
                            <Text style={styles.name}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            }
        </View>
        }
        </>
    );

    const searchFilter=(val)=>{
        if(val){
            const newData1 =  productsData.filter((item)=>{
                const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
                const textData  = val.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setFilterProductsData(newData1);
            const newData2 =  catData.filter((item)=>{
                const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                const textData  = val.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setFilterCatData(newData2);
            const newData3 =  serviceData.filter((item)=>{
                const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
                const textData  = val.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setFilterServiceData(newData3);
            setText(val);
        }
        else{
            setFilterProductsData(productsData);
            setFilterCatData(catData);
            setFilterServiceData(serviceData);
            setText(val);
        }
    };

    const toggle=()=>{
        setIsVisible(visble => !visble);
    };

    const handleNotification=()=>{
        PushNotification.localNotification({
            channelId:"custom_product",
            title: `New Request`,
            message: `You Have A Product Request of - ${title}`,
            bigText: `You Have A Product Request of - ${title}. ${description}`
        })
    };

    const sendRequest=async()=>{
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsed = JSON.parse(json_Val);
        let axiosConfig = {
            headers:{
                Authorization: parsed.token
            }
        };
        let postData = {
            title: title,
            category: selectedCategory_ID,
            description: description
        };
        let value = {
            title: title,
            category: selectedCategory_name,
            description: description,
            createdAt: new Date()
        };
        if(title === "" || selectedCategory_ID === ""){
            alert("Please enter the details!");
        }else{
            setIndicator3(true);
            axios.post(`${API}/customorder`,postData,axiosConfig)
            .then(async resp=>{
                handleNotification();
                const preReqDataOBJ = await AsyncStorage.getItem("PRODUCT_REQ");
                const preReqData = JSON.parse(preReqDataOBJ);
                if (preReqData){
                    const dataArr = preReqData;
                    dataArr.push(value);
                    await AsyncStorage.setItem("PRODUCT_REQ",JSON.stringify(dataArr));
                }
                else{
                    const newDataArr = [value];
                    await AsyncStorage.setItem("PRODUCT_REQ",JSON.stringify(newDataArr));
                }
                console.log(resp.data);
                setIndicator3(false);
                setSuccess(true);
                setSelectedCategory_name('');
                setSelectedCategory_ID('');
                setTitle('');
                setDescription('');
            })
            .catch(err=>{
                console.log(err);
                setSuccess(false);
            })
        }
    };

    if(success){
        setTimeout(()=>{
            setSuccess(false);
        },3000)
    };

    const showModalToSelect = () => {
        return(
            <View style={styles.absCat}>
                <View style={styles.catContainer}>
                    <Text
                    style={{
                        color: '#000',
                        textAlign: 'center',
                        marginVertical: 10,
                        fontWeight: '700',
                    }}>Select Category</Text>
                    <View
                    style={{
                        width: '80%',
                        backgroundColor: 'gray',
                        borderWidth: 1,
                        alignSelf: 'center',
                    }}
                    />
                    <ScrollView
                        style={{marginTop: 20}}
                        showsVerticalScrollIndicator={false}
                    >
                    {
                        catData.map((item, index) => {
                            let SL_NO = index + 1;
                            return (
                            <TouchableOpacity
                                style={styles.catContents}
                                key={item._id}
                                onPress={() => {
                                setSelectedCategory_ID(item._id);
                                setSelectedCategory_name(item.name);
                                setIsVisible2(false);
                                }}>
                                <Text
                                style={{
                                    color: '#000',
                                    textTransform: 'capitalize',
                                    marginVertical: 10,
                                }}>
                                {SL_NO}. {item.name}
                                </Text>
                            </TouchableOpacity>
                            );
                        })
                    }
                    </ScrollView>
                    <Button
                    title="Cancel"
                    color="#00C897"
                    onPress={() => {
                        setIsVisible2(false);
                    }}
                    />
                </View>
            </View>
        )
    };
    
    return(
        <>
        <ScrollView 
            style={styles.container} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom:100}}
        >
            <SearchHeader
                nav={()=>navigation.navigate("Alert")}
                LOCATION={location.location}
                U_NAME={userData.name}
                expand={isExpand}
                SET_Expand={()=>setIsExpand(expand => !expand)}
                isU_Name={userData.name ? true : false}
                ready={isHeaderReady}
            />
            <View style={styles.textInputDiv}>
                <TextInput 
                    style={[styles.textInput,{fontSize:text ? 14: 12}]}
                    placeholder="Find your products, categories, services..."
                    placeholderTextColor="gray"
                    value={text}
                    onChangeText={(val)=>searchFilter(val)}
                />
                <Feather name="search" size={22} style={{color:"#000",left:-10}} />
            </View>
            <View style={{marginHorizontal:20}}>
                <View style={{marginBottom:10}}>
                    <Text style={styles.subHeader}>Browse Products</Text>
                </View>          
                {
                    indicator4 ? <ActivityIndicator /> : <Products />
                }             
            </View>
            <View style={{marginHorizontal:20}}>
                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"space-between",marginVertical:20}}>
                    <Text style={styles.subHeader}>Browse Categories</Text>   
                    <TouchableOpacity
                        style={{
                            backgroundColor:"#00C897",
                            paddingHorizontal:10,
                            paddingVertical:3,
                            borderRadius:5
                        }}
                        activeOpacity={0.8}
                        onPress={toggle}
                    >
                        <Text style={{
                            color:"#fff",
                            fontSize:12
                        }}>Request a product</Text>
                    </TouchableOpacity>  
                </View>     
                {
                    indicator1 ? <ActivityIndicator /> : <Categories />
                }             
            </View>
            <View style={{marginHorizontal:20,marginTop:10}}>
                <View style={{marginBottom:10}}>
                    <Text style={styles.subHeader}>Browse Services</Text>
                </View>          
                {
                    indicator2 ? <ActivityIndicator /> : <Services />
                }             
            </View>
            <BottomSheet
                visible={isVisible}
                onBackButtonPress={toggle}
                onBackdropPress={toggle}
            >
                <View style={styles.sheet}>
                    <Text style={{
                        color:"#000",
                        fontWeight:"600",
                        marginVertical:10
                    }}>
                        Request a Product
                    </Text>
                    <View 
                        style={{
                            width:"80%",
                            borderWidth:0.5,
                        }}
                    />
                    <TouchableOpacity
                        style={styles.input1}
                        activeOpacity={0.6}
                        onPress={() => {
                            setIsVisible2(true);
                        }}
                    >
                        <View 
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <Text style={{color: 'gray', textTransform: 'capitalize'}}>
                                {!selectedCategory_name ? 'Category' : selectedCategory_name}
                            </Text>
                        <AntDesign name="down" size={18} color="#000" />
                        </View>
                    </TouchableOpacity>
                    <TextInput 
                        style={{
                            backgroundColor:"#f0f0f3",
                            width: "80%",
                            marginTop:20,
                            borderRadius:5,
                            color:"#000",
                            paddingLeft: 20
                        }}
                        placeholder="Product name"
                        placeholderTextColor="gray"
                        value={title}
                        onChangeText={(val)=>setTitle(val)}
                    />
                    <TextInput 
                        style={{
                            backgroundColor:"#f0f0f3",
                            width: "80%",
                            marginTop:20,
                            borderRadius:5,
                            color:"#000",
                            paddingLeft: 20,
                            textAlignVertical:"top",
                            paddingTop:10,
                            height:80
                        }}
                        placeholder="Description"
                        placeholderTextColor="gray"
                        value={description}
                        onChangeText={(val)=>setDescription(val)}
                    />
                    {
                        indicator3 ? <ActivityIndicator style={{marginTop:40}} color="#f008" size={24} />
                        :
                        success ? 
                        <Text style={{
                            color:"green",
                            marginTop:40,
                            fontSize:13
                        }}>
                            Request has been sent
                        </Text>
                        :
                        <TouchableOpacity 
                            style={{
                                backgroundColor:"#00C897",
                                marginTop:40,
                                paddingVertical:5,
                                paddingHorizontal:10,
                                borderRadius:5
                            }}
                            activeOpacity={0.8}
                            onPress={sendRequest}
                        >
                            <Text style={{color:"#fff",fontWeight:"500"}}>Send Request</Text>
                        </TouchableOpacity>
                    }
                </View>
                {isVisible2 && showModalToSelect()}
            </BottomSheet>
        </ScrollView>
    </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f3"
    },
    mainView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom:10,
        borderBottomWidth:1,
        borderBottomColor: "#aaa"
    },
    cat: {
        height:40,
        width:"48%",
        backgroundColor:"#fff",
        borderRadius:10,
        justifyContent:"center",
        marginBottom:10
    },
    subHeader: {
        color:"#000",
        fontWeight:"bold",
        fontSize:16
    },
    smImg: { 
        height:30,
        width:30,
        borderRadius:15,
        backgroundColor:"#00C897",
        marginRight:10
    },
    name: {
        color:"#000",
        fontSize:12,
        flexWrap:"wrap",
        textTransform: "capitalize",
        marginRight:30
    },
    subView: {
        flexDirection:"row",
        alignItems:"center",
        marginLeft:10
    },
    boxContainer: {
        flexDirection:"row",
        justifyContent:"space-between",
        flexWrap:"wrap"
    },
    circle: {
        height:80,
        width:80,
        borderRadius:80/2,
        backgroundColor:"gray"
    },
    heading: {
        fontWeight:"bold",
        color:"#000",
        marginLeft:20,
        fontSize:16
    },
    textInputDiv: {
        marginHorizontal: 20,
        marginVertical: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    textInput: {
        // height: 40,
        color: "#000",
        paddingLeft: 10,
        width: "90%"
    },
    sheet: {
        height:"55%",
        backgroundColor:"#fff",
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
        alignItems:"center"
    },
    input1: {
        height: 45,
        backgroundColor: '#fff',
        // marginHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: 'center',
        paddingHorizontal: 20,
        width:"80%"
    },
    absCat: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
    },
    catContainer: {
        backgroundColor: '#fff',
        height: '80%',
        width: '80%',
        marginTop: 20,
        borderRadius: 5,
    },
    catContents: {
        marginLeft: 20,
        borderBottomWidth: 0.5,
    },
})