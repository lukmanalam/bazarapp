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
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API, API_VENDOR} from '../../../../config';
import Header from './utils/header';

export default function AddProduct({navigation,route}) {

  const preData = route.params;
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [cost, setCost] = useState('');
  const [discount, setDiscount] = useState(0);
  const [content, setContent] = useState('');
  const [isVisible1, setIsVisible1] = useState(false);

  const [isVisible2, setIsVisible2] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategory_ID, setSelectedCategory_ID] = useState('');
  const [selectedCategory_name, setSelectedCategory_name] = useState('');
  const [loading1, setLoading1] = useState(false);

  const [isVisible3, setIsVisible3] = useState(false);
  const [serviceData, setServiceData] = useState([]);
  const [selectedService_ID, setSelectedService_ID] = useState('');
  const [selectedService_name, setSelectedService_name] = useState('');
  const [loading2, setLoading2] = useState(false);

  const [imgURL, setImgURL] = useState([]);
  const [process, setProcess] = useState('');
  const [indicator1, setIndicator1] = useState(false);
  const [productAdded, setProductAdded] = useState(false);
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);

  useEffect(() => {
    getCategories();
    getServices();
  }, []);

  const openLibrary=async()=>{
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
      mediaType: 'photo',
      compressImageQuality: 0.2
    })
    .then(images=>{
      if(images.length > 3){
        Alert.alert("Cann't add more than 3 images");
      }
      else{
        images.forEach(x=>{
          let fileName = x.path.substring(x.path.lastIndexOf('/') + 1);
          try {
            const task = storage()
              .ref('VENDOR/product/img' + fileName)
              .putString(x.data, 'base64');
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
                  setImgURL((prev) => [...prev, url])
                });
              },
            );
            task.then(() => {
              console.log('PDF uploaded to the bucket!');
            });
          } catch (e) {
            console.log(e);
          }
          setIsVisible1(false);
        })
      }
    })
  };

  const getCategories = () => {
    axios
      .get(`${API}/category`)
      .then(resp => {
        setCategoriesData(resp.data);
        setLoading1(false);
      })
      .catch(err => {
        console.log('server error: ', err);
      });
  };

  const getServices = () => {
    axios
      .get(`${API}/service`)
      .then(resp => {
        setServiceData(resp.data);
        setLoading2(false);
      })
      .catch(err => {
        console.log('server error: ', err);
      });
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
          }}>{`Select ${isVisible2 ? 'Category' : 'Service'}`}</Text>
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
          {isVisible2 ? (
            loading1 ? (
              <ActivityIndicator size={30} style={{marginTop: 40}} />
            ) : (
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
            )
          ) : loading2 ? (
            <ActivityIndicator size={30} style={{marginTop: 40}} />
          ) : (
            serviceData.map((item, index) => {
              let SL_NO = index + 1;
              return (
                <TouchableOpacity
                  style={styles.catContents}
                  key={item._id}
                  onPress={() => {
                    setSelectedService_ID(item._id);
                    setSelectedService_name(item.name);
                    setIsVisible3(false);
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
          )}
        </ScrollView>
        <Button
          title="Cancel"
          color="#00C897"
          onPress={() => {
            setIsVisible2(false);
            setIsVisible3(false);
          }}
        />
      </View>
    </View>
  );

  let postData = {
    title: name,
    price: Number(cost),
    discount: discount,
    description: desc,
    images: imgURL,
    category: selectedCategory_ID,
  };

  const createProduct = async() => {
    setIndicator1(true);
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
        headers:{
            Authorization: parsed.token
        }
    };
    if(
      name === ""|| 
      imgURL.length === 0 || 
      selectedCategory_ID === ""
      ){
      setError2(true);
      setIndicator1(false);
    }
    else{
      setError2(false);
      axios.get(`${API}/products/vendor/${preData}`,axiosConfig)
      .then(resp => {
        if(resp.data.length >= 10){
          setIndicator1(false);
          Alert.alert("You cann't add more than 10 Products");
        }
        else{
          axios.post(`${API}/products`, postData,axiosConfig)
          .then(resp => {
            setError1(false);
            setIndicator1(false);
            setProductAdded(true);
            setName('');
            setCost('');
            setDesc('');
            setContent('');
            setImgURL('');
            setSelectedCategory_name('');
            setSelectedCategory_ID('');
            setSelectedService_ID('');
            setSelectedService_name('');
          })
          .catch(err => {
            console.log('server error: ', err);
            setIndicator1(false);
            setProductAdded(false);
            setError1(true);
          });
        }
      })
      .catch(err => {
        console.log('server error: ', err);
      });
    }
  };

  if(productAdded){
    setTimeout(()=>{
      setProductAdded(false);
    },3000)
  };

  return (
    <>
      <View style={styles.container}>
        <Header
          isBack={true}
          back={() => navigation.goBack()}
          title="Add Product"
          notify={() => navigation.navigate('AlertScreen')}
          profile={() => navigation.navigate('ProfileScreen')}
          bellColor="#000"
        />
        <Text 
          style={{
            color:"gray",
            fontSize:12,
            textAlign:"center"
          }}
        >** Maximum 10 Products can be added **</Text>
        <ScrollView
          style={{marginTop:10}}
          contentContainerStyle={{paddingTop:20}}
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
          <View style={[styles.textInput1]}>
            <TextInput
              style={styles.Name}
              placeholder="Name of Product"
              placeholderTextColor="gray"
              value={name}
              onChangeText={val => setName(val)}
            />
          </View>
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
            onPress={openLibrary}
          >
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
          <View style={styles.textInput1}>
            <TextInput
              style={styles.Name}
              placeholder="Discount"
              placeholderTextColor="gray"
              value={discount}
              onChangeText={val => setDiscount(val)}
              keyboardType="numeric"
            />
          </View>
          <View style={{alignItems: 'center', marginTop: 40}}>
              {
                  productAdded ? 
                  <Text style={{color:"green",fontSize:12,marginBottom:10}}>Product is added</Text> :
                  error1 ? 
                    <>
                        <Text style={{color:"red",fontSize:12,top:-5}}>please try again later...</Text>
                    </>
                  : 
                  error2 ? <Text style={{color:"red",fontSize:12,top:-5}}>please, fill all the details !</Text>
                  :
                  null
              }
            <TouchableOpacity style={styles.btn} onPress={createProduct}>
              {
                  !indicator1 ? 
                  <Text style={{color: '#fff', fontWeight: '600'}}>
                Add Product
              </Text>:
              <ActivityIndicator color="#fff" />
              }
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      {isVisible2 && showModalToSelect()}
      {isVisible3 && showModalToSelect()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  textInput1: {
    height: 45,
    backgroundColor: '#fff',
    marginHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  input1: {
    height: 45,
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
    backgroundColor: '#fff',
    marginHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
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
});