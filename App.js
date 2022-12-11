// import the necessary packages
import React, {useState,useEffect, Component} from 'react';
import {Alert, Dimensions, VirtualizedList, TouchableOpacity, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import {loadList,saveList,streetView} from './components/remoteAccess'
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import { useWindowDimensions } from 'react-native';
import DialogInput from 'react-native-dialog-input';
import Geocoder from 'react-native-geocoding'
import * as Location from 'expo-location';

// create a style sheet for handling visual appearances, spacing, widths, and colors
const styles = StyleSheet.create({
  container: {
   /*flex: 4,
   paddingTop: 22,
   flexDirection: "column",
   borderWidth: 5*/
   flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  bcontainer: {
   /*flex: 4,
   paddingTop: 22,
   flexDirection: "column",
   borderWidth: 5*/
   flexDirection: "row",
   flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  list: {
   flex: 20,
   paddingTop: 2,
   borderWidth: 5,
   borderWidth: 5,
  },
  
  rowblock: {
    height: 80,
    width: 335,
    padding: 7,
    borderWidth: 5,
  },
  buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      padding: 0,
      paddingTop: 0
  },
   
  map:  {width: Dimensions.get('window').width, height: Dimensions.get('window').height/2},
  label:{ flex: 0.2, fontSize: 22, padding: 5}
});

const itemstyles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
  item: {
    fontSize: 10,
    padding: 3,
    height: 39,
  },
});

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[itemstyles.item, backgroundColor]}>
    <Text style={[itemstyles.title, textColor]}>{item.key}</Text>
    
  </TouchableOpacity>
);

// this is a non-used array passed to virtualized list.
var emptydata = [];
Geocoder.init("AIzaSyDqW8jK0xxnIRKTKXACxIK-q3UerQTiCsA");

var lat1 = 43.52840579999999
var long1 = -116.1115555


