import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
} from 'react-native';

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

  const TownListComponent = townList.map((item, i) => {
    const styleItem = [styles.town]
    selectedTown === item ? styleItem.push(styles.townSelected) : ''
    return (
      <Text
        key={i}
        style={styleItem}
        className="town-item"
        onPress={() => { setSelectedTown(item) }}
      >{item}</Text>
    )
  }
  )

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', marginTop: 50 }}>
      <Text style={styles.title}>
        Tu viens d'où ? {selectedTown}</Text>

      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => onChangeText(text)}
        value={search}
        placeholder={'Votre ville ?'}
      />
      {TownListComponent}
    </View>
  )
}


const styles = StyleSheet.create({
  title: {
    color: '#5571D7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  town: {
    backgroundColor: 'yellow'
  },
  townSelected: {
    backgroundColor: 'blue'
  },
})