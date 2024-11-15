import { render, screen, fireEvent } from '@testing-library/react';
import BackgroundPicker from '../component/BackgroundPicker'; 
import { vi } from 'vitest';

describe('BackgroundPicker Component', () => {
    it('opens the modal and uploads an image as the background', async () => {
      const mockOnBackgroundChange = vi.fn();
      const mockOnClose = vi.fn();
  
      render(
        <BackgroundPicker
          isOpen={true}
          onClose={mockOnClose}
          onBackgroundChange={mockOnBackgroundChange}
        />
      );

      expect(screen.getByText(/choose background style/i)).toBeInTheDocument();
  
      const imageRadio = screen.getByLabelText(/image/i);
      fireEvent.click(imageRadio);
  
      const file = new File(['dummy image content'], 'test-image.png', { type: 'image/png' });
      const uploadInput = screen.getByLabelText(/upload image/i);
      fireEvent.change(uploadInput, { target: { files: [file] } });

      const uploadedText = await screen.findByText(/image uploaded/i);
      expect(uploadedText).toBeInTheDocument();

      const applyButton = screen.getByRole('button', { name: /apply/i });
      fireEvent.click(applyButton);

      expect(mockOnBackgroundChange).toHaveBeenCalledTimes(1);
      expect(mockOnBackgroundChange).toHaveBeenCalledWith(expect.stringContaining('data:image/png'), false);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});