import { Alert } from 'react-bootstrap';

export default function Notification({ message, variant }) {
  return (
    <Alert variant={variant} className="mt-3">
      {message}
    </Alert>
  );
}