import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Column, Line, Pie, Bullet, Histogram } from '@ant-design/charts';
import { Card, Spin, Row, Col } from 'antd';


interface ProductCategory {
    category: string;  // Represents the product category
    value: number;     // Represents the value of the category
  }


const Chart = () => {
    const [statistics, setStatistics] = useState<any[]>([]);
const [productCategories, setProductCategories] = useState<any[]>([]);
const [customerGender, setCustomerGender] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  Promise.all([
    axios.get('http://localhost:8080/statistics'),
    axios.get('http://localhost:8080/productCategories'),
    axios.get('http://localhost:8080/customerGender'),
  ])
    .then(([statsRes, categoriesRes, genderRes]) => {
      console.log('Statistics:', statsRes.data);
      console.log('Product Categories:', categoriesRes.data);
      console.log('Customer Gender:', genderRes.data);

      setStatistics(statsRes.data);
      setProductCategories(categoriesRes.data);
      setCustomerGender(genderRes.data);
    })
    .catch((error) => console.error('Error fetching data', error))
    .finally(() => setLoading(false));
}, []);

    

  // Biểu đồ Cột - Doanh thu theo tháng
  // Nếu API trả về { statistics: [...], productCategories: [...] }, thì lấy trực tiếp
// Biểu đồ Cột - Doanh thu theo tháng
const revenueConfig = {
    data: statistics || [],
    xField: 'label',
    yField: 'revenue',
    label: { position: 'top', style: { fontSize: 14, fontWeight: 'bold', color: '#333' } },
    color: '#FF5733',
    tooltip: { 
        formatter: (datum: { revenue: number, label: string }) => ({
          name: 'Doanh thu',
          value: `${datum.revenue} VNĐ`
        })
      },
    
    interaction: [{ type: 'element-active' }], // Tương tác hover
    columnStyle: { radius: [8, 8, 0, 0] }, // Bo góc cột
  };

  // Biểu đồ số đơn hàng
  const orderConfig = {
    data: statistics || [],
    xField: 'label',
    yField: 'orders',
    seriesField: 'label',
    color: '#1890FF',
    tooltip: { 
        formatter: (datum: { orders: number, label: string }) => ({
          name: 'Đơn hàng',
          value: `${datum.orders} đơn`
        })
      },
    interaction: [{ type: 'element-active' }],
    lineStyle: { lineWidth: 3, stroke: '#1890FF' },
  };

  // Biểu đồ phân loại sản phẩm
  const categoryConfig = {
    data: productCategories || [],
    angleField: 'value',
    colorField: 'category',
    label: { type: 'spider', style: { fontSize: 14, fontWeight: 'bold' } },
    radius: 0.8,
    color: ['#FF5733', '#FF8C00', '#FFD700'], // Màu sắc cho các phân loại
    tooltip: {
        formatter: (datum: { category: string }) => ({
          name: 'Loại sản phẩm',
          value: datum.category
        }),
      },
  };

  // Biểu đồ giới tính khách hàng
  const genderConfig = {
    data: customerGender || [],
    angleField: 'value',
    colorField: 'gender',
    label: { type: 'spider', style: { fontSize: 14, fontWeight: 'bold' } },
    radius: 0.8,
    color: ['#FF66CC', '#00BFFF'], // Màu sắc cho giới tính
    tooltip: {
        formatter: (datum: { gender: string }) => ({
          name: 'Giới tính',
          value: datum.gender
        }),
      },
  };
  
  

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
    <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontWeight: 'bold' }}>📊 Thống kê doanh số</h1>

    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card
          title="📈 Doanh thu theo tháng"
          style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
          hoverable
        >
          <Column {...revenueConfig} />
        </Card>
      </Col>

      <Col span={12}>
        <Card
          title="🛍️ Phân loại sản phẩm"
          style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
          hoverable
        >
          <Pie {...categoryConfig} />
        </Card>
      </Col>

      <Col span={12}>
        <Card
          title="📦 Số đơn hàng theo tháng"
          style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
          hoverable
        >
          <Column {...orderConfig} />
        </Card>
      </Col>

      <Col span={12}>
        <Card
          title="👥 Tỷ lệ khách hàng theo giới tính"
          style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
          hoverable
        >
          <Pie {...genderConfig} />
        </Card>
      </Col>
    </Row>
  </div>
  );
  
};

export default Chart;
