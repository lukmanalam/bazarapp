import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API, API_VENDOR} from '../../../../config';
import Header from './utils/header';

export default function AddService({navigation,route}) {

  const [addNewService, setAddNewService] = useState('');
  const [process, setProcess] = useState('');
  const [url, setUrl] = useState('');
  const [loading3, setloading3] = useState(false);
  const [serviceAdded, setServiceAdded] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategory_ID, setSelectedCategory_ID] = useState('');
  const [selectedCategory_name, setSelectedCategory_name] = useState('');
  const [desc, setDesc] = useState('');
  const [cost, setCost] = useState('');
  const [loading1, setLoading1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);



  useEffect(() => {
    getCategories();
  }, []);

  if(serviceAdded){
    setTimeout(()=>{
      setServiceAdded(false);
    },3000)
  };

  const openLibrary = async () => {
    const options = {
      includeBase64: true,
      quality: 0.2,
      path: 'images',
      mediaType: 'photo',
    };
    launchImageLibrary(options, resp => {
      if (resp.didCancel) {
        console.log('Canceled');
      } else if (resp.error) {
        console.log('Error: ', resp.error);
      } else {
        const imgData = resp.assets[0];
        try {
          const task = storage()
            .ref('VENDOR/service/img' + imgData.fileName)
            .putString(imgData.base64, 'base64');
          task.on(
            'state_changed',
            function (snapshot) {
              const rate = Math.floor(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              );
              setProcess(`${rate}%`);
              console.log(rate);
            },
            function (err) {
              console.log(err);
            },
            function () {
              task.snapshot.ref.getDownloadURL().then(function (url) {
                setUrl(url);
              });
            },
          );
          task.then(() => {
            console.log('PDF uploaded to the bucket!');
          });
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  const getCategories = () => {
    axios
      .get(`${API}/category`)
      .then(resp => {
        setCategoriesData(resp.data);
      })
      .catch(err => {
        console.log('server error: ', err);
      });
  };

  const createService=async()=>{
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
        headers:{
            Authorization: parsed.token
        }
    };
    if(addNewService !== ""){
        setloading3(true);
        let postData = {
          title: addNewService,
          price: Number(cost),
          description: desc,
          images: url,
          category: selectedCategory_ID,
        };
        axios.get(`${API_VENDOR}/vendordetail`,axiosConfig)
        .then(resp=>{
            if(resp.data.services.length > 0){
                setloading3(false);
                Alert.alert("You cann't add more than One Service");
              }
              else{
                axios.patch(`${API}/service`,postData,axiosConfig)
                .then(res=>{
                    setloading3(false);
                    setServiceAdded(true);
                    setAddNewService('');
                    setUrl('');
                    setSelectedCategory_name('');
                    setSelectedCategory_ID('');
                    setAddNewService('');
                    setDesc('');
                    setCost('');    
                    console.log(res.data);               
                })
                .catch(err=>{
                    console.log("err add Service: ",err);
                    setloading3(false);
                })
            }
        })
        .catch(err=>{
            console.log("err",err);
        })
    }
    else{
      null;
    }
  };

  const showModalToSelect = () => (
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
          showsVerticalScrollIndicator={false}>
          {
          isVisible2 &&
            loading1 ?
              <ActivityIndicator size={30} style={{marginTop: 40}} />
            : 
              categoriesData.map((item, index) => {
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
  );

  return (
    <>
      <View style={styles.container}>
        <Header
          isBack={true}
          back={() => navigation.goBack()}
          title="Add Service"
          notify={() => navigation.navigate('AlertScreen')}
          profile={() => navigation.navigate('ProfileScreen')}
          bellColor="#000"
        />
        <ScrollView style={{flex:1}} 
          contentContainerStyle={{paddingBottom:200,paddingTop:20}}
          showsVerticalScrollIndicator={false}
        >
            <Text 
            style={{
                color:"gray",
                fontSize:12,
                textAlign:"center",
            }}
            >** Only 1 Service can be added **</Text>
            <View
            style={{marginTop:20,alignItems:"center"}}
            >
              <TouchableOpacity
              style={styles.input1}
              activeOpacity={0.6}
              onPress={() => setIsVisible2(true)}>
              <View style={styles.cat}>
                <Text style={{color: 'gray', textTransform: 'capitalize'}}>
                  {!selectedCategory_name ? 'Category' : selectedCategory_name}
                </Text>
                <AntDesign name="down" size={18} color="#000" />
              </View>
            </TouchableOpacity>
            <TextInput 
                style={styles.serviceInput}
                placeholder="add your service here..."
                placeholderTextColor="gray"
                value={addNewService}
                onChangeText={(val)=>setAddNewService(val)}
            />
            <View style={styles.desc}>
              <TextInput
                style={[
                  styles.Name,
                  {
                    height: '100%',
                    textAlignVertical: 'top',
                  },
                ]}
                placeholder="Description"
                placeholderTextColor="gray"
                multiline={true}
                value={desc}
                onChangeText={val => setDesc(val)}
              />
            </View>
            <TouchableOpacity
                style={[styles.textInput1, styles.image]}
                activeOpacity={0.8}
                onPress={openLibrary}>
                <Text style={{color: 'gray'}}>Images</Text>
                {
                    !process ? <Feather name="upload" color="#000" size={18} /> : 
                    process == "100%" ? <MaterialIcons name='done' color="green" size={20} /> :
                    <Text style={{color:"gray",fontSize:12}}>{process}</Text>
                }
            </TouchableOpacity>
            <View style={styles.textInput1}>
              <TextInput
                style={styles.Name}
                placeholder="Costs"
                placeholderTextColor="gray"
                value={cost}
                onChangeText={val => setCost(val)}
                keyboardType="numeric"
              />
            </View>
            </View>
            {
            loading3 ? 
            <View style={{marginVertical:25}}>
                <ActivityIndicator size={30} />
            </View>
            :
            <View style={styles.btnView}>
                <TouchableOpacity style={styles.serviceBtn}
                    activeOpacity={0.6}
                    onPress={createService}
                    disabled={loading3 ? true : false}
                >
                    <Text style={{color:"#fff",fontWeight:"600"}}>+Add Service</Text>
                </TouchableOpacity>
            </View>
            }
            {
            serviceAdded ? <Text style={{color:"green",textAlign:"center",marginBottom:10,fontSize:12}}>service added</Text> : null
            }
        </ScrollView>
      </View>
      {isVisible2 && showModalToSelect()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  textInput1: {
    // marginTop: 15,
    height: 45,
    width: "80%",
    backgroundColor: '#fff',
    // elevation: 5,
    marginHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
  },
  input1: {
    height: 45,
    width:"80%",
    backgroundColor: '#fff',
    marginHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  Name: {
    paddingLeft: 20,
    borderRadius: 10,
    color: '#000',
  },
  desc: {
    width:"80%",
    backgroundColor: '#fff',
    marginHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    height: 100,
  },
  Content: {
    backgroundColor: '#fff',
    marginHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
    height: 70,
  },
  image: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  btn: {
    alignItems: 'center',
    backgroundColor: '#00C897',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 200,
  },
  absAlert: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
  },
  alertBox: {
    height: '40%',
    width: '90%',
    backgroundColor: '#fff',
    top: 100,
    borderRadius: 10,
  },
  cancel: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  content: {
    backgroundColor: '#42b349',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
  },
  select: {
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 10,
    color: '#000',
    fontSize: 16,
  },
  lastView: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 15,
  },
  line: {
    width: '80%',
    borderWidth: 0.5,
    alignSelf: 'center',
    marginTop: 10,
  },
  cat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  serviceInput: {
    borderRadius: 5,
    color: "#000",
    paddingLeft: 20,
    backgroundColor:"#fff",
    // marginTop:20,
    width:"80%"
  },
  btnView: {
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"space-around",
    marginTop:30,
    marginBottom:10
  },
  serviceBtn: {
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: "#05e4ae",
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
});