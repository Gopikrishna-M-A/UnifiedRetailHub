import React from 'react'
import { Input, Typography} from 'antd';

const { Text, Title } = Typography;

const Coupoun = () => {
  return (
    <div className='flex flex-col gap-2'>
        <Title level={4}>Coupons</Title>
        <Input size='large' placeholder='Enter your promo code' addonBefore="Coupons" allowClear />
    </div>
  )
}

export default Coupoun