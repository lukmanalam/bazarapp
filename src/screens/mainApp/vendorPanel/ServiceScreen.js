import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useIsFocused} from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, API_VENDOR } from '../../../../config';
import Header from './utils/header';



export default function Services() {
    
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      getVendor_Service();
    }
  }, [isFocused]);

  const getVendor_Service=async()=>{
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
        headers:{
            Authorization: parsed.token
        }
    };
    axios.get(`${API_VENDOR}/vendordetail`,axiosConfig)
    .then(async res=>{
      setServiceData(res.data.services);
      setLoading(false);
    })
    .catch(err=>{
      console.log(err);
      setLoading(false);
    })
  };

  return (
    <View style={styles.container}>
      <Header
        isBack={false}
        back={()=>navigation.goBack()}
        title="Services"
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
              <Text style={styles.subTitle}>My Services</Text>
              <AntDesign name="down" size={16} color="#000" />
            </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('addServiceScreen')}>
                <Text style={{color: '#000', fontSize: 12}}>+Add Service</Text>
                <View style={{width: 90, borderWidth: 0.5, borderColor: '#000'}} />
              </TouchableOpacity>
          </View>
        }
        <>
          {loading ? (
            <View style={{height:"70%",justifyContent:"center"}}>
              <ActivityIndicator size={40} />
            </View>
          ) : serviceData.length === 0 ? (
            <Text style={{color: '#000', marginTop: 40, textAlign: "center"}}>No Service found</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
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
          </ScrollView>
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
  img: {
    // height:clickBoxHeight/2+20,
    width: '100%',
    height: '100%',
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
  subView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginVertical: 15,
    justifyContent: 'space-between',
  },
});
