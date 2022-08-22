import React from "react";
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from "react-native-vector-icons/Entypo";


export default function MenuHeader({alert,LOCATION,U_NAME,expand,SET_Expand,isU_Name,ready}){

    return(
        <View>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={{flexDirection:"row",alignItems:"flex-start"}}
                    activeOpacity={0.8}
                    onPress={SET_Expand}
                >
                    <EvilIcons name="location" color="#000" size={24} />
                    {
                        !ready ?
                        <ActivityIndicator style={{marginHorizontal:20}} />
                        :
                        expand 
                        ? 
                        <View>
                            <Text style={styles.text1}>{U_NAME}</Text>
                            <Text style={styles.text2}>{LOCATION}</Text>
                        </View>
                        :
                        <View>
                            {
                                isU_Name ? 
                                <Text style={styles.text3}>{U_NAME}</Text>
                                :
                                <Text style={styles.text4}>{LOCATION}</Text>
                            }
                        </View>
                    }
                    <Entypo 
                        name={expand ? "chevron-thin-up" : "chevron-thin-down"} 
                        color="#000" 
                        style={{marginTop:2}} size={16} 
                    />
                </TouchableOpacity>
                <Fontisto name="bell" color="#000" size={24} onPress={alert} />
            </View>         
        </View>
    )
};
const styles = StyleSheet.create({
    header: {
        marginTop: 30,
        marginBottom:10,
        marginHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    circle: {
        height:80,
        width:80,
        borderRadius:80/2,
        backgroundColor:"gray",
    },
    name: {
        color:"#000",
        fontSize:10,
        marginTop:5,
        textTransform: "capitalize"
    },
    heading: {
        fontWeight:"bold",
        color:"#000",
        fontSize:16,
        marginBottom:10
    },
    text1: {
        color:"#000",
        fontSize:12,
        marginLeft:10,
        fontWeight:"600",
        letterSpacing:1,
        textTransform: 'capitalize'
    },
    text2: {
        color:"#000",
        fontSize:12,
        marginLeft:10,
        fontWeight:"600"
    },
    text3: {
        color:"#000",
        fontSize:12,
        marginHorizontal:10,
        fontWeight:"600",
        letterSpacing:1,
        textTransform: 'capitalize'
    },
    text4: {
        color:"#000",
        fontSize:12,
        marginHorizontal:10,
        fontWeight:"600"
    }
})