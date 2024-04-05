'use client'


import { uploadFile } from 'react-s3';

import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { Button } from '@/components/ui/button';
import axios from 'axios';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });


  const config = {
    bucketName: 'ecomm-project-bucket',
    region: 'Asia Pacific (Sydney) ap-southeast-2',
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
}




const App = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [file,setFile]=useState()
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );


  const printFiles = async() => {
    const formData = new FormData()
    fileList.map((file)=>{
      formData.append('file', file.originFileObj); 
    })
    axios.post('/api/aws', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res)=>{
      console.log("res",res.data);
    })
  }
  return (
    <div className='flex flex-col  p-40'>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        maxCount={5}
      >
        {fileList.length >= 5 ? null : uploadButton}
      </Upload>



      <Button onClick={printFiles}>print</Button>
    </div>
  );
};
export default App;