import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import Foundation from "react-native-vector-icons/Foundation";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import PushNotification from "react-native-push-notification";

import HomeStack from "./stackNavigator/HomeStack";
import ProductStack from "./stackNavigator/ProductStack";
import ChatStack from "./stackNavigator/ChatStack";
import ServiceStack from "./stackNavigator/ServiceStack";



const Tab = createBottomTabNavigator();

export default function VendorPanel({navigation}){

    useEffect(()=>{
        createChannels();
    },[]);

    const createChannels=()=>{
        PushNotification.createChannel({
            channelId: "custom_product",
            channelName: "Custom Product"
        })
    };

    const getTabBarVisibility=(route)=>{
        const routeName = getFocusedRouteNameFromRoute(route);
        if(routeName === "ChatRoom"){
            return "none";
        }
        return "flex";
    };

    return(
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: styles.bottomTab,
            tabBarHideOnKeyboard: true
        }}
        >
            <Tab.Screen name="Home"
                component={HomeStack}
                options={{
                    tabBarIcon: ({focused})=>(
                        <View style={[styles.default2,focused && styles.active]}>
                            <Feather name="codesandbox" color={focused?"#fff":"#000"} size={26} />
                            <Text style={{fontSize:12,color:focused?"#fff":"#000"}}>Home</Text>
                        </View>
                    )
                }}
            />
            <Tab.Screen name="MyProduct"
                component={ProductStack}
                options={({route})=>({
                    tabBarStyle: [styles.bottomTab,{display: getTabBarVisibility(route)}],
                    tabBarIcon: ({focused})=>(
                        <View style={[styles.default2,focused && styles.active]}>
                            <Foundation name="clipboard-notes" color={focused?"#fff":"#000"} size={26} />
                            <Text style={{fontSize:12,color:focused?"#fff":"#000"}}>Products</Text>
                        </View>
                    )
                })}
            />
            <Tab.Screen name="MyService"
                component={ServiceStack}
                options={({route})=>({
                    tabBarStyle: [styles.bottomTab,{display: getTabBarVisibility(route)}],
                    tabBarIcon: ({focused})=>(
                        <View style={[styles.default2,focused && styles.active]}>
                            <MaterialIcons name="miscellaneous-services" color={focused?"#fff":"#000"} size={26} />
                            <Text style={{fontSize:12,color:focused?"#fff":"#000"}}>Services</Text>
                        </View>
                    )
                })}
            />
            <Tab.Screen name="Chat"
                component={ChatStack}
                options={({route})=>({
                    tabBarStyle: [styles.bottomTab,{display: getTabBarVisibility(route)}],
                    tabBarIcon: ({focused})=>(
                        <View style={[styles.default2,focused && styles.active]}>
                            <Ionicons name="chatbox-ellipses-outline" color={focused?"#fff":"#000"} size={26} />
                            <Text style={{fontSize:12,color:focused?"#fff":"#000"}}>Chats</Text>
                        </View>
                    )
                })}
            />
        </Tab.Navigator>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee"
    },
    bottomTab: {
        backgroundColor: "#fff",
        elevation: 5,
        height: 80,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: "center",
        position:"absolute"
    },
    tabText: {
        color:"#000",
        fontSize:12
    },
    default: {
        flex: 1,
    },
    default2: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginVertical:5,
        marginHorizontal: 15,
        width: 80
        
    },
    active: {
        backgroundColor: "#05e4ae",
        borderRadius: 15
    }
})