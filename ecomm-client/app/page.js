import Home from '../components/Home/Home'
import { getUniqueCategories } from '@/utils/products';


const page = async() => {
  const categories = await getUniqueCategories()
  return (
    <Home categories={categories} />
  )
}

export default page