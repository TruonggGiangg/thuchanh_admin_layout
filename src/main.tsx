import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/main-router.tsx'
import { ConfigProvider } from 'antd'
import viVN from 'antd/es/locale/vi_VN';
createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    locale={viVN}
  >
    <StrictMode>
      <RouterProvider router={router} />;
    </StrictMode>
  </ConfigProvider>

)
