import Nav from "../components/Nav";
import ProductList from "../components/ProductList";
import Cart from "../components/Cart";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Nav />
      <div className="flex">
        <ProductList />
        <Cart />
      </div>
    </div>
  );
}
