import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Table, Pagination, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface IGetUser {
  _id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  address: string;
  role: string;
  createdAt?: Date;
}

const UserAdminMain = () => {
  const [users, setUsers] = useState<IGetUser[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pageSize: 18 });
  const [loading, setLoading] = useState(false);

  // Fetch data khi page hoặc pageSize thay đổi
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const url = `http://localhost:8080/users?_page=${meta.page}&_limit=${meta.pageSize}`;
        console.log("Fetching URL:", url); // Debug URL gửi đi

        const response = await axios.get(url);

        setUsers(response.data);

        // Lấy total từ header (JSON Server gửi trong 'x-total-count')
        const totalRecords = Number(response.headers['x-total-count']) || 18;
        setMeta((prev) => ({ ...prev, total: totalRecords }));

      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [meta.page, meta.pageSize]);

  // Xử lý đổi trang
  const handlePageChange = (page: number, pageSize?: number) => {
    setMeta((prev) => ({
      ...prev,
      page,
      pageSize: pageSize || prev.pageSize,
    }));
  };

  const columns: ColumnsType<IGetUser> = [
    { dataIndex: 'index', title: 'STT', width: 50, render: (_, __, index) => index + 1 + (meta.page - 1) * meta.pageSize },
    { title: 'ID', dataIndex: '_id', render: (_, record) => <a style={{ color: '#007bff' }}>{record._id}</a> },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Created at', dataIndex: 'createdAt', render: (_, record) => <>{record.createdAt ? dayjs(record.createdAt).format('YYYY-MM-DD') : 'N/A'}</> },
    {
      title: 'Action',
      width: 100,
      render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <EditOutlined style={{ cursor: 'pointer', color: '#007bff' }} />
          <DeleteOutlined style={{ cursor: 'pointer', color: '#dc3545' }} />
          <MoreOutlined style={{ cursor: 'pointer', color: '#6c757d' }} />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 16, color: '#333', fontSize: '24px' }}>Quản lý người dùng</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button icon={<PlusOutlined />} type="primary">Thêm user</Button>
          <Button icon={<ImportOutlined />} type="default">Import</Button>
          <Button icon={<ExportOutlined />} type="default">Export</Button>
        </div>
      </div>

      <Spin spinning={loading}>
        <Table<IGetUser> columns={columns} dataSource={users} rowKey="_id" pagination={false} bordered />
      </Spin>

      {/* <Pagination
        current={meta.page}
        pageSize={meta.pageSize}
        total={meta.total}
        showSizeChanger
        showTotal={(total, range) => `${range[0]}-${range[1]} trên tổng ${total} người dùng`}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: 'right' }}
      /> */}
    </div>
  );
};

export default UserAdminMain;
