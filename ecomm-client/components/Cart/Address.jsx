import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react"

const { Title } = Typography;

const Address = ({ setCurrent }) => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const { data: session } = useSession()
  const user = session?.user

  const initialValues = {
    email: user?.email,
    phone: user?.phone,
    street: user?.address?.street,
    city: user?.address?.city,
    state: user?.address?.state,
    zipCode: user?.address?.zipCode,
    country: "India"
  };
  
  

  const onFinish = (values) => {
    // Handle form submission logic here
    const isSame = Object.keys(initialValues).every(
      key => initialValues[key] === values[key]
    );


    const convertedData = {
      "phone": values.phone,
      "address": {
        "street": values.street,
        "city": values.city,
        "state": values.state,
        "zipCode": values.zipCode,
        "country": values.country
      }
    };

    if (isSame) {
      console.log('Values are the same. No need to update.');
      setCurrent(2);
      return;
    }

    try{
      axios.patch(`${baseURL}/api/user/${user._id}`,convertedData)
    }catch(err){
      console.log("Error in updating user address",err);
    }finally{
      setCurrent(2);
    }

  };

  console.log(user);


  return (
    <div className=" w-[600px] m-auto">
      <Title level={3}>How would you like to get your order?</Title>
      <Form
        initialValues={initialValues}
        name="addressForm"
        onFinish={onFinish}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
       

       <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              required={false}
              name="email"
              label="Email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please enter your email",
                },
              ]}
            >
              <Input disabled={true} addonBefore='✉️' placeholder="example@gmail.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              required={false}
              name="phone"
              label="Phone"
              rules={[
                {
                  required: true,
                  message: "Please enter your phone",
                },
              ]}
            >
              <Input addonBefore='🇮🇳' placeholder="9999999999" />
            </Form.Item>
          </Col>
        </Row>


        <Form.Item
          name="street"
          label="Billing Address"
          required={false}
          rules={[
            { required: true, message: "Please enter your street address" },
          ]}
        >
          <Input.TextArea placeholder="123 Main St" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={10}>
            <Form.Item
              required={false}
              name="city"
              label="Town / City"
              rules={[
                {
                  required: true,
                  message: "Please enter your town or city",
                },
              ]}
            >
              <Input placeholder="Town" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              required={false}
              name="state"
              label="state"
              rules={[
                {
                  required: true,
                  message: "Please enter your state",
                },
              ]}
            >
              <Input placeholder="state" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              required={false}
              name="zipCode"
              label="Postal Code"
              rules={[
                { required: true, message: "Please enter your postal code" },
              ]}
            >
              <Input placeholder="682030" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              required={false}
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please enter your country" }]}
            >
              <Input disabled={true} placeholder="Country" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button size="large" block type="primary" htmlType="submit">
            Continue to Payment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Address;
