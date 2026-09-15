import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { ProductList } from './ProductList';

// From the book, section "Tooling and Ecosystem"
test('renders products sorted alphabetically', () => {
  const products = [
    { id: 1, name: 'Zebra' },
    { id: 2, name: 'Apple' },
  ];
  render(<ProductList products={products} onAdd={() => {}} />);
  const items = screen.getAllByRole('listitem');
  expect(items[0]).toHaveTextContent('Apple');
});
