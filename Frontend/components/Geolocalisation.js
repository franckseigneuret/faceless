import colors from '../colors'
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Keyboard,
} from 'react-native';

import { Entypo } from '@expo/vector-icons';


const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export default function Geolocalisation(props) {

  const [townList, setTownList] = useState([])
  const [search, setSearch] = useState(props.lieu)
  const [selectedTown, setSelectedTown] = useState(null)

  useEffect(() => {
    setSearch(props.lieu)
  }, [props.lieu])

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
    const styleItem = [styles.town]
    selectedTown === item.postcode ? styleItem.push(styles.townSelected) : ''
    arr.length - 1 === i ? styleItem.push(styles.lastItem) : ''
    return (
      <View style={styleItem} key={i}>
        <Text
          onPress={() => {
            setSelectedTown(item.postcode)
            setSearch(item.label)
            setTimeout(() => {
              setTownList([])
            }, 500);
            props.getValueParent(item);
            Keyboard.dismiss()
          }}
        >{item.label} ({item.postcode})</Text>
      </View>
    )
  })

  return (
    <View style={styles.view}>
      <View style={styles.view2}>
        <TextInput
          style={[styles.chooseTown, props.large ? styles.chooseTownLarge : '']}
          onChangeText={text => onChangeText(text)}
          value={search}
          placeholder={'Votre ville ?'}
        />
        <Entypo name="cross" size={24} style={styles.delete} onPress={() => {
          setSearch('')
          props.getValueParent({})
        }} />
      </View>
      {
        TownListComponent.length > 0 && <View style={[styles.townsList, props.large ? styles.townsListLarge : '']}>
          {TownListComponent}
        </View>
      }
    </View>
  )
}


const styles = StyleSheet.create({
  view: {
    paddingLeft: windowWidth / 10,
    paddingRight: windowWidth / 10,
  },
  view2: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  delete: {
    color: colors.HavelockBlue,
  },
  chooseTown: {
    backgroundColor: colors.peachOrange,
    paddingHorizontal: 15,
    height: 40,
    minWidth: 120,
    maxWidth: 120,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  chooseTownLarge:{
    width: '90%',
    maxWidth: '90%',
  },
  townsList: {
    position: 'absolute',
    bottom: 40,
    left: 38,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    maxWidth: 120,
    overflow: 'hidden',
  },
  townsListLarge: {
    width: '100%',
    maxWidth: '95%',
    left: 42,
  },
  town: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderColor: 'gray',
    borderBottomWidth: 1,
    backgroundColor: colors.peachOrange,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  townSelected: {
    backgroundColor: colors.goldSand
  },
})