import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import ChatScreen from "./ChatScreen";
import MenuStack from "./stackNavigator/MenuStack";
import ProfileStack from "./stackNavigator/ProfileStack";
import SearchStack from "./stackNavigator/SearchStack";


const { height, width } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

export default function UserPanel(){

    const getTabBarVisibility=(route)=>{
        const routeName = getFocusedRouteNameFromRoute(route);
        if(routeName === "EditProfile"){
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
            <Tab.Screen name="Menu"
                component={MenuStack}
                options={{
                    tabBarIcon: ({focused})=>(
                        <View style={{flex:1,width:width/4,justifyContent:"center"}}>
                            <View style={[styles.btn1_inActiveStyle, focused && styles.btn1_activeStyle]}>
                                <AntDesign name="menufold" color={focused?"#fff":"#000"} size={26} style={focused && {right:-10}} />
                                <Text style={[{fontSize:12,color:"#000"},focused && {color:"#fff",right:-10}]}>Home</Text>
                            </View>
                        </View>
                    )
                }}
            />
            <Tab.Screen name="Search"
                component={SearchStack}
                options={{
                    tabBarIcon: ({focused})=>(
                        <View style={[styles.btn2_inActiveStyle, focused && styles.btn2SubView]}>
                            <Feather name="search" color={focused?"#fff":"#000"} size={26} />
                            <Text style={{fontSize:12,color:focused?"#fff":"#000"}}>Search</Text>
                        </View>
                    )
                }}
            />
            <Tab.Screen name="Chat"
                component={ChatScreen}
                options={{
                    tabBarIcon: ({focused})=>(
                        <View style={[styles.btn2_inActiveStyle, focused && styles.btn2SubView]}>
                            <Ionicons name="chatbox-ellipses-outline" color={focused?"#fff":"#000"} size={26} />
                            <Text style={{fontSize:12,color:focused?"#fff":"#000"}}>Chats</Text>
                        </View>
                    )
                }}
            />
            <Tab.Screen name="ProfileStack"
                component={ProfileStack}
                options={({route})=>({
                    tabBarStyle: [styles.bottomTab,{display: getTabBarVisibility(route)}],
                    tabBarIcon: ({focused})=>(
                        <View style={{flex:1,width:width/4,justifyContent:"center"}}>
                            <View style={[styles.btn4_inActiveStyle, focused && styles.btn4_activeStyle]}>
                                <Ionicons name="person-outline" color={focused?"#fff":"#000"} size={24} style={focused && {left:-10}} />
                                <Text style={[{fontSize:12,color:"#000"},focused && {color:"#fff",left:-10}]}>Account</Text>
                            </View>
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
        backgroundColor: "#fff"
    },
    bottomTab: {
        backgroundColor: "#fff",
        elevation: 5,
        height: 80,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: "center",
        position:"absolute",
        // flex:1
    },
    btn1_activeStyle: {
        backgroundColor:"#05e4ae",
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        paddingVertical:5
    },
    btn1_inActiveStyle: {
        // flex:1,
        // height:50,
        justifyContent:"center",
        alignItems:"center",
        // backgroundColor:"gray"
    },
    btn4_activeStyle: {
        backgroundColor:"#05e4ae",
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        paddingVertical:5
    },
    btn4_inActiveStyle: {
        // flex:1,
        // height:50,
        justifyContent:"center",
        alignItems:"center",
    },
    btn2_inActiveStyle: {
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    btn2SubView: {
        backgroundColor:"#05e4ae",
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        // width:50,
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
        paddingHorizontal:5
    }
})