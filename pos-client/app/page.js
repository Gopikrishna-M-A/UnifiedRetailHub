import ProductList from "../components/ProductList"
import Cart from "../components/Cart"

export default function Home() {
  return (
    <div className='flex'>
      <ProductList />
      <Cart />
    </div>
  )
}