// declare our Virtual List App object.
const MapList = () => {

    const safelocations = [{"key":"Hyde Park, Boise, Idaho","selected":false,"longitude":-116.2033704,"latitude":43.6301392},{"key":"Ann Morison Park, Boise","selected":false,"longitude":-116.2151282,"latitude":43.6064899},{"key":"Camel's Back Park","selected":false,"longitude":-116.2023442,"latitude":43.634878},{"key":"Grove Plaza, Boise, Idaho","selected":false,"longitude":-116.2047199,"latitude":43.6148497},{"key":"333 North Mark Stall Place, Boise, Idaho","selected":false,"longitude":-116.3017096,"latitude":43.6075938},{"key":"Hyde Park, Boise, Idaho","selected":false,"longitude":-116.2033704,"latitude":43.6301392},{"key":"Ann Morison Park, Boise","selected":true,"longitude":-116.2151282,"latitude":43.6064899},{"key":"Camel's Back Park","selected":false,"longitude":-116.2023442,"latitude":43.634878},{"key":"Grove Plaza, Boise, Idaho","selected":false,"longitude":-116.2047199,"latitude":43.6148497},{"key":"333 North Mark Stall Place, Boise, Idaho","selected":false,"longitude":-116.3017096,"latitude":43.6075938}];

    const dummyItems = [{'key': 'Car'}, {'key': 'truck'}, {'key': 'sofa'}]
    
    // the state variables that keep our data available for the User Interface.
    const [list, setlist] = useState([]);
    const [autonav,setnav] = useState(true);
    const [ashowme,setshowme] = useState(false);

  
    const [markers,setMarks] = useState();

    //necessary functions for the <VirtualList> Component
    const getItemCount = (data) => list.length;  // return the total number of items in the actual list.  Ignore data
    const getItem = (data, index) => (list[index]); // ge,t an individual item from the actual data list. Ignore data 




// we can not just call loadList directly in here because 'VirtualList' is called over and over again.    
// this specific function is useful for accessing data objects beyond the component
    
    useEffect(() => {
   
      if (list.length == 0)
      {
        const mList = safelocations.map((item) => {
                      var newm = <Marker
                                  coordinate={{latitude: item.latitude, longitude: item.longitude}}
                                  title={item.key}
                                  description={"Airport"}
                                  />
                      return newm})
        setMarks(mList)
        setlist(dummyItems)
        //var urladdress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=humzzamap"
        //const response = loadList(urladdress,list,setlist,setMarks)
      }
     
    }, [list])
    //})

  

    // the following functions modify the data in the list.
    // read data from remote URL
    function loadButton() {
        var urladdress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=humzzamap"
        const response = loadList(urladdress,list,setlist)
    }

    function saveButton() {
        var urladdress = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/savejson.php?user=humzzamap"
        const response = saveList(urladdress,list)

    }


   
    
    // add a new item to the list.
    function plusButton() {
      setshowme(true);
    }
   
    function addLocation(alocation) { 
      // lets put our item at the front of the list
      //var aloc = Geocoder.from("Boise Idaho, USA");
      
      var location = {};
      
      Geocoder.from(alocation)
       
		.then(json => {
			location = json.results[0].geometry.location;
            var newList = [{key: alocation, selected: false, longitude: location.lng, latitude: location.lat }]
      var amark = <Marker
                        coordinate={{latitude: location.lat, longitude: location.lng}}
                                  title={alocation}
                                  description={"Location"}
                                  />
      newList = newList.concat(list)
      
      var marklist = markers.concat(amark);
      setlist(newList);
      setMarks(marklist);
    })
		.catch(error => console.warn(error));

    
    }

    function currentLocation() {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      var location = await Location.getCurrentPositionAsync({});

      var newList = [{key: "Current Location", selected: false, longitude: location.coords.longitude, latitude: location.coords.latitude }]
      var amark = <Marker
                        coordinate={{latitude: location.coords.latitude, longitude: location.coords.longitude}}
                                  title={"Current Location"}
                                  description={"Location"}
                                  />
      newList = newList.concat(list)
      
      var marklist = markers.concat(amark);
      setlist(newList);
      setMarks(marklist);
    })();
       
       /*Geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords;
            var newList = [{key: "Current Location", selected: false, longitude: crd.longitude, latitude: crd.latitude }]
      var amark = <Marker
                        coordinate={{latitude: crd.latitude, longitude: crd.longitude}}
                                  title={alocation}
                                  description={"Location"}
                                  />
      newList = newList.concat(list)
      
      var marklist = markers.concat(amark);
      setlist(newList);
      setMarks(marklist);
    }).catch((err) => {
      console.log(err);
    }); */
  }

      function streetViewButton() {
        var selecteds = [false]
        var newList = list.filter(function(item){
          return selecteds.indexOf(item.selected) > -1;
        });
        console.log(lat1)
        console.log(long1)
        var urladdress = 'http://mec402.boisestate.edu/cs402/lumin.php?app=street&cmd=set&address={"lat": ' + lat1+ ', "lng": ' + long1 + '}'
        console.log(urladdress)
        const response = streetView(urladdress);
        streetViewBool = true
        return;
      }

      function delButton() {
        var selecteds = [false]
        var markList = []
        var newList = list.filter(function(item){
          return selecteds.indexOf(item.selected) > -1;
        });
        list.forEach((item) => {
          if (!item.selected) {
                      Geocoder.from(item.key)
        
      .then(json => {
        location = json.results[0].geometry.location;
                  var amark = <Marker
                          coordinate={{latitude: location.lat, longitude: location.lng}}
                                    title={item.key}
                                    description={"Location"}
                                    />
            
            markList.push(amark);
          })
      }})
        setlist(newList);
        setMarks(markList);
    } 
 
 // this function is called to draw a single item inside of the virtual list
    const renderItem = ({ item,index }) => {
        const backgroundColor = item.selected ? 'black' : 'white';
         const color = item.selected ? 'white' : 'black';
             return (
      <Item item={item} onPress={() => {toggleList(index)}}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
    };

    function toggleList(aindex){
  
      const newList = list.map((item,index) => {    
        if (aindex == index)
        {
          if (item.selected)
          {
            item.selected = false;
          }
          else
          {
            if (autonav)
            {
            mapref.current.animateToRegion({latitude: item.latitude, longitude: item.longitude, latitudeDelta: 0.1, longitudeDelta: 0.1});
            lat1 = item.latitude
            long1 = item.longitude
            }
            item.selected = true;
          }
          
        } else {
          item.selected = false;
        }
        
        return item;
      })
      setlist(newList);

    }

   // build the Virtual List User Interface - lets do it in blocks.

   // lay out the row of buttons.
   var buttonrow = <View style={styles.rowblock} >
              <View style={styles.buttonContainer}>
               <Button style={styles.item} title="Add" onPress={() => plusButton()}  />
               <Button title="Delete" onPress={() => delButton()}/>
              <Button title="Load" onPress={() => loadButton()}/>
              <Button title="Save" onPress={() => saveButton()}/>
              <Button title="StrtView" onPress={() => streetViewButton()}/>
              </View>
              </View>

   // lay out the virtual list element
   var avirtlist =<VirtualizedList styles={styles.list}
        data={emptydata}
        initialNumToRender={4}
        renderItem={renderItem}
        keyExtractor={(item,index) => index}
        getItemCount={getItemCount}
        getItem={getItem}
      />

  const mapref = React.createRef();
  const SCREEN_WIDTH = useWindowDimensions().width;
  const SCREEN_HEIGHT = useWindowDimensions().height;
    var smaps = {width: SCREEN_WIDTH, height: SCREEN_HEIGHT/2}
  if (SCREEN_WIDTH > SCREEN_HEIGHT)
  {
    smaps = {width: SCREEN_WIDTH, height: SCREEN_HEIGHT}

  }
  var mymap=<MapView ref={mapref} style={smaps} >
             {markers} 
            </MapView >

   var alist=<View style={styles.container} >
      {mymap}
     {buttonrow}
      {avirtlist} 
      <DialogInput isDialogVisible={ashowme} 
          title="Enter Address"
          message="Enter The Address To Add"
          submitInput={ (inputText) =>{setshowme(false); addLocation(inputText)}}
          closeDialog={() => {setshowme(false)}}
          >
      <Text>Something</Text>
      </DialogInput>
      </View>

   var ablist=<View style={styles.bcontainer} >
     <View >
     {buttonrow}
      {avirtlist} 
      <DialogInput isDialogVisible={ashowme} 
          title="Enter Address"
          message="Enter The Address To Add"
          submitInput={ (inputText) =>{setshowme(false); addLocation(inputText)}}
          closeDialog={() => {setshowme(false)}}
          >
      <Text>Something</Text>
      </DialogInput>
      </View >
      {mymap}
      </View>


  if (SCREEN_WIDTH > SCREEN_HEIGHT)
  {
    return ablist;
  }    
  return (alist)
 

 
}

 

export default MapList;