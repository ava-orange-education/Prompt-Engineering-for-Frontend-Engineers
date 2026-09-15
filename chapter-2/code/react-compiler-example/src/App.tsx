import { ProductList } from './ProductList';

const products = [
  { id: 1, name: 'Zebra' },
  { id: 2, name: 'Apple' },
  { id: 3, name: 'Mango' },
];

function App() {
  return (
    <>
      <h1>React Compiler example</h1>
      <ProductList products={products} onAdd={(id) => console.log('add', id)} />
    </>
  );
}

export default App;
