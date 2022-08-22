import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackActions, useIsFocused} from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";



import {API, API_USER, API_VENDOR} from '../../../../config';
import Header from './utils/header';

const {height, width} = Dimensions.get('window');
let clickBoxHeight = height / 4.5;

export default function HomeScreen({navigation}) {

  const [serviceData, setServiceData] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading1, setloading1] = useState(true);
  const [loading2, setloading2] = useState(true);
  const [loading3, setloading3] = useState(false);
  const [loading4, setloading4] = useState(true);
  const [loading5, setloading5] = useState(false);
  const [serviceAdded, setServiceAdded] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  const [process, setProcess] = useState('');
  // const [location, setLocation] = useState({});
  const [addNewService, setAddNewService] = useState('');
  const [url, setUrl] = useState('');
  const [vendorData, setVendorData] = useState({});

  // const reverseServiceData = latestProducts.reverse();

  let tempDate = new Date();
  let year = tempDate.getFullYear();
  let month = ('0' + (tempDate.getMonth()+1)).slice(-2);     // to get 0 before a single month (i.e 1 -> 01)
  let day = ('0' + tempDate.getDate()).slice(-2);             // to get 0 before a single day   (i.e 3 -> 03)
  let fDate = `${day}-${month}-${year}`;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getVendor_and_Products();
    }
  }, [isFocused]);

  const getVendor_and_Products=async()=>{
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
        headers:{
            Authorization: parsed.token
        }
    };
    axios.get(`${API_VENDOR}/vendordetail`,axiosConfig)
    .then(async res=>{
      setVendorData(res.data);
      setServiceData(res.data.services);
      setloading4(false);
      axios.get(`${API}/products/vendor/${res.data._id}`)
      .then(resp=>{
        setLatestProducts(resp.data);
        setloading1(false);
      })
      .catch(err=>{
        console.log('server error: ', err);
        setloading1(false);
      })
    })
    .catch(err=>{
      setloading4(false);
      console.log(err);
    })
  };
  

  const switchUser=async()=>{
    setloading5(true);
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
        headers:{
            Authorization: parsed.token
        }
    };
    axios.get(`${API_VENDOR}/logout`,axiosConfig)
    .then(resp=>{
        console.log(resp.data);
        axios.post(`${API_USER}/switch/register`,{phoneNo:vendorData.phoneNo},axiosConfig)
        .then( async resp => {
            try{
              const jsonValue = JSON.stringify(resp.data);
              await AsyncStorage.setItem("jwt",jsonValue);
              setloading5(false);
              await AsyncStorage.setItem("userRole","0");
              navigation.dispatch(
                StackActions.replace("UserPanel")
              )
            }
            catch(e){
              console.log(e);
              setloading5(false);
            }
        })
        .catch(err=>{
            console.log("error switching user: ",err);
            setloading5(false);
        })
    })
    .catch(err=>{
        console.log("error logging out: ",err);
        setloading5(false);
    })
  };

  const _openWhatsapp=(item)=>{
    Linking.openURL('http://api.whatsapp.com/send?phone=91'+"9748552374")
  };
  
  return (
    <View style={styles.container}>
      <Header
        title={vendorData.name ? `Hi, ${vendorData.name}` : `Hi, Vendor`}
        notify={() => navigation.navigate('AlertScreen')}
        profile={() => navigation.navigate('ProfileScreen')}
        bellColor="#000"
        date={fDate}
        isLoading={loading4}
      />
      <ScrollView style={styles.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom:150,paddingTop:10}}
      >
        <TouchableOpacity 
            style={[styles.user,{width:'44%',marginLeft:20}]}
            onPress={switchUser}
        >
            <View style={{flexDirection:"row",alignItems:"flex-end"}}>
              <MaterialCommunityIcons name='account-switch-outline' color="#fff" size={18} />
              {
                loading5 ? <ActivityIndicator color="#fff" size={20} style={{marginHorizontal:5,marginVertical:2}} />
                :
                <Text style={{fontWeight:"500",color:"#fff",marginLeft:5}}>Switch to user</Text>
              }
            </View>
        </TouchableOpacity>
        <View 
          style={{
            flexDirection:"row",
            alignItems:"center",
            justifyContent:"space-between",
            marginHorizontal:20,
            marginTop:10
          }}
        >
          <Text style={{color: '#000', fontSize: 16, fontWeight: '600'}}>
            My Products
          </Text>
        </View>
        <ScrollView 
          contentContainerStyle={{paddingHorizontal:20}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{flexDirection:"row",}}>
            {loading1 ? (
              <View style={{width:width,left:-20}}>
                <ActivityIndicator style={{marginVertical: 40}} size={30} />
              </View>
            ) : (
              latestProducts.map(item=>(
                <TouchableOpacity
                  key={item._id}
                  activeOpacity={0.6}
                  style={styles.box}
                  onPress={()=>navigation.navigate("ProductDetailsVendor",{item:item,edit:true})} 
                >
                  <View style={styles.boxSubView}>
                    <Image
                      style={styles.img}
                      source={{uri: item.images[0]}}
                      resizeMode="stretch"
                    />
                  </View>
                  <View style={{marginLeft: 5, marginTop: 5}}>
                    <Text style={{fontSize: 12, color: '#000'}}>
                      {item.title}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Entypo
                        name="eye"
                        color="#000"
                        size={18}
                        style={{marginRight: 5}}
                      />
                      <Text style={{fontSize: 10, color: '#000'}}>
                        {item.views}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
        <View style={{marginHorizontal:20,marginTop:20}}>
          <Text 
            style={{
              color: '#000', 
              fontSize: 16, 
              fontWeight: '600'
            }}
          >My Services</Text>
          {
            serviceData.map(item => (
                <TouchableOpacity
                  key={item._id}
                  activeOpacity={0.7}
                  style={{borderBottomWidth: 1}}
                  onPress={()=>navigation.navigate("editService",item)}
                >
                  <View style={styles.subView}>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                      {
                        item.images ?
                        <Image style={styles.bgCircle} source={{uri:item.images}} />
                        :
                        <View style={styles.bgCircle} />
                      }
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#000',
                          textTransform: 'capitalize',
                        }}>
                        {item.title}
                      </Text>
                    </View>
                    <AntDesign name="right" size={16} color="#000" />
                  </View>
                </TouchableOpacity>
            ))
          }
        </View>
      </ScrollView>
      <View style={styles.contact}>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
            backgroundColor:"#05e4ae",
            justifyContent:"center",
            alignItems:"center",
            elevation: 9
          }}
          activeOpacity={1}
          onPress={()=>setIsVisible2(isVisible => !isVisible)}
        >
          {
            !isVisible2 ? 
            <AntDesign name='customerservice' color="#fff" size={30} />
            :
            <Entypo name='cross' color="#fff" size={34} />
          }
        </TouchableOpacity>
      </View>
      {
        isVisible2 && 
        <View
          style={{
            position:"absolute",
            bottom: 100,
            right: 75
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor:"#fff",
              paddingHorizontal:15,
              paddingVertical: 5,
              elevation: 9,
              borderTopRightRadius:20,
              borderBottomLeftRadius:20,
              flexDirection:"row",
              alignItems:"center"
            }}
            // activeOpacity={0.9}
            onPress={_openWhatsapp}
          >
            <FontAwesome name="whatsapp" color="green" size={18} />
            <Text style={{color:'#000',marginLeft:5}}>Admin</Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f3',
  },
  contact: {
    position: "absolute",
    bottom: 90,
    right: 20
  },
  body: {
    // marginLeft: 20,
    marginTop: 10,
    // marginBottom:height/2.5,
  },
  box: {
    paddingBottom: 10,
    width: width / 2.3,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#f2f2f2',
    marginRight:10
  },
  body1: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginRight: 20,
  },
  boxSubView: {
    backgroundColor: '#fff',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
    // flex:1
  },
  img: {
    height: clickBoxHeight / 2 + 20,
    width: width / 2.3,
    // resizeMode: "contain",
    // borderTopRightRadius: 10,
    // borderTopLeftRadius: 10,
    // flex:1
  },
  body2: {
    marginTop: 20,
    marginBottom: 80,
  },
  subView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginVertical: 15,
    justifyContent: 'space-between',
  },
  bgCircle: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#00C897',
    marginRight: 10,
    borderWidth: 0.2,
    borderColor:"#aaa"
  },
  time: { 
    position: 'absolute',
    right: 0,
    top: 0,
  },
  msg: {
    color: '#aaa',
    fontSize: 10,
    top: 2,
    marginRight: 50,
  },
  name: {
    color: '#fff',
    fontWeight: '500',
  },
  timeTxt: {
    color: '#fff',
    fontSize: 12,
  },
  absService: {
    position:"absolute",
    right:0,
    left:0,
    bottom:0,
    top:0,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems:"center",
    justifyContent:"center"
  },
  addServiceModal: {
    borderRadius:5,
    backgroundColor: "#fff",
    width: "80%",
  },
  serviceInput: {
    borderRadius: 5,
    color: "#000",
    paddingLeft: 10,
    backgroundColor:"#ffe4e1",
    // marginTop:20,
    width:"80%"
  },
  serviceBtn: {
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal:10,
    borderRadius:5,
  },
  cancelBtn: {
    backgroundColor:"red",
    justifyContent:"center",
    alignItems:"center",
    paddingVertical: 8,
    paddingHorizontal:10,
    borderRadius:5,
  },
  btnView: {
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"space-around",
    marginTop:30,
    marginBottom:10
  },
  textInput1: {
    marginTop: 15,
    height: 45,
    width: "80%",
    backgroundColor: '#fff',
    elevation: 5,
    marginHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  user: {
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"#05e4ae",
    // marginVertical:10,
    paddingVertical:2,
    // paddingHorizontal:8,
    borderRadius:4
}
});
