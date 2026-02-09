import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app with loader', () => {
  render(<App />);
  const loadingText = screen.getByText(/loading/i);
  expect(loadingText).toBeInTheDocument();
});
