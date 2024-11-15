import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../page/Dashboard";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";

vi.mock("axios");

describe('Dashboard', () => {
    it('opens the modal when the "New Presentation" button is clicked', async () => {
      axios.get.mockResolvedValueOnce({ data: { store: { presentations: [] } } });
      render(
        <MemoryRouter>
          <Dashboard token="mock-token" />
        </MemoryRouter>
      );

      const newPresentationButton = await screen.findByRole('button', { name: /create-presentation/i });
      fireEvent.click(newPresentationButton);
  
      const modalTitle = screen.getByRole("heading", {
        name: /new presentation/i,
      });
      expect(modalTitle).toBeInTheDocument();
  
      const nameInput = screen.getByLabelText(/enter name/i);
      expect(nameInput).toBeInTheDocument();
  
      const descriptionInput = screen.getByLabelText(/enter description/i);
      expect(descriptionInput).toBeInTheDocument();
    });
});