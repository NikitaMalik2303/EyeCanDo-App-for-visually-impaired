// components/ContactCard.tsx
import { ContactCardContainer, ContactName } from "@/styles/directory.styles";
import React from "react";

interface ContactCardProps {
  name: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ name }) => {
  return (
    <ContactCardContainer>
      <ContactName>{name}</ContactName>
    </ContactCardContainer>
  );
};

export default ContactCard;
