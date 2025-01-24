import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest'; // Vitest's mock utility
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';

// Mock the API service
vi.mock('../../services/api', () => ({
  login: vi.fn(() => Promise.resolve({ success: true, data: { token: 'mockToken', employee: {} } }))
}));

// Mock the AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn()
  })
}));

describe('Login Component', () => {
  it('renders the login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
  });

  it('calls the login API on form submission', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/Email address/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const signInButton = screen.getByText(/Sign in/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    // Assert the mocked API is called with the correct data
    const mockedLogin = require('../../services/api').login;
    expect(mockedLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
