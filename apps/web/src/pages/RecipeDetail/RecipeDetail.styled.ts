import styled from "styled-components";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

export const PageWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px 80px;

  @media (max-width: 600px) {
    padding: 0 16px 60px;
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #6e6e6e;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 20px 0 0;
  font-family: inherit;
  transition: color 0.15s ease;

  &:hover {
    color: #e85d26;
  }
`;

export const HeroImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 20px;
  overflow: hidden;
  background: #f0ede8;
  margin: 20px 0 32px;
`;

export const HeroImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const HeroPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  background: linear-gradient(135deg, #f5f5f0 0%, #ede9e0 100%);
`;

export const FavButton = styled(IconButton)`
  position: absolute !important;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(8px);
  width: 44px !important;
  height: 44px !important;
  border-radius: 12px !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease !important;

  &:hover {
    background: #ffffff !important;
    transform: scale(1.08);
  }
`;

export const MetaBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a4a4a;

  svg {
    font-size: 18px;
    color: #9e9e9e;
  }
`;

export const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
`;

export const AuthorAvatar = styled(Avatar)`
  width: 36px !important;
  height: 36px !important;
  font-size: 0.8rem !important;
  background: linear-gradient(135deg, #e85d26, #ff8c5a) !important;
  font-weight: 700 !important;
`;

export const AuthorName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f0f0f;
  display: block;
`;

export const AuthorHandle = styled.span`
  font-size: 0.75rem;
  color: #9e9e9e;
  display: block;
`;

export const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 40px;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 48px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

export const IngredientsCard = styled.div`
  background: #f9f9f7;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 108px;

  @media (max-width: 768px) {
    position: static;
  }
`;

export const IngredientsTitle = styled.h2`
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #0f0f0f;
  margin: 0 0 4px;
`;

export const IngredientsServing = styled.span`
  font-size: 0.75rem;
  color: #9e9e9e;
  display: block;
  margin-bottom: 8px;
`;

export const IngredientItem = styled.li`
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 0.9rem;
  list-style: none;

  &:last-child {
    border-bottom: none;
  }
`;

export const IngredientQty = styled.span`
  font-weight: 700;
  color: #1a1a1a;
  min-width: 64px;
  font-size: 0.85rem;
`;

export const IngredientName = styled.span`
  color: #4a4a4a;
`;

export const StepsTitle = styled.h2`
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #0f0f0f;
  margin: 0 0 24px;
`;

export const StepItem = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
`;

export const StepNumber = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #e85d26 0%, #ff8c5a 100%);
  color: #ffffff;
  font-weight: 800;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const StepBody = styled.div`
  flex: 1;
`;

export const StepTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f0f0f;
  margin: 0 0 6px;
`;

export const StepDescription = styled.p`
  font-size: 0.875rem;
  color: #6e6e6e;
  line-height: 1.7;
  margin: 0;
`;

export const StepDuration = styled.span`
  font-size: 0.75rem;
  color: #9e9e9e;
  display: block;
  margin-top: 4px;
`;

export const RecipeTitle = styled.h1`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1.1;
  color: #0f0f0f;
  margin: 0 0 12px;
`;

export const RecipeDescription = styled.p`
  font-size: 1rem;
  color: #6e6e6e;
  line-height: 1.7;
  margin: 0 0 24px;
`;
