import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Login from '../page/Login';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');

describe('Login Component', () => {
  it('calls handleSuccess when login is successful', async () => {
    const mockHandleSuccess = vi.fn();
    axios.post.mockResolvedValue({ data: { token: 'mock-token' } });

    render(
      <MemoryRouter>
        <Login handleSuccess={mockHandleSuccess} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/^Email$/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    await waitFor(() => {
      expect(mockHandleSuccess).toHaveBeenCalledWith('mock-token');
    });
  });

  it('displays an error message on login failure', async () => {
    const mockHandleSuccess = vi.fn();
    axios.post.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } },
    });

    render(
      <MemoryRouter>
        <Login handleSuccess={mockHandleSuccess} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/^Email$/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });
});
