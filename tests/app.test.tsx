import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App.tsx';

describe('AuraAid App Shell', () => {
  it('renders application branding', () => {
    render(<App />);
    expect(screen.getByText('AuraAid')).toBeInTheDocument();
    expect(screen.getByText(/Privacy-Preserving NGO Donation Transparency Platform/i)).toBeInTheDocument();
  });
});
