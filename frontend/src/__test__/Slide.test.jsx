import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Slide from '../component/Slide';

describe('Slide Component - Change Slide', () => {
    it('changes slide when left or right arrow keys are pressed', () => {
      const mockUpdatePresentationBackend = vi.fn();
      const mockSetPresentation = vi.fn();
      const mockSetIsAnyModalOpen = vi.fn();
  
      const slides = [
        { id: 1, backgroundStyle: 'white', elements: [] },
        { id: 2, backgroundStyle: 'blue', elements: [] },
        { id: 3, backgroundStyle: 'red', elements: [] },
      ];
  
      const mockPresentation = { slides };
      let currentSlideIndex = 0;
      
      const { rerender } = render(
        <Slide
          fade={false}
          currentSlideIndex={currentSlideIndex}
          slides={slides}
          presentation={mockPresentation}
          updatePresentationBackend={mockUpdatePresentationBackend}
          setPresentation={mockSetPresentation}
          setIsAnyModalOpen={mockSetIsAnyModalOpen}
        />
      );
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      currentSlideIndex = (currentSlideIndex + 1) % slides.length; 

      rerender(
        <Slide
          fade={false}
          currentSlideIndex={currentSlideIndex}
          slides={slides}
          presentation={mockPresentation}
          updatePresentationBackend={mockUpdatePresentationBackend}
          setPresentation={mockSetPresentation}
          setIsAnyModalOpen={mockSetIsAnyModalOpen}
        />
      );
      expect(screen.getByText(`${currentSlideIndex + 1}`)).toBeInTheDocument(); 

      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length; 
      rerender(
        <Slide
          fade={false}
          currentSlideIndex={currentSlideIndex}
          slides={slides}
          presentation={mockPresentation}
          updatePresentationBackend={mockUpdatePresentationBackend}
          setPresentation={mockSetPresentation}
          setIsAnyModalOpen={mockSetIsAnyModalOpen}
        />
      );
      expect(screen.getByText(`${currentSlideIndex + 1}`)).toBeInTheDocument(); 
    });
});