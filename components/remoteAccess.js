import * as React from 'react';
import { VirtualizedList, TouchableOpacity, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';

async function loadList(url,list,setlist,setm) {
  await fetch(url)
    .then(response => response.json())
    .then(names => {
    names.forEach((item ) => {
      list.push(item)
    })
    }); 

 var blist = <Marker
            coordinate={{latitude: 44.78825,
            longitude: -122.4324}}
            title={"title"}
            description={"description"}
         />
  
  
   const newList = list.map((item) => {return item})

   const mList = list.map((item) => {
                      var newm = <Marker
                                  coordinate={{latitude: item.latitude, longitude: item.longitude}}
                                  title={item.key}
                                  description={"Airport"}
                                  />
                      return newm})
   setlist(newList);
   setm(mList)
}

async function streetView(url) {
  const response = await fetch(url)
}

async function saveList(url, list) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(list)
    };
    const response = await fetch(url, requestOptions);
}

export {loadList}
export {saveList}
export {streetView}