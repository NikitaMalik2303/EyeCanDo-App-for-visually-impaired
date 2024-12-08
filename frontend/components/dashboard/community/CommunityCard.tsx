// components/ContactCard.tsx
import { CommunityCardContainer, CommunityDescription, CommunityRating, CommunityTitle, ContactCardContainer } from "@/styles/directory.styles";
import React from "react";

interface CommunityCardProps {
  name: string;
  description: string;
  rating: string;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ name , description, rating}) => {
  return (
    <CommunityCardContainer>
      {/* <ContactName>{name}</ContactName> */}
      <CommunityTitle>{name}</CommunityTitle>
      <CommunityDescription>{description}</CommunityDescription>
      <CommunityRating>Rating: {rating}/5</CommunityRating>
    </CommunityCardContainer>
  );
};

export default CommunityCard;
