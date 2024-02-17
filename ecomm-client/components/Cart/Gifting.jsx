import React from 'react'
import { Typography, Button} from 'antd';

const { Text, Title,Paragraph } = Typography;

const Gifting = () => {
  return (
    <div className='flex flex-col  gap-2'>
        <Title level={4}>Gifting</Title>
        <div className=" bg-violet-100 py-5 px-2.5 flex flex-col rounded-md gap-1">
            <Title level={5}>Buying for a loved one?</Title>
            <Text type='secondary'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur ducimus quas, vitae fuga sit ratione</Text>
            <Button>Add gift wrap</Button>
        </div>
    </div>
  )
}

export default Gifting