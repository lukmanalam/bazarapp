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
import { get } from 'react-native/Libraries/Utilities/PixelRatio';
import { Dropdown } from 'react-native-element-dropdown';


export default function ServiceDetails({ route, navigation }) {

  const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];

  const [value, setValue] = useState(null);

  const preData = route.params;

  const [oneVendor, setOneVendor] = useState({});
  const [visible, setVisible] = useState(false);
  const [indicator2, setIndicator2] = useState(false);
  const [rating, setRating] = useState([]);
  const [loading, setLoading] = useState(true);
  const [getRating, setGetRating] = useState(Number);
  const [comment, setComment] = useState('');
  const [commentSent, setCommentSent] = useState(false);
  const [indicator, setIndicator] = useState(false);
  const [isVisible2, setIsvisible2] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [defaultRating, setDefaultRating] = useState(0);
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();

  console.log("comment", commentList);

  useEffect(() => {
    getOneVendor();
    getCommentList();
    getCategories();
  }, []);

  const openDialer = () => {
    let number = oneVendor.phoneNo;
    if (Platform.OS === 'ios') {
      number = `telprompt:${number}`;
    } else number = `tel:${number}`;
    Linking.openURL(number);
  };

  const addToCart = async (id) => {
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    axios.post(`https://multivendor-apex.herokuapp.com/api/servicecart/add-service`, {
      serviceId: id
    }, {
      headers: {
        Authorization: parsed.token,

      }
    }).then(res => {
      alert("Successful")
    }).catch(error => {
      console.log(error)
    })
  }

  const buyService = async (id) => {
    const json_val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_val);
    axios.post(`https://multivendor-apex.herokuapp.com/api/servicecart/add-service`, {
      serviceId: id
    }, {
      headers: {
        Authorization: parsed.token,
      }
    }).then(res => {
      alert("Successful")
      navigation.navigate('MyCartService')
    }).catch(error => {
      console.log(error)
      navigation.navigate('MyCartService')
    })
  }
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

  const getCategories = () => {
    axios
      .get(`${API}/category`)
      .then(resp => {
        setCategoriesData(resp.data);
        console.log(resp.data)
      })
      .catch(err => {
        console.log('server error: ', err);
      });
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
    axios.patch(`${API_USER}/vendorreview`, ratingData, axiosConfig)
      .then(resp => {
        setIndicator2(false);
        setVisible(false);
        getOneVendor();
      })
      .catch(err => {
        setIndicator2(false);
        console.log("err", err);
        alert('Error from server. Please try again later');
      })
  };

  let COMMENT = {
    comment: comment,
    serviceId: preData._id,
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
      .post(`${API}/commentService`, COMMENT, axiosConfig)
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


  const getCommentList = async () => {
    const json_Val = await AsyncStorage.getItem("jwt");
    const parsed = JSON.parse(json_Val);
    let axiosConfig = {
      headers: {
        Authorization: parsed.token
      }
    };
    axios
      .get(`${API}/commentofservice/${preData._id}`, axiosConfig)
      .then(resp => {
        setCommentList(resp.data);
        console.log(resp.data);
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

  return (

    <View style={styles.container}>

      <ScrollView style={{ flexShrink: 0, marginBottom: 80 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: '#f0f0f3' }}>
          <CategoryHeader
            route={preData.title}
            back={() => navigation.goBack()}
            nav={() => navigation.navigate('Alert')}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: 'black', size: 20, fontWeight: '700', marginLeft: 20, marginBottom: 10 }}>Vendor Name</Text>

            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={categoriesData}
              search
              maxHeight={300}
              labelField="name"
              valueField="name"
              placeholder="Select item"
              searchPlaceholder="Search..."
              value={selectedCategory}
              onChange={item => {
                setSelectedCategory(item.value);
              }}
              renderLeftIcon={() => (
                <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
              )}
            />

          </View>
        </View>


        <View style={styles.banner}>
          <ImageSlider
            data={[{ img: preData.images }]}
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

                  {
                    preData.price !== 0 ?
                      <Text style={{ color: "gray", fontSize: 13, fontWeight: "600" }}>₹ {preData.price}/-</Text>
                      :
                      null
                  }
                </View>
                <Text style={{ color: '#000' }}>Vendor Details</Text>
                <View style={[styles.titleView, { marginVertical: 10 }]}>
                  <View style={{ alignItems: 'center' }}>
                    <Image style={styles.profile} source={{ uri: oneVendor.profileImg }} />
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
                  <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => setVisible(true)}
                      style={[styles.smCircle, { backgroundColor: '#f0bc43' }]}>
                      <FontAwesome name="star-o" color="#fff" size={20} />
                    </TouchableOpacity>
                    <Text style={{ color: '#000', fontSize: 12 }}>{getRating.toString().split('', 4)}/5</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                      style={[styles.smCircle, { backgroundColor: '#89f27c' }]}
                      onPress={openDialer}>
                      <Feather
                        name="phone-call"
                        color="#fff"
                        size={18}
                        style={{ marginBottom: -2, marginLeft: -2 }}
                      />
                    </TouchableOpacity>
                    <Text style={{ color: '#000', fontSize: 12 }}>Call</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                      style={[styles.smCircle, { backgroundColor: '#89f27c' }]}
                      onPress={_sendMsg}>
                      <Ionicons
                        name="chatbox-ellipses-outline"
                        color="#fff"
                        size={20}
                      />
                    </TouchableOpacity>
                    <Text style={{ color: '#000', fontSize: 12 }}>Chat</Text>
                  </View>
                </View>
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

        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={styles.cmntInput}
              placeholder="Write your comment..."
              placeholderTextColor="gray"
              value={comment}
              onChangeText={val => setComment(val)}
            />
            {indicator ? (
              <ActivityIndicator style={{ marginLeft: 5 }} size={24} />
            ) : (
              <TouchableOpacity
                onPress={_sendComment}
                disabled={comment !== '' ? false : true}
              >
                <MaterialCommunityIcons
                  name="send-circle"
                  color="#05e4ae"
                  size={44}
                />
              </TouchableOpacity>
            )}
          </View>
          {commentSent && commentMsg()}
        </View>
      </ScrollView>
      <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, width: '100%' }}>
        <TouchableOpacity onPress={() => addToCart(preData._id)} style={{ backgroundColor: '#f0f0f3', height: 55, width: '50%', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 30 }}>
          <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 18, }}>Add TO Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => buyService(preData._id)} style={{ backgroundColor: '#00C897', height: 55, width: '50%', alignItems: 'center', justifyContent: 'center', borderTopRightRadius: 30 }}>
          <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 18, color: 'white' }}>Book Appointment</Text>
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
    width: '100%',
    height: 160,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginTop: -10,
    overflow: 'hidden',
    borderBottomWidth: 0.2,
  },
  body: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //alignItems: 'center',
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
    width: '80%',
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
    backgroundColor: '#ffe4e1',
    padding: 5,
    borderRadius: 5,
  },
  cmntView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  // Drop Down
  dropdown: {
    marginBottom:16,
    width:200,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
