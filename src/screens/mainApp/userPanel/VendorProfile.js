import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Platform,
  Linking,
  Image,
  ScrollView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {API} from '../../../../config';

const {height, width} = Dimensions.get('window');

export default function VendorProfile({navigation, route}) {
  const item = route.params;
  const [products, setProducts] = useState([]);
  const [indicator, setIndicator] = useState(true);

  useEffect(() => {
    getVendor_products();
  }, []);

  const getVendor_products = () => {
    axios
      .get(`${API}/products/vendor/${item._id}`)
      .then(resp => {
        setProducts(resp.data);
        setIndicator(false);
      })
      .catch(err => {
        console.log('Server error: ', err);
      });
  };

  const openDialer = () => {
    let number = item.phoneNo;
    if (Platform.OS === 'ios') {
      number = `telprompt:${number}`;
    } else number = `tel:${number}`;
    Linking.openURL(number);
  };

  let MESSAGE = {
    title: 'title',
    query: 'msg',
    vendorId: item._id,
  };

  const _sendMsg = async() => {
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
      headers:{
        Authorization: parsed.token
      }
    };
    axios
      .post(`${API}/contactvendors`,MESSAGE,axiosConfig)
      .then(resp => {
        // console.log(resp.data);
        navigation.navigate('Chat');
      })
      .catch(err => {
        console.log('Error from server MSG: ', err);
      });
  };

  const services = () =>
    item.services.map(service => (
      <View key={service._id}>
        <Text
          style={{
            fontWeight: '500',
            fontSize: 12,
            color: '#000',
            textTransform: 'capitalize',
            marginRight: 5,
          }}>
          {service.title},
        </Text>
      </View>
    ));

  return (
    <View style={styles.container}>
      <>
        <View style={styles.header}>
          <View style={styles.title}>
            <AntDesign
              name="left"
              size={22}
              color="#000"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.vendor}>Vendors</Text>
          </View>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom:40}}
          >
            <View style={styles.profile}>
                {item.profileImg ? (
                <Image style={styles.circle} source={{uri: item.profileImg}} />
                ) : (
                <Image
                  style={styles.circle}
                  source={require('../../../assets/profile.png')}
                />
                )}
                <View>
                {
                  item.name ? 
                  <Text
                  style={{
                  fontWeight: '600',
                  color: '#000',
                  textTransform: 'capitalize',
                  }}
                >
                  {item.name}
                </Text>
                :
                <Text
                  style={{
                  fontWeight: '600',
                  color: '#000',
                  textTransform: 'capitalize',
                  }}
                >
                  Vendor{item._id.split("",2)}**
                </Text>
                }
                {
                  item.locality ? 
                  <Text style={{fontSize: 12,color:"#000"}}>{item.location}</Text>
                  :
                  null
                }
                </View>
            </View>
            <Text style={styles.des}>Services :</Text>
            <View style={{flexDirection: 'row',alignItems:"center",marginHorizontal:20,flexWrap:"wrap"}}>{services()}</View>
            <Text style={styles.des}>Service Area : {item.serviceArea} KM</Text>
          </ScrollView>
          <View style={styles.btns}>
            <TouchableOpacity
              style={styles.btnRound}
              activeOpacity={0.9}
              onPress={() => openDialer()}>
              <Feather name="phone-call" color="#000" size={16} />
            </TouchableOpacity>
            <View style={styles.btnRound}>
              <AntDesign name="star" color="#fc9d28" size={18} />
              <Text style={{fontSize: 8, color: '#000', fontWeight: '500'}}>
                {item.ratings.toString().split('',3)}/5
              </Text>
            </View>
            <TouchableOpacity
             style={styles.btnRound} 
             activeOpacity={0.9}
             onPress={_sendMsg}>
              <MaterialIcons name="chat" color="#000" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginTop: 20, marginBottom: 10}}>
          <Text style={styles.bodyTitle}>All Products</Text>
          {indicator ? (
            <ActivityIndicator size={40} style={{marginTop: width / 3.5}} />
          ) : (
            <FlatList
              style={{marginBottom: height / 1.9}}
              data={products}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item._id}
              columnWrapperStyle={styles.wrapper}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  key={index}
                  style={styles.box}
                  activeOpacity={0.6}
                  onPress={() => navigation.navigate('ProductDetails', item)}>
                  <Image
                    style={{
                      height: width / 3.5,
                      backgroundColor: '#00C897',
                      width: '100%',
                      borderRadius: 10,
                    }}
                    source={{uri: item.images[0]}}
                  />
                  <View style={{marginLeft: 10, marginTop: 5}}>
                    <Text
                      style={{
                        color: '#000',
                        fontSize: 12,
                        textTransform: 'capitalize',
                      }}>
                      {item.title}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: 5,
                    }}>
                    <Text style={{color: '#000', fontSize: 10}}>Enquire</Text>
                    <EvilIcons name="arrow-right" color="#000" size={22} />
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f0f0f3',
    height: 280,
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 40,
    alignItems: 'center',
  },
  vendor: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
  },
  profile: {
    marginVertical: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  des: {
    marginHorizontal: 20,
    flexWrap: 'wrap',
    color:"#000",
    fontWeight:"500"
  },
  box: {
    paddingBottom:10,
    width: '48%',
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 10,
  },
  btns: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 0,
    right: 0,
  },
  btnRound: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 20,
    bottom: -20,
    elevation: 9,
  },
  bodyTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  wrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 20,
  },
});
