import OrderPage from '../../../components/Orders/OrderPage'
import { getServerSession } from 'next-auth/next';
import { options } from '../../api/auth/[...nextauth]/options';


const page = async({params}) => {

  return (
    <div className='min-h-96'>
      <OrderPage orderId={params.orderId}/>
    </div>
  )
}

export default page