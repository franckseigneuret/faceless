import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  YellowBox,
} from 'react-native';

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export default function Geolocalisation(props) {

  const [townList, setTownList] = useState([])
  const [search, setSearch] = useState('')
  const [selectedTown, setSelectedTown] = useState(null)

  const onChangeText = async (search) => {
    setSearch(search)
    // console.log('-------')
    // console.log(search)
    // console.log('-------')

    // fetcher les villes dès qu'il y a plus de 2 caractères saisis dans le champs
    if (search.length > 2) {

      const uri = `https://api-adresse.data.gouv.fr/search/?q=${search}&type=municipality&autocomplete=1`
      // console.log(uri)
      const data = await fetch(uri)
      const body = await data.json()
      const townsAPI = body.features
      const townsApiName = []
      // console.log(townsAPI)
      townsAPI && townsAPI.map((town) => {
        townsApiName.push({
          label: town.properties.label,
          postcode: town.properties.postcode,
          coordinates: town.geometry.coordinates,
        })
      })

      setTownList(townsApiName)
    }
  }

  const TownListComponent = townList.map((item, i, arr) => {
    // console.log('i', townList)
    const styleItem = [styles.town]
    selectedTown === item ? styleItem.push(styles.townSelected) : ''
    arr.length - 1 === i ? styleItem.push(styles.lastItem) : ''
    return (
      <View style={styleItem}>
        <Text
          key={i}
          onPress={() => {
            setSelectedTown(item.label)
            setSearch(item.label)
            setTimeout(() => {
              setTownList([])
            }, 1000);
            props.getValueParent(item);
            // addTownStore(item)
          }}
        >{item.label} ({item.postcode})</Text>
      </View>
    )
  })

  return (
    <View style={styles.view}>
      <TextInput
        style={styles.chooseTown}
        onChangeText={text => onChangeText(text)}
        value={search}
        placeholder={'Votre ville ?'}
      />
      {
        TownListComponent.length > 0 && <View style={styles.townsList}>
          {TownListComponent}
        </View>
      }
      
    </View>
  )
}


const styles = StyleSheet.create({
  view: {
    paddingLeft: windowWidth/10,
    paddingRight: windowWidth/10,
  },
  chooseTown: {
    backgroundColor: '#FFCC99',
    paddingHorizontal: 15,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  townsList: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    overflow: 'hidden',
  },
  town: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#FFCC99',
    borderColor: 'gray',
    borderBottomWidth: 1,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  townSelected: {
    backgroundColor: '#e7b685'
  },
})