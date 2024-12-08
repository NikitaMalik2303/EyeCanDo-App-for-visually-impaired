import BackButton from '@/components/button/BackButton'
import { GetCommunityDetails } from '@/services/auth.services'
import { HeaderContainer, HeaderNavigation, HeaderTitle, SafeAreaView } from '@/styles/dashbaord.styles'
import { ContactsList, SearchInput } from '@/styles/directory.styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from "@react-navigation/native";
import CommunityCard from './CommunityCard'


const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCommunity, setFilteredCommunity] = useState([]);
  const [community, setCommunity] = React.useState<any>([]);


  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = community.filter((community : any) =>
        community.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCommunity(filtered);
    } else {
      setFilteredCommunity(community);
    }
  };

  const fetchCommunity = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await GetCommunityDetails(token);
      if (res && res?.communities) {
        const comms = res.communities.map((comm: any, index: number) => ({
          id: index,
          name: comm.name,
          description: comm.description,
          rating: comm.rating
        }));
        setCommunity(comms);
        setFilteredCommunity(comms);
      } else {
        console.error("Invalid response structure", res);
      }
    } catch (error) {
      console.error("Error fetching community:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCommunity();
    }, [fetchCommunity])
  );





  return (
    <SafeAreaView>
      <HeaderContainer>
        <HeaderNavigation>
          <BackButton>Back</BackButton>
        </HeaderNavigation>
        <HeaderTitle>
          Community
        </HeaderTitle>
      </HeaderContainer>
      <SearchInput
        placeholder="Search"
        value={searchQuery}
        onChangeText={handleSearch}
        inputStyle={{ minHeight: 40, height: 40 }}
      />
      <ContactsList
        data={filteredCommunity}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: { item: any }) => (
          <CommunityCard name={item.name} description={item.description} rating={item.rating} />
        )}
      />
    </SafeAreaView>
  )
}

export default CommunityPage