import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Register from '../page/Register';
import { MemoryRouter } from 'react-router-dom';

describe('Register Component', () => {
    it('displays error popup when confirm password does not match password', async () => {
      const mockHandleSuccess = vi.fn();
      
      render(
        <MemoryRouter>
          <Register handleSuccess={mockHandleSuccess} />
        </MemoryRouter>
      );
  
      fireEvent.change(screen.getByLabelText(/^Email$/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/^Password$/i), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), {
        target: { value: 'differentPassword' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Register/i }));
      expect(await screen.findByText(/Password does not match confirm Password/i)).toBeInTheDocument();
    });
});