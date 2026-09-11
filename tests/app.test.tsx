import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App.tsx';

describe('AuraAid shell', () => {
  it('renders branding and campaign discovery', () => {
    render(<App />);
    expect(screen.getAllByText('AuraAid').length).toBeGreaterThan(0);
    expect(screen.getByText('Give privately.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search campaigns/i)).toBeInTheDocument();
  });
});
