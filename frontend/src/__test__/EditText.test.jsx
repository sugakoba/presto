import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Slide from '../component/Slide'; 

describe('Slide Component - Edit Text', () => {
  const mockUpdatePresentationBackend = vi.fn();
  const mockSetPresentation = vi.fn();
  const mockSetIsAnyModalOpen = vi.fn();

  const slides = [
    {
      backgroundStyle: 'white',
      elements: [
        { id: 1, type: 'text', text: 'Initial Text', xpos: 10, ypos: 10, width: 20, height: 10, size: 1, color: 'black' },
      ],
    },
  ];
  const presentation = { slides };

  it('should allow editing text in a slide', () => {
    render(
      <Slide
        fade={false}
        currentSlideIndex={0}
        slides={slides}
        presentation={presentation}
        updatePresentationBackend={mockUpdatePresentationBackend}
        setPresentation={mockSetPresentation}
        setIsAnyModalOpen={mockSetIsAnyModalOpen}
      />
    );

    const textElement = screen.getByText('Initial Text');
    fireEvent.doubleClick(textElement);

    const modalTitle = screen.getByText(/Edit this Text/i);
    expect(modalTitle).toBeInTheDocument();

    const textInput = screen.getByLabelText(/Edit New Text Content/i);
    fireEvent.change(textInput, { target: { value: 'Updated Text' } });
    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);

    expect(mockSetPresentation).toHaveBeenCalledWith(
      expect.objectContaining({
        slides: expect.arrayContaining([
          expect.objectContaining({
            elements: expect.arrayContaining([
              expect.objectContaining({ text: 'Updated Text' }),
            ]),
          }),
        ]),
      })
    );

    expect(mockUpdatePresentationBackend).toHaveBeenCalledWith(
      expect.objectContaining({
        slides: expect.arrayContaining([
          expect.objectContaining({
            elements: expect.arrayContaining([
              expect.objectContaining({ text: 'Updated Text' }),
            ]),
          }),
        ]),
      })
    );
  });
});
