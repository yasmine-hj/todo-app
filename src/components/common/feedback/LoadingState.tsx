import { LoadingContainer, Spinner, LoadingText } from "../../styles";

export function LoadingState() {
  return (
    <LoadingContainer>
      <Spinner />
      <LoadingText>Loading tasks...</LoadingText>
    </LoadingContainer>
  );
}
