import styled from "styled-components";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export const StyledCard = styled(Card)`
  border-radius: 20px !important;
  overflow: hidden;
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.07) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.13) !important;
    border-color: rgba(232, 93, 38, 0.18) !important;
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: #f0ede8;
`;

export const RecipeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;

  ${StyledCard}:hover & {
    transform: scale(1.06);
  }
`;

export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f0 0%, #ede9e0 100%);
  font-size: 3rem;
`;

export const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.15) 40%,
    transparent 70%
  );
  pointer-events: none;
`;

export const FavoriteButton = styled(IconButton)<{ $active: boolean }>`
  position: absolute !important;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  width: 38px !important;
  height: 38px !important;
  border-radius: 12px !important;
  transition: all 0.2s ease !important;
  color: ${({ $active }) => ($active ? "#E85D26" : "#9e9e9e")} !important;

  &:hover {
    background: #ffffff !important;
    transform: scale(1.08);
    color: #e85d26 !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  svg {
    font-size: 18px !important;
  }
`;

export const StyledCardContent = styled(CardContent)`
  padding: 16px !important;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RecipeTitle = styled(Typography)`
  font-weight: 700 !important;
  font-size: 1.02rem !important;
  line-height: 1.38 !important;
  color: #0f0f0f !important;
  letter-spacing: -0.2px !important;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const RecipeDescription = styled(Typography)`
  font-size: 0.82rem !important;
  color: #6e6e6e !important;
  line-height: 1.5 !important;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
`;

export const MetaRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6e6e6e;
`;

export const MetaItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #5c5c5c;
`;

export const Divider = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #d0d0d0;
  flex-shrink: 0;
`;

export const AuthorRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 4px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: auto;
`;

export const AuthorName = styled(Typography)`
  font-size: 0.8rem !important;
  color: #6e6e6e !important;
  font-weight: 500 !important;
`;

export const RatingRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
`;

export const RatingText = styled(Typography)`
  font-size: 0.8rem !important;
  font-weight: 600 !important;
  color: #1a1a1a !important;
`;

export const RatingCount = styled(Typography)`
  font-size: 0.75rem !important;
  color: #9e9e9e !important;
`;

export const StyledCardActionArea = styled(CardActionArea)`
  flex-grow: 1;
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
`;

export const SkeletonCard = styled(Skeleton)`
  border-radius: 16px !important;
  transform: none !important;
`;
