import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EmailInbox from '../app/blog/components/EmailInbox';
import { mockMessages } from './helpers';

describe('EmailInbox', () => {
  const defaultProps = {
    email: 'test@tempfreeemail.com',
    expiresAt: Date.now() + 600000,
    onExpire: jest.fn()
  };

  it('renders loading state initially', () => {
    render(<EmailInbox {...defaultProps} />);
    expect(screen.getByText('Loading messages...')).toBeInTheDocument();
  });

  it('displays messages after loading', async () => {
    render(<EmailInbox {...defaultProps} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
    });

    mockMessages.forEach(message => {
      expect(screen.getByText(message.subject)).toBeInTheDocument();
    });
  });

  it('shows no messages message when empty', async () => {
    render(<EmailInbox {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('No messages yet. They will appear here automatically.')).toBeInTheDocument();
    });
  });
}); 