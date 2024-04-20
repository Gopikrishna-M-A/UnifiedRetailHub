import ProductListing from '../../components/Home/ProductListing'
import { getProducts, getUniqueCategories } from '@/utils/products';

const page = async({params}) => {
  const products = await getProducts()
  const Categories = await getUniqueCategories()

  return (
    <ProductListing  categories={Categories} products={products} id={''} allP={true} />
  )
}

export default page