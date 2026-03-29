import { useNavigate } from "react-router";
import {
  Wrapper,
  Emoji,
  Code,
  NotFoundTitle,
  NotFoundText,
  HomeButton,
} from "./NotFound.styled.js";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Emoji aria-hidden>🍽️</Emoji>
      <Code aria-label="Error 404">404</Code>
      <NotFoundTitle>Page not found</NotFoundTitle>
      <NotFoundText>
        Looks like this recipe went missing. It may have been moved or deleted.
      </NotFoundText>
      <HomeButton onClick={() => navigate("/")} disableElevation>
        Back to home
      </HomeButton>
    </Wrapper>
  );
}
