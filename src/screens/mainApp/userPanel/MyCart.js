import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parse } from '@babel/core';
import { run } from 'jest';

import { API, API_USER } from "../../../../config";
import { ScrollView, TextInput } from 'react-native-gesture-handler';

export default function MyCart({ navigation }) {

    //contstant declare
    const [data, setData] = React.useState(null)
    const [token, setToken] = React.useState(null);

    const [name, setName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [img, setImg] = useState("");
    const [url, setUrl] = useState("");

    React.useEffect(() => {
        getToken()
        getData()
        getUser()
    }, [])

    // functon for get user
    const getUser = async () => {
        const json_Val = await AsyncStorage.getItem("jwt");
        const parsed = JSON.parse(json_Val);
        let axiosConfig = {
            headers: {
                Authorization: parsed.token
            }
        };
        axios.get(`${API_USER}/userdetail`, axiosConfig)
            .then(res => {
                setPhoneNo(res.data.phoneNo);
                setName(res.data.name);
                setUrl(res.data.profileImg);
                setAddress(res.data.address);
                setEmail(res.data.email);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    };

    //increase quantity integration
    const decreaseItem = async (id, quantity) => {
        try {
            const Json = await AsyncStorage.getItem('jwt');
            const Parsed = JSON.parse(Json);
            setToken(Parsed.token)
            if (Parsed !== null) {
                let new_qauntity = 1
                await axios.post(`https://multivendor-apex.herokuapp.com/api/cart/decrease-quantity`, {
                    productId: id,
                    quantity: new_qauntity
                }, {
                    headers: {
                        Authorization: Parsed.token
                    }
                }).then(res => {
                    alert("decreased")
                    getData()
                }).catch(error => {
                    console.log(error)
                })
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const increaseItem = async (id, quantity) => {
        try {
            const Json = await AsyncStorage.getItem('jwt');
            const Parsed = JSON.parse(Json);
            setToken(Parsed.token)
            if (Parsed !== null) {
                let new_qauntity = 1
                await axios.post(`https://multivendor-apex.herokuapp.com/api/cart/increase-quantity`, {
                    productId: id,
                    quantity: new_qauntity
                }, {
                    headers: {
                        Authorization: Parsed.token
                    }
                }).then(res => {
                    alert("increase")
                    getData()
                }).catch(error => {
                    console.log(error)
                })
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    //payment api integration
    const confirmOrder = async () => {
        try {
            const Json = await AsyncStorage.getItem('jwt');
            const Parsed = JSON.parse(Json);
            setToken(Parsed.token)
            if (Parsed !== null) {
                await axios.post(`https://multivendor-apex.herokuapp.com/api/order/confirmorder`, {
                    shippingAddress: address
                }, {
                    headers: {
                        Authorization: Parsed.token
                    }
                }).then(res => {
                    alert("Order confirmed")
                    getData()
                }).catch(error => {
                    console.log(error)
                })
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    //delete api integration
    const deleteItem = async (id) => {
        try {
            const Json = await AsyncStorage.getItem('jwt');
            const Parsed = JSON.parse(Json);
            setToken(Parsed)
            await axios.delete(`https://multivendor-apex.herokuapp.com/api/cart/delete-item`,
                {
                    headers: {
                        "Authorization": Parsed.token
                    },
                    data:

                    {
                        productId: id
                    }
                }).then(res => {
                    alert("Removed product")
                    getData()
                    console.log(res)
                }).catch(error => {
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        }
    }

    // 
    const getToken = async () => {
        try {
            const Json = await AsyncStorage.getItem('jwt');
            const Parsed = JSON.parse(Json);
            setToken(Parsed);
        } catch (e) {
            console.log('Token Error: ', e);
        }
    }

    const getData = async () => {
        console.log(token)
        try {
            const Json = await AsyncStorage.getItem('jwt');
            const Parsed = JSON.parse(Json);
            setToken(Parsed.token)
            if (Parsed !== null) {
                await axios.get(`https://multivendor-apex.herokuapp.com/api/cart`, {
                    headers: {
                        Authorization: Parsed.token
                    }
                }).then(res => {
                    setData(res.data.data)
                    console.log(res.data.data)
                }).catch(error => {
                    console.log(error)
                })
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    return (
        <View style={{ flexDirection: 'column', height: '100%' }}>

            <View style={{ flexShrink: 0, marginBottom: 80 }}>
                <ScrollView>
                    <View style={{ marginTop: 40, marginLeft: 20, marginRight: 20 }}>
                        <Text style={{ fontWeight: '700', color: '#535365', fontSize: 20 }}>Delivery To</Text>
                    </View>

                    <View style={{ marginTop: 15, marginLeft: 20, marginRight: 20 }}>
                        <Text style={{ fontWeight: '500', fontSize: 17, color: '#000000' }}>
                            {name}
                        </Text>
                    </View>

                    <View style={{ marginLeft: 20, marginRight: 20 }}>
                        <Text style={{ color: '#000000', fontWeight: '500' }}>
                            {address}
                        </Text>
                    </View>

                    <View style={{ marginLeft: 20, marginRight: 20 }}>
                        <Text style={{ color: '#000000', fontWeight: '500' }}>
                            +91 {phoneNo}
                        </Text>
                    </View>

                    <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={{ padding: 6, borderRadius: 10, borderWidth: 1, borderColor: '#00C897', borderStyle: 'solid', width: 200 }}>
                            <Text style={{ color: '#00C897', textAlign: 'center', fontWeight: '700' }}>Change or Edit Address</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        data ? data.items.map(item =>
                            <View style={{ flexDirection: 'row', backgroundColor: 'white', padding: 20, marginTop: 20, borderRadius: 10, marginLeft: 20, marginRight: 20 }}>
                                <View style={{ flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <Image style={{ height: 100, width: 90, borderRadius: 10, marginBottom: 5 }} source={{ uri: item.images[0] }} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', borderColor: '#C4C4C4', borderWidth: 1, width: 90, height: 30 }}>
                                        <TouchableOpacity onPress={() => decreaseItem(item.productId, item.quantity)}>
                                            <Icon name="minus" color="red" />
                                        </TouchableOpacity>
                                        <Text style={{ color: 'black' }}>Qty : {item.quantity}</Text>
                                        <TouchableOpacity onPress={() => increaseItem(item.productId, item.quantity)}>
                                            <Icon name="plus" color="green" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    console.log(item.images[0])
                                }
                                <View style={{ marginLeft: 20 }}>
                                    <Text style={{ color: 'black', fontWeight: '700' }}>{item.name}</Text>
                                    {/* <View style={{ marginTop: 5, marginBottom: 5 }}>
                                <Text><Image style={{ height: 10, width: 10 }} source={require('../../../assets/clock.png')} /> Expiry Date 20 jul 2022</Text>
                            </View> */}
                                    <View style={{ margintTop: 5 }}>
                                        <Text style={{ color: 'black' }}>{item.ratings} <Image style={{ height: 10, width: 10 }} source={require('../../../assets/Star.png')} /></Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <Text style={{ marginRight: 20, color: 'black', fontSize: 20, fontWeight: '700' }}>₹ {item.discountedprice}</Text>
                                        <Text style={{ marginRight: 20, fontWeight: '700', textDecorationLine: 'line-through' }}>₹ {item.price}</Text>
                                        <TouchableOpacity style={{ backgroundColor: '#00C897', padding: 5, borderRadius: 5 }}>
                                            <Text style={{ color: 'white', fontWeight: '600' }}>{item.discount}% off </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{ color: '#00C897' }}>1 offer applied</Text>
                                    <Text style={{ color: 'black' }}>Delivery by 11AM, Tomorrow</Text>
                                    <TouchableOpacity onPress={() => deleteItem(item.productId)} style={{ alignItems: 'flex-end' }}>
                                        <Icon name="trash" color="black" size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                            : null
                    }

                    <View style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}>
                        <Text style={{ fontWeight: '700', fontSize: 20 }}>Price Details</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 20, marginTop: 10, marginLeft: 20 }}>
                        <Text style={{ color: 'black', fontWeight: '600', fontSize: 12 }}>Price(1item)</Text>
                        <Text style={{ color: 'black', fontWeight: '600', fontSize: 12 }}>₹ {data ? data.subTotal : null}</Text>
                    </View>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 20, marginLeft: 20 }}>
                <Text style={{ color: 'black', fontWeight: '600', fontSize: 12 }}>Discount</Text>
                <Text style={{ color: '#00C897', fontWeight: '600', fontSize: 12 }}>₹ -144</Text>
            </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 20, marginLeft: 20 }}>
                        <Text style={{ color: 'black', fontWeight: '600', fontSize: 12 }}>Delivery Charge</Text>
                        <Text style={{ color: '#00C897', fontWeight: '600', fontSize: 12 }}>free</Text>
                    </View>
                    <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', marginRight: 20, marginLeft: 20, borderBottomColor: '#AEAEC066', borderTopColor: '#AEAEC066', borderBottomWidth: 1, borderTopWidth: 1 }}>
                        <Text style={{ color: 'black', fontWeight: '600', fontSize: 15 }}>Total Amount</Text>
                        <Text style={{ color: 'black', fontWeight: '600', fontSize: 15 }}>₹ {data ? data.subTotal : null}</Text>
                    </View>
                    <View style={{ marginRight: 20, marginLeft: 20, marginTop: 10 }}>
                        <Text style={{ color: '#00C897' }}>You will save 144 on this order</Text>
                    </View>
                </ScrollView>
            </View>

            <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, width: '100%', marginTop: 140 }}>
                <TouchableOpacity style={{ backgroundColor: '#FFFFFF', height: 55, width: '50%', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 30 }}>
                    <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 18, }}>Payable Amount: ₹ {data ? data.subTotal : null}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmOrder()} style={{ backgroundColor: '#00C897', height: 55, width: '50%', alignItems: 'center', justifyContent: 'center', borderTopRightRadius: 30 }}>
                    <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 18, color: 'white' }}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}