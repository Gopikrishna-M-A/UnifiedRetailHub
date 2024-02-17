import ProductDetail from '../../../components/Home/ProductDetail'
import { getProduct } from '@/utils/products';


const page = async({ params }) => {
  const product = await getProduct(params.productId);
  return (
   <ProductDetail product={product} />
  )
}

export default page