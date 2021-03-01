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
      const data = await fetch(uri)
      const body = await data.json()
      const townsAPI = body.features
      const townsApiName = []
      townsAPI && townsAPI.map((town) => {
        townsApiName.push(town.properties.label)
      })

      setTownList(townsApiName)
    }
  }

  const TownListComponent = townList.map((item, i, arr) => {
    const styleItem = [styles.town]
    selectedTown === item ? styleItem.push(styles.townSelected) : ''
    arr.length - 1 === i ? styleItem.push(styles.lastItem) : ''
    return (
      <View style={styleItem}>
        <Text
          key={i}
          onPress={() => {
            setSelectedTown(item)
            setSearch(item)
          }}
        >{item}</Text>
      </View>
    )
  })

  return (
    <View style={styles.container}>
      {/* <ScrollView style={styles.scrollView}> */}
        <Text style={styles.title}>
          Tu viens d'où ?</Text>

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
      {/* </ScrollView> */}
    </View>
  )
}


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'yellow',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF1E2',
    alignItems: 'center',
    paddingTop: windowHeight/4, // bof, problem scrollView
  },
  title: {
    color: '#5571D7',

    fontWeight: 'bold',
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 22,
    marginBottom: 20,
  },
  chooseTown: {
    backgroundColor: '#FFCC99',
    paddingHorizontal: 15,
    height: 40,
    width: 300,
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
    width: 300,
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