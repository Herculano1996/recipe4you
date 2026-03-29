import styled from "styled-components";

export const PageWrapper = styled.div`
  padding-top: 40px;
  padding-bottom: 64px;
  max-width: 800px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 32px;
  margin-top: 0;
`;

export const Section = styled.section`
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 28px;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SectionIcon = styled.span`
  font-size: 1.2rem;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

export const FieldLabel = styled.label`
  font-size: 0.875rem;
  color: #333;
  font-weight: 500;
  margin-bottom: 6px;
  display: block;
`;

export const IngredientRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 2fr auto;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const StepRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e85d26;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
  margin-top: 8px;
`;

export const StepFields = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AddBtn = styled.button`
  color: #e85d26;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  background: none;
  border: 2px dashed #e85d26;
  border-radius: 8px;
  padding: 10px 16px;
  width: 100%;
  margin-top: 4px;
  font-family: inherit;

  &:hover {
    background: rgba(232, 93, 38, 0.05);
  }
`;

export const RemoveBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #d32f2f;
  font-size: 1.2rem;
  padding: 4px;
  margin-top: 6px;
  line-height: 1;
  font-family: inherit;

  &:hover {
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const TagGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TagChip = styled.button<{ $selected: boolean }>`
  padding: 6px 14px;
  border-radius: 999px;
  border: ${({ $selected }) =>
    $selected ? "2px solid #e85d26" : "2px solid #ddd"};
  background: ${({ $selected }) =>
    $selected ? "rgba(232, 93, 38, 0.08)" : "#fff"};
  color: ${({ $selected }) => ($selected ? "#e85d26" : "#555")};
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: inherit;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    color 0.15s ease;
`;

export const ImageZone = styled.div`
  border: 2px dashed #ccc;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;

  &:hover {
    border-color: #e85d26;
  }
`;

export const ImagePreview = styled.img`
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
`;

export const SubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

export const AutocompleteDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
`;

export const AutocompleteItem = styled.div`
  padding: 10px 14px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #f5f5f5;
  }
`;

export const IngredientInputWrapper = styled.div`
  position: relative;
`;
