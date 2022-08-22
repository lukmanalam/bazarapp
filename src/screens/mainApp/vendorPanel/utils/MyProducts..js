import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {useIsFocused} from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

import Header from './header';
import { height } from '../ChatScreen';
import { API, API_VENDOR } from '../../../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

let clickBoxHeight = height / 4;


export default function MyProduct() {
    
  const navigation = useNavigation();
  const route = useRoute();
  const preData = route.params;
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [vendorId, setVendorId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      getProducts();
    }
  }, [isFocused]);

  const getProducts = async() => {
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
        headers:{
            Authorization: parsed.token
        }
    };
    preData ? 
    (
      axios
        .get(`${API}/products/service/${preData._id}`,axiosConfig)
        .then(resp => {
          // console.log(resp.data);
          setData(resp.data);
          setLoading(false);
        })
        .catch(err => {
          console.log('server error: ', err);
          setLoading(false);
        })
    )
    :
    (
      axios
      .get(`${API_VENDOR}/vendordetail`,axiosConfig)
      .then(res => {
        setVendorId(res.data._id);
        axios
          .get(`${API}/products/vendor/${res.data._id}`)
          .then(resp => {
            console.log(resp.data);
            setData(resp.data);
            setLoading(false);
          })
          .catch(err => {
            console.log('server error: ', err);
            setLoading(false);
          });
      })
      .catch(err => {
        console.log(err);
      })
    )
  };

  return (
    <View style={styles.container}>
      <Header
        isBack={preData ? true : false}
        back={()=>navigation.goBack()}
        title="My Products"
        notify={() => navigation.navigate('AlertScreen')}
        profile={() => navigation.navigate('ProfileScreen')}
        bellColor="#000"
      />
      <View style={styles.body}>
        {
          loading ? null
          :
          <View style={styles.bodyTitle}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.subTitle}>{preData ? preData.name : "All Products"}</Text>
              <AntDesign name="down" size={16} color="#000" />
            </View>
            {
              !preData ? 
              <TouchableOpacity
                onPress={() => navigation.navigate('addProductScreen',vendorId)}>
                <Text style={{color: '#000', fontSize: 12}}>+Add Product</Text>
                <View style={{width: 90, borderWidth: 0.5, borderColor: '#000'}} />
              </TouchableOpacity>
              :
              null
            }
          </View>
        }
        <>
          {loading ? (
            <View style={{height:"70%",justifyContent:"center"}}>
              <ActivityIndicator size={40} />
            </View>
          ) : data.length === 0 ? (
            <Text style={{color: '#000', marginTop: 40, textAlign: "center"}}>No Product found</Text>
          ) : (
            <FlatList
              contentContainerStyle={{paddingBottom:150}}
              data={data}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item._id}
              columnWrapperStyle={{justifyContent: 'space-between'}}
              renderItem={({item}) => (
                <TouchableOpacity key={item._id} style={styles.box}
                    activeOpacity={0.6}
                    onPress={()=>navigation.navigate("ProductDetailsVendor",{item:item,edit:true})}
                >
                  <View style={styles.boxSubView}>
                    <Image
                      style={styles.img}
                      source={{uri: item.images[0]}}
                      resizeMode="stretch"
                    />
                  </View>
                  <View style={{marginLeft: 10, marginTop: 5}}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#000',
                        textTransform: 'capitalize',
                      }}>
                      {item.title}
                    </Text>
                    {/* <Text style={{fontSize: 11, color: '#000'}}>
                      {item.content}
                    </Text> */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 5,
                      }}>
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
              )}
            />
          )}
        </>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f3',
  },
  body: {
    marginTop: 20,
    flex: 1,
    marginHorizontal: 20,
  },
  bodyTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontWeight: '500',
    color: '#000',
    marginRight: 10,
  },
  box: {
    paddingBottom:10,
    width: '48%',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    // margin: 5
  },
  boxSubView: {
    backgroundColor: '#00C897',
    borderRadius: 10,
    height: clickBoxHeight / 2 + 25,
    // flex: 1,
    borderRadius: 10,
    overflow:"hidden"
  },
  img: {
    // height:clickBoxHeight/2+20,
    width: '100%',
    height: '100%',
  },
});
