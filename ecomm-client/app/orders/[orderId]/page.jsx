import OrderPage from '../../../components/Orders/OrderPage'
import { getServerSession } from 'next-auth/next';
import { options } from '../../api/auth/[...nextauth]/options';


const page = async({params}) => {

  return (
    <OrderPage orderId={params.orderId}/>
  )
}

export default page