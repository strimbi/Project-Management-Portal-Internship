import {
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
} from "@fluentui/react-components";

interface ErrorBarProps {
  error: string;
}

const ErrorBar: React.FC<ErrorBarProps> = ({ error }) => {
  return error ? (
    <MessageBar intent="error">
      <MessageBarBody>
        <MessageBarTitle>{error}</MessageBarTitle>
      </MessageBarBody>
    </MessageBar>
  ) : (
    <></>
  );
};

export default ErrorBar;
