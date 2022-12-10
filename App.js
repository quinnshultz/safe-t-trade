// import the necessary packages
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  VirtualizedList,
  TouchableOpacity,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Item } from './components/listItem.js';
import * as Location from 'expo-location';
import { loadList, saveList } from './components/remoteAccess';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { useWindowDimensions } from 'react-native';
import DialogInput from 'react-native-dialog-input';
import Geocoder from 'react-native-geocoding';

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
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  list: {
    flex: 20,
    paddingTop: 2,
    borderWidth: 5,
  },

  rowblock: {
    height: 80,
    width: 300,
    padding: 5,
    borderWidth: 5,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 5,
    padding: 0,
    paddingTop: 0,
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
  label: { flex: 0.2, fontSize: 22, padding: 5 },
});

// this is a non-used array passed to virtualized list.
var emptydata = [];
Geocoder.init('AIzaSyDqW8jK0xxnIRKTKXACxIK-q3UerQTiCsA');

// declare our Virtual List App object.
const MapList = () => {

  const safelocations = [{"key":"43.628768334205844 -116.20251998316142","selected":false,"longitude":-116.2025566,"latitude":43.62882},{"key":"dxb","selected":false,"longitude":55.3656728,"latitude":25.2531745},{"key":"Hyde Park, Boise, Idaho","selected":false,"longitude":-116.2033704,"latitude":43.6301392},{"key":"Ann Morison Park, Boise","selected":false,"longitude":-116.2151282,"latitude":43.6064899},{"key":"Camel's Back Park","selected":false,"longitude":-116.2023442,"latitude":43.634878},{"key":"Grove Plaza, Boise, Idaho","selected":false,"longitude":-116.2047199,"latitude":43.6148497},{"key":"333 North Mark Stall Place, Boise, Idaho","selected":false,"longitude":-116.3017096,"latitude":43.6075938},{"key":"Hyde Park, Boise, Idaho","selected":false,"longitude":-116.2033704,"latitude":43.6301392},{"key":"Ann Morison Park, Boise","selected":true,"longitude":-116.2151282,"latitude":43.6064899},{"key":"Camel's Back Park","selected":false,"longitude":-116.2023442,"latitude":43.634878},{"key":"Grove Plaza, Boise, Idaho","selected":false,"longitude":-116.2047199,"latitude":43.6148497},{"key":"333 North Mark Stall Place, Boise, Idaho","selected":false,"longitude":-116.3017096,"latitude":43.6075938}];

  // the state variables that keep our data available for the User Interface.
  const [list, setlist] = useState([]);
  const [autonav, setnav] = useState(true);
  const [ashowme, setshowme] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // var blist = (
  //   <Marker
  //     coordinate={{ latitude: 40.78825, longitude: -122.4324 }}
  //     title={'place1'}
  //     description={'description'}
  //   />
  // );

  // var mboise = (
  //   <Marker
  //     coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
  //     title={'place2'}
  //     description={'description'}
  //   />
  // );

  var mlist = [];

  const [markers, setMarks] = useState(mlist);

  //necessary functions for the <VirtualList> Component
  const getItemCount = (data) => list.length; // return the total number of items in the actual list.  Ignore data
  const getItem = (data, index) => list[index]; // ge,t an individual item from the actual data list. Ignore data

  // we can not just call loadList directly in here because 'VirtualList' is called over and over again.
  // this specific function is useful for accessing data objects beyond the component
  useEffect(() => {
    if (list.length == 0) {
      var urladdress =
        'https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=ssingler';
      const response = loadList(urladdress, list, setlist, setMarks);
    }
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
    
  }, [list]);
  //})

  // the following functions modify the data in the list.
  // read data from remote URL
  function loadSafeLocations() {
    var urladdress =
      'https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=ssingler';
    const response = loadList(urladdress, list, setlist);
  }

  function createItem() {
    var urladdress =
      'https://cs.boisestate.edu/~scutchin/cs402/codesnips/savejson.php?user=ssingler';
    const response = saveList(urladdress, list);
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

      .then((json) => {
        location = json.results[0].geometry.location;
        console.log(location);
        console.log(location);
        var newList = [
          {
            key: alocation,
            selected: false,
            longitude: location.lng,
            latitude: location.lat,
          },
        ];
        var amark = (
          <Marker
            coordinate={{ latitude: location.lat, longitude: location.lng }}
            title={alocation}
            description={'Airport'}
          />
        );
        newList = newList.concat(list);

        var marklist = markers.concat(amark);
        setlist(newList);
        setMarks(marklist);
      })
      .catch((error) => {
        alert("invalid location");
        console.warn(error)
      });
  }

  function currentLoc() {
    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = location.coords.latitude + " " + location.coords.longitude;
      addLocation(text);
    }
  }

  // go through the list and only copy non-selected elements.
  function delButton() {
    const newList = [];
    const newMarkList = [];
    list.forEach((item) => {
      if (!item.selected) {
        newList.push(item);
        // newMarkList.push(markers.find(({ key }) => key === item));
      }
    });
    setlist(newList);
    //setMarks(newMarkList);
  }

  // add a whole bunch of items to the list to show off virtualization.
  function explodeButton() {
    const newList = [];
    list.forEach((item) => {
      newList.push(item);
    });

    for (var i = 0; i < 10000; i++) {
      var anum = Math.random().toString(10).substring(0);
      var newitem = { key: 'obo ' + anum, selected: false };
      newList.push(newitem);
    }
    setlist(newList);
  }

  // this function is called to draw a single item inside of the virtual list
  const renderItem = ({ item, index }) => {
    const backgroundColor = item.selected ? 'black' : 'white';
    const color = item.selected ? 'white' : 'black';
    return (
      <Item
        item={item}
        onPress={() => {
          toggleList(index);
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  // mark list elements clicked on as selected or not selected.
  // TODO: Use this to create a modal
  function toggleList(aindex) {
    const newList = list.map((item, index) => {
      if (aindex == index) {
        if (item.selected) {
          item.selected = false;
        } else {
          if (autonav) {
            console.log(item.latitude);
            console.log(item.key);
            mapref.current.animateToRegion({
              latitude: item.latitude,
              longitude: item.longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            });
          }
          item.selected = true;
        }
      } else {
        item.selected = false;
      }
      return item;
    });
    setlist(newList);
  }

  // build the Virtual List User Interface - lets do it in blocks.

  // lay out the row of buttons.
  var buttonrow = (
    <View style={styles.rowblock}>
      <View style={styles.buttonContainer}>
        <Button style={styles.item} title="+" onPress={() => plusButton()} />
      </View>
    </View>
  );

  // lay out the virtual list element
  var avirtlist = (
    <VirtualizedList
      styles={styles.list}
      data={emptydata}
      initialNumToRender={4}
      renderItem={renderItem}
      keyExtractor={(item, index) => index}
      getItemCount={getItemCount}
      getItem={getItem}
    />
  );

  const mapref = React.createRef();
  const SCREEN_WIDTH = useWindowDimensions().width;
  const SCREEN_HEIGHT = useWindowDimensions().height;
  var smaps = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT / 2 };
  if (SCREEN_WIDTH > SCREEN_HEIGHT) {
    smaps = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT };
  }
  var mymap = (
    <MapView ref={mapref} style={smaps}>
      {markers}
    </MapView>
  );

  var alist = (
    <View style={styles.container}>
      {mymap}
      {buttonrow}
      {avirtlist}
      <DialogInput
        isDialogVisible={ashowme}
        title="Enter Address"
        message="Enter The Address To Add"
        submitInput={(inputText) => {
          setshowme(false);
          addLocation(inputText);
        }}
        closeDialog={() => {
          setshowme(false);
        }}>
        <Text>Something</Text>
      </DialogInput>
    </View>
  );

  var ablist = (
    <View style={styles.bcontainer}>
      <View>
        {buttonrow}
        {avirtlist}
        <DialogInput
          isDialogVisible={ashowme}
          title="Enter Address"
          message="Enter The Address To Add"
          submitInput={(inputText) => {
            setshowme(false);
            addLocation(inputText);
          }}
          closeDialog={() => {
            setshowme(false);
          }}>
          <Text>Something</Text>
        </DialogInput>
      </View>
      {mymap}
    </View>
  );

  if (SCREEN_WIDTH > SCREEN_HEIGHT) {
    return ablist;
  }
  return alist;
};

export default MapList;
