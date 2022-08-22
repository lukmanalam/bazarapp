import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useIsFocused} from '@react-navigation/native';

import CategoryHeader from './utils/CategoryHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height, width} = Dimensions.get('window');

export default function WishListScreen({navigation}) {
  const isFocused = useIsFocused();
  const [indicator, setIndicator] = useState(true);
  const [isData, setIsData] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  // console.log(wishlist);

  useEffect(() => {
    if (isFocused) {
      getWishlist();
    }
  }, [isFocused]);

  const getWishlist = async () => {
    const JsonList = await AsyncStorage.getItem('MyWishList');
    const listParsed = JSON.parse(JsonList);
    if (listParsed !== null) {
      if (listParsed.length === 0) {
        setIsData(false);
        setWishlist([]);
        setTimeout(() => {
          setIndicator(false);
        }, 2000);
      } else if (listParsed.length !== 0) {
        setWishlist(listParsed);
        setIsData(true);
        setTimeout(() => {
          setIndicator(false);
        }, 1500);
      }
    } else {
      setIndicator(false);
      setWishlist([]);
      setIsData(false);
      console.log('no data in wishlist');
    }
  };

  const _details = item => {
    navigation.navigate('ProductDetails', item);
  };

  return (
    <View style={styles.container}>
      <CategoryHeader
        route="Profile"
        back={() => navigation.goBack()}
        nav={() => navigation.navigate('Alert')}
      />
      <View style={styles.body}>
        <View style={{}}>
          <ScrollView
            style={{}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              marginTop: 40,
              paddingBottom: 150,
            }}>
            <Text
              style={{
                color: '#000',
                fontWeight: '600',
                fontSize: 16,
                marginBottom: 10,
              }}>
              Wishlist
            </Text>
            {indicator ? (
              <ActivityIndicator
                size={40}
                color="blue"
                style={{marginTop: 50}}
              />
            ) : !isData ? (
              <Text
                style={{
                  color: 'gray',
                  fontWeight: '500',
                  marginTop: 50,
                  textAlign: 'center',
                }}>
                No Data Found In Your Wishlist
              </Text>
            ) : (
              <View style={styles.mapContainer}>
                {wishlist.map(item => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.box}
                    activeOpacity={0.6}
                    onPress={() => _details(item)}>
                    {item.images.length === 0 ? (
                      <View style={styles.images}>
                        <Text
                          style={{
                            color: 'gray',
                            fontSize: 12,
                            marginTop: 30,
                            textAlign: 'center',
                          }}>
                          No image available
                        </Text>
                      </View>
                    ) : (
                      <Image
                        style={styles.images}
                        source={{uri: item.images[0]}}
                      />
                    )}
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
                    <View style={styles.enquire}>
                      <Text style={{color: '#000', fontSize: 10}}>Enquire</Text>
                      <EvilIcons name="arrow-right" color="#000" size={22} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  enquire: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  mapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  images: {
    height: width / 3.5,
    backgroundColor: '#00C897',
    width: '100%',
    borderRadius: 10,
  },
  box: {
    paddingBottom:10,
    width: '48%',
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
});
