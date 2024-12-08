import React, { useCallback, useState } from "react";
import { ContactsList, SearchInput } from "@/styles/directory.styles";
import ContactCard from "./ContactCard";
import BackButton from "@/components/button/BackButton";
import TextButton from "@/components/button/TextButton";
import { COLORS } from "@/constants/color_wheel";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { GetDirectory } from "@/services/auth.services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  HeaderContainer,
  HeaderNavigation,
  HeaderTitle,
  SafeAreaView,
} from "@/styles/dashbaord.styles";

// Define a type for contact information
type Contact = {
  id: number;
  name: string;
};

const DirectoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [contactList, setContactList] = useState<Contact[]>([]);

  const router = useRouter();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = contactList.filter((contact) =>
        contact.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contactList);
    }
  };

  const fetchContacts = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await GetDirectory(token);
      console.log("Directory response:", res);
      if (res && res.contacts) {
        const contacts = res.contacts.map((contact: string, index: number) => ({
          id: index,
          name: contact,
        }));
        setContactList(contacts);
        setFilteredContacts(contacts);
      } else {
        console.error("Invalid response structure", res);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, [fetchContacts])
  );

  return (
    <SafeAreaView>
      <HeaderContainer>
        <HeaderNavigation>
          <BackButton>Back</BackButton>
          <TextButton
            color={COLORS.primary}
            fontSize={16}
            icon={() => (
              <Feather name="plus" size={18} color={COLORS.primary} />
            )}
            onPress={() => router.push("/directory/add")}
          >
            Add
          </TextButton>
        </HeaderNavigation>
        <HeaderTitle>Directory</HeaderTitle>
      </HeaderContainer>
      <SearchInput
        placeholder="Search"
        value={searchQuery}
        onChangeText={handleSearch}
        inputStyle={{ minHeight: 40, height: 40 }}
      />
      <ContactsList
        data={filteredContacts}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: { item: any }) => (
          <ContactCard name={item.name} />
        )}
      />
    </SafeAreaView>
  );
};

export default DirectoryPage;
