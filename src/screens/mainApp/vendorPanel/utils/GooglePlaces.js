import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from '../../../../../config';


export default function GooglePlaces({setLOCATION,setLAT_LONG,LOCATION,setPROGRESS,isPROGRESS,preAddress}) {


  return (
    <GooglePlacesAutocomplete
        placeholder='Service location...'
        fetchDetails={true}
        onPress={(data, details = null) => {
            setLOCATION(data.description);
            setLAT_LONG(details.geometry.location);
            if(isPROGRESS){
                setPROGRESS(false);
            }
        }}
        query={{
            key: GOOGLE_MAPS_APIKEY,
            language: 'en',
            components: 'country:IN'
        }}
        textInputProps={{
            placeholderTextColor:"gray",
            value:LOCATION,
            onChangeText:(val)=>{
                setLOCATION(val);
                if(isPROGRESS){
                    setPROGRESS(true);
                }
            },
            style:{backgroundColor:"#eee",borderRadius:5,width:"100%",color:"#000",paddingLeft:10}
        }}
        styles={{
            textInputContainer: {
                width:"100%",
                borderRadius:5,
                backgroundColor:"#ffe4e1"
            },
            textInput: {
                // height: 160,
                fontSize:16,
                color:"#000",
                borderRadius:5
            },
            predefinedPlacesDescription: {
                color: '#000',
            },
            poweredContainer: {
                justifyContent: 'flex-end',
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5,
                borderColor: '#c8c7cc',
                borderTopWidth: 0.5,
            },
            row: {
                backgroundColor: '#fff',
                padding: 13,
                height: 44,
                flexDirection: 'row',
            },
            container: {
                width:"90%",
            },
            description:{
                color:"#000"
            },
        }}
    />
  )
}