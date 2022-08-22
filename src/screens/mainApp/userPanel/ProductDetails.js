import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Linking,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import CategoryHeader from './utils/CategoryHeader';
import { API, API_USER, API_VENDOR } from '../../../../config';
import Rating from './utils/Rating';
import { ImageSlider } from './utils/img-slider';


export default function ProductDetails({ route, navigation }) {
  const preData = route.params;
  const IMAGES = [];
  preData.images.forEach(elemet => {
    var innerObj = { img: elemet };
    IMAGES.push(innerObj);
  });
  const [isVisible2, setIsvisible2] = useState(false);
  const [comment, setComment] = useState('');
  const [commentSent, setCommentSent] = useState(false);
  const [indicator, setIndicator] = useState(false);
  const [oneVendor, setOneVendor] = useState({});
  const [heartPressed, setHeartPressed] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [indicator2, setIndicator2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [getRating, setGetRating] = useState(Number);
  const [defaultRating, setDefaultRating] = useState(0);
  const [user, setUser] = useState();
  const [token, setToken] = useState();


  useEffect(() => {
    getToken();
    views();
    getOneVendor();
    getWishlist();
    getCommentList();
  }, []);

  const getToken = async () => {
    try {
      const Json = await AsyncStorage.getItem('jwt');
      const role = await AsyncStorage.getItem('userRole');
      const Parsed = JSON.parse(Json);
      setToken(Parsed);
      role === '0' ? setUser('user') : setUser('vendor');
      console.log('userDetail' + user)
    } catch (e) {
      console.log('Token Error: ', e);
    }
  };
  const addToCart = async (id) => {
    try {
      const Json = await AsyncStorage.getItem('jwt');
      const Parsed = JSON.parse(Json)
      axios.post(`https://multivendor-apex.herokuapp.com/api/cart/add-item`, { productId: id, quantity: 1 }, {
      headers: {
        Authorization: Parsed.token
      }
    }).then(res => {
      alert('Product added to cart')
      console.log(res)
    }).catch(error => {
      console.log(error)
    })

    } catch (error) {
      console.log(error)
    }
      };

  const buyToContinue = (id) => {
    axios.post(`https://multivendor-apex.herokuapp.com/api/cart/add-item`, { productId: id, quantity: 1 }, {
      headers: {
        Authorization: token.token
      }
    }).then(res => {
      navigation.navigate('MyCart')
      console.log(res)
    }).catch(error => {
      console.log(error)
    })
  };
  const openDialer = () => {
    let number = oneVendor.phoneNo;
    if (Platform.OS === 'ios') {
      number = `telprompt:${number}`;
    } else number = `tel:${number}`;
    Linking.openURL(number);
  };

  const views = async () => {
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
      headers: {
        Authorization: parsed.token
      }
    };
    console.log(axiosConfig);
    setTimeout(() => {
      axios
        .patch(`${API_USER}/products/views/${preData._id}`, {}, axiosConfig)
        .then(resp => {
          console.log('New view added: ', resp.data.products.views);
        })
        .catch(err => {
          console.log('Server error: ', err);
        });
    }, 2000)
  };

  // console.log(preData);

  const _sendMsg = async () => {
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
      headers: {
        Authorization: parsed.token
      }
    };
    let MESSAGE = {
      title: "title",
      query: "msg",
      productId: preData._id,
      vendorId: oneVendor._id,
    };
    axios
      .post(`${API}/contactvendors`, MESSAGE, axiosConfig)
      .then(resp => {
        console.log(resp.data);
        navigation.navigate("Chat");
      })
      .catch(err => {
        console.log('Error from server MSG: ', err);
      });
  };

  let COMMENT = {
    comment: comment,
    productId: preData._id,
    vendorId: preData.vendor,
  };
  const _sendComment = async () => {
    setIndicator(true);
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
      headers: {
        Authorization: parsed.token
      }
    };
    axios
      .post(`${API}/comment`, COMMENT, axiosConfig)
      .then(resp => {
        setIndicator(false);
        setCommentSent(true);
        getCommentList();
        console.log('Comment is Sent');
        setComment('');
      })
      .catch(err => {
        console.log('Error from server CMT: ', err);
      });
  };

  const commentMsg = () => {
    setTimeout(() => {
      setCommentSent(false);
    }, 5000);
    return (
      <Text style={{ color: 'green', fontSize: 12, textAlign: 'center' }}>
        Sent successfully
      </Text>
    );
  };

  const getOneVendor = () => {
    axios
      .get(`${API_VENDOR}/onevendordetail/${preData.vendor}`)
      .then(resp => {
        setLoading(false);
        setOneVendor(resp.data);
        setGetRating(resp.data.ratings);
        let f_id = resp.data._id.split('', 2);
        global.f_id = f_id;
      })
      .catch(err => {
        console.log('OneVendor Error: ', err);
        setLoading(false);
      });
  };

  const addWishList = async () => {
    setHeartPressed(!heartPressed);
    if (!heartPressed) {
      wishlist.push(preData);
      await AsyncStorage.setItem('MyWishList', JSON.stringify(wishlist));
    } else if (heartPressed) {
      const filterItem = wishlist.filter(item => item._id !== preData._id);
      await AsyncStorage.setItem('MyWishList', JSON.stringify(filterItem));
    }
  };

  const getWishlist = async () => {
    try {
      const listJSON = await AsyncStorage.getItem('MyWishList');
      const listParsed = JSON.parse(listJSON);
      if (listParsed !== null) {
        setWishlist(listParsed);
        var __FOUND = listParsed.find(function (item, index) {
          if (item._id == preData._id) return true;
        });
        __FOUND !== undefined ? setHeartPressed(true) : setHeartPressed(false);
      } else {
        setWishlist([]);
        setHeartPressed(false);
      }
    } catch (err) {
      console.log('error of getting wishlist', err);
    }
  };

  const getCommentList = async () => {
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
      headers: {
        Authorization: parsed.token
      }
    };
    axios
      .get(`${API}/commentofprod/${preData._id}`, axiosConfig)
      .then(resp => {
        setCommentList(resp.data);
        console.log('ok');
      })
      .catch(err => {
        console.log('server err: ', err);
      });
  };
  const showComment = () => (
    commentList.map(item => {
      return (
        <View style={styles.cmntView} key={item._id}>
          {item.customerId.profileImg ? (
            <Image
              style={styles.cmntCircle}
              source={{ uri: item.customerId.profileImg }}
            />
          ) : (
            <Image
              style={styles.cmntCircle}
              source={require('../../../assets/profile.png')}
            />
          )}
          <View style={{ width: '90%', alignItems: 'flex-start' }}>
            {item.customerId.name ? (
              <Text style={{ fontSize: 13, color: '#000' }}>
                {item.customerId.name}
              </Text>
            ) : (
              <Text style={{ fontSize: 13, color: '#000' }}>
                {item.customerId._id.split('', 10)}***
              </Text>
            )}
            <View style={styles.cmntBox}>
              <Text style={{ color: '#000', fontSize: 12 }}>
                {item.comment}
              </Text>
            </View>
          </View>
        </View>
      );
    }
    ));

  const toggle = () => {
    setVisible((visible) => !visible)
  };

  const _submitRating = async () => {
    setIndicator2(true);
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
      headers: {
        Authorization: parsed.token
      }
    };
    let ratingData = {
      rating: defaultRating,
      vendorId: oneVendor._id
    };
    console.log(ratingData);
    axios.patch(`${API_USER}/vendorreview`, ratingData, axiosConfig)
      .then(resp => {
        setIndicator2(false);
        setVisible(false);
        getOneVendor();
      })
      .catch(err => {
        console.log("err", err);
        alert('Error from server. Please try again later');
      })
  };

  return (
    <View style={styles.container}>

      <ScrollView style={{ flexShrink: 0, marginBottom: 80 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: '#f0f0f3' }}>
          <CategoryHeader
            route={preData.title}
            back={() => navigation.goBack()}
            nav={() => navigation.navigate('Alert')}
          />
        </View>
        <View style={styles.banner}>
          <ImageSlider
            data={IMAGES}
            autoPlay={true}
            closeIconColor="#fff"
            showIndicator={false}
            timer={5000}
          />
        </View>
        <View style={styles.body}>
          {
            loading ? <ActivityIndicator style={{ marginTop: 50 }} size={40} />
              :
              <>
                <TouchableOpacity
                  style={styles.absWishlist}
                  onPress={addWishList}
                  activeOpacity={1}>
                  <AntDesign
                    name={heartPressed ? 'heart' : 'hearto'}
                    color={heartPressed ? '#f008' : '#000'}
                    size={18}
                  />
                </TouchableOpacity>
                <View style={styles.titleView}>
                  <Text style={styles.title}>{preData.title}</Text>

                  {
                    preData.availstatus === true ?
                      <Text style={{ color: 'green', fontSize: 10, marginRight: 10 }}>Available</Text>
                      :
                      <Text style={{ color: 'red', fontSize: 10 }}>Not available</Text>
                  }
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: '#000', fontSize: 13, marginVertical: 10 }}>
                    {preData.description}
                  </Text>
                  <Text style={{ color: '#000', fontSize: 11, flexWrap: 'wrap' }}>
                    {preData.des}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    {
                      preData.discountedprice != preData.price ?
                        <Text style={{ color: "gray", fontSize: 13, fontWeight: "600", marginRight: 10, textDecorationLine: 'line-through' }}>{preData.price}</Text>
                        :
                        null
                    }
                    {
                      preData.discountedprice != preData.price ?
                        <Text style={{ color: "black", fontSize: 13, fontWeight: "600", marginRight: 10 }}>₹ {preData.discountedprice}</Text>
                        :
                        <Text style={{ color: "gray", fontSize: 13, fontWeight: "600", marginRight: 10 }}>{preData.price}</Text>
                    }
                    {
                      preData.discount != 0 ?
                        <Text style={{ color: "#00C897", fontSize: 13, fontWeight: "600" }}> {preData.discount}% off</Text>
                        :
                        null
                    }
                  </View>
                </View>
                {/* <Text style={{color: '#000'}}>Vendor Details</Text>
              <View style={[styles.titleView, {marginVertical: 10}]}>
                <View style={{alignItems: 'center'}}>
                  <Image style={styles.profile} source={{uri : oneVendor.profileImg}} />
                  {
                    oneVendor.name ? 
                    <Text
                    style={{
                      color: '#000',
                      fontSize: 12,
                      textTransform: 'capitalize',
                    }}>
                    {oneVendor.name}
                  </Text>
                  :
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 12,
                      textTransform: 'capitalize',
                    }}>
                    Vendor{global.f_id}**
                  </Text>
                  }
                </View>
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={()=>setVisible(true)}
                    style={[styles.smCircle, {backgroundColor: '#f0bc43'}]}>
                    <FontAwesome name="star-o" color="#fff" size={20} />
                  </TouchableOpacity>
                  <Text style={{color: '#000', fontSize: 12}}>{getRating.toString().split('',4)}/5</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity
                    style={[styles.smCircle, {backgroundColor: '#89f27c'}]}
                    onPress={openDialer}>
                    <Feather
                      name="phone-call"
                      color="#fff"
                      size={18}
                      style={{marginBottom: -2, marginLeft: -2}}
                    />
                  </TouchableOpacity>
                  <Text style={{color: '#000', fontSize: 12}}>Call</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity
                    style={[styles.smCircle, {backgroundColor: '#89f27c'}]}
                    onPress={_sendMsg}>
                    <Ionicons
                      name="chatbox-ellipses-outline"
                      color="#fff"
                      size={20}
                    />
                  </TouchableOpacity>
                  <Text style={{color: '#000', fontSize: 12}}>Chat</Text>
                </View>
              </View> */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    style={styles.cmntInput}
                    placeholder="Write your comment..."
                    placeholderTextColor="gray"
                    value={comment}
                    onChangeText={val => setComment(val)}
                  />
                  {indicator ? (
                    <ActivityIndicator style={{ marginLeft: 10 }} size={24} />
                  ) : (
                    <TouchableOpacity
                      onPress={_sendComment}
                      disabled={comment !== '' ? false : true}>
                      <MaterialCommunityIcons
                        name="send-circle"
                        color="#05e4ae"
                        size={44}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {commentSent && commentMsg()}
                <View style={{ alignItems: 'flex-start', marginTop: 10 }}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    activeOpacity={0.7}
                    onPress={() => setIsvisible2(!isVisible2)}>
                    <Text style={{ color: '#000', fontSize: 14, marginRight: 10 }}>
                      View Comments ({commentList.length})
                    </Text>
                    <AntDesign
                      name={isVisible2 ? 'up' : 'down'}
                      color="#000"
                      size={18}
                    />
                  </TouchableOpacity>
                </View>
                {isVisible2 && (
                  <>
                    {showComment()}
                  </>
                )}
              </>
          }
        </View>
        <Rating
          visible={visible}
          toggle={toggle}
          vendorName={oneVendor.name}
          indicator={indicator2}
          submitRating={_submitRating}
          defaultRating={defaultRating}
          setDefaultRating={setDefaultRating}
        />
      </ScrollView>

      <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, width: '100%' }}>
        <TouchableOpacity onPress={() => addToCart(preData._id)} style={{ backgroundColor: '#f0f0f3', height: 55, width: '50%', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 30 }}>
          <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 18, }}>Add TO Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => buyToContinue(preData._id)} style={{ backgroundColor: '#00C897', height: 55, width: '50%', alignItems: 'center', justifyContent: 'center', borderTopRightRadius: 30 }}>
          <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 18, color: 'white' }}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    alignSelf: 'center',
    width: '100%',
    height: 360,
    //padding: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f3',
    marginTop: -10,
    //overflow: 'visible',
    borderBottomWidth: 0.2,
    // elevation:5
  },
  body: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#000',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  profile: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'gray',
  },
  smCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cmntInput: {
    width: '85%',
    marginRight: 5,
    borderRadius: 35,
    paddingLeft: 15,
    color: '#000',
    backgroundColor: '#f0f0f3',
  },
  absWishlist: {
    position: 'absolute',
    right: 20,
    height: 30,
    width: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    top: -35,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cmntCircle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  cmntBox: {
    backgroundColor: '#f0f0f3',
    padding: 5,
    borderRadius: 5,
  },
  cmntView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  card: {
    backgroundColor: "#fff",
    minHeight: 160,
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
});
