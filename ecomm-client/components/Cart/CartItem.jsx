import { useState } from 'react';
import Image from 'next/image'
import { Typography, Tag, InputNumber, Checkbox } from 'antd'
import { CarOutlined, CloseOutlined } from '@ant-design/icons'
import { useCart } from '../../contexts/cartContext';
import { useSession } from 'next-auth/react';

const { Text, Title, Paragraph } = Typography;
const CartItem = ({ cartItem, index }) => {
    const { data: session } = useSession()
    const [user, setUser] = useState(session?.user)

    const { updateCart, removeFromCart } = useCart();


    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
      };



    const removeCartItem = async() => {
        removeFromCart(cartItem.product._id, user._id);
    }
    
    const image = `/images/products/${cartItem?.product?.images[0]}`;

  return (
    <div  className={`flex justify-between border-b px-2.5 py-5 relative ${index ? 'border-b-0' : 'border-b'}`}>
        <div className='flex gap-3'>
        <div>
            <Image 
            className='relative'
            width={70}
            height={70}
            src={image}
             />
             <Checkbox checked={true} className='absolute top-2 left-0' onChange={onChange}/>
        </div>
        <div>
            <div>
                <div>
                    <Title level={4}>{cartItem.product.name}</Title>
                    <Paragraph>{cartItem.product.description}</Paragraph>
                </div>
                <div className='flex gap-2 items-center'>
                    <Title level={5}>₹{cartItem.product.price}</Title> 
                    <Text  type="secondary" delete >₹{(cartItem.product.price * 1.1).toFixed(2)}</Text>
                    <Tag bordered={false} color="green">10% OFF</Tag>
                </div>
                <div className='flex gap-2 items-center'>
                    <CarOutlined />
                    <Text  type="secondary" ><strong>Express</strong> delivery in 3 days</Text>
                </div>

            </div>
            
        </div>
        </div>
        <div className='flex flex-col items-end justify-between'>
            <CloseOutlined onClick={removeCartItem}/>
            <InputNumber 
                className='w-20'
                defaultValue={cartItem.quantity}
                min={1} 
                // max={10} 
                onStep={(value, info) => {
                    if (info.type === 'up') {
                        updateCart(cartItem.product._id, user._id, cartItem.quantity + 1) 
                    } else if (info.type === 'down') {
                        updateCart(cartItem.product._id, user._id, cartItem.quantity - 1)
                    }
                }}
            />
        </div>
    </div>
  )
}

export default CartItem