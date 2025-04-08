# Coffee Order App

Ứng dụng đặt đồ uống coffee shop với đầy đủ tính năng quản lý và đặt hàng.

## Tính năng

### Người dùng
- Đăng ký, đăng nhập
- Xem menu và đặt hàng
- Quản lý giỏ hàng
- Xem lịch sử đơn hàng
- Đặt bàn
- Cập nhật thông tin cá nhân

### Admin
- Quản lý sản phẩm (thêm, sửa, xóa)
- Quản lý đơn hàng
- Quản lý người dùng
- Quản lý bàn
- Xem thống kê

## Công nghệ sử dụng

### Frontend
- React 18
- TypeScript
- Material-UI
- React Router
- Axios
- React Toastify
- Vite

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Redis
- JWT Authentication
- Nodemailer
- Multer
- Zod Validation

## Yêu cầu hệ thống

- Node.js 18+
- MongoDB 6+
- Redis 7+

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/your-username/coffee-order-app.git
cd coffee-order-app
```

2. Cài đặt dependencies cho frontend:
```bash
npm install
```

3. Cài đặt dependencies cho backend:
```bash
cd backend
npm install
```

4. Tạo file .env:
```bash
cp .env.example .env
```
Cập nhật các biến môi trường trong file .env

5. Khởi động MongoDB và Redis

6. Chạy ứng dụng ở môi trường development:

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```

## Build và Deploy

### Frontend
```bash
npm run build
```
File build sẽ được tạo trong thư mục `dist`

### Backend
```bash
cd backend
npm run build
```
File build sẽ được tạo trong thư mục `backend/dist`

## Testing

### Frontend
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Backend
```bash
cd backend
# Unit tests
npm run test

# Test coverage
npm run test:coverage
```

## Cấu trúc thư mục

```
coffee-order-app/
├── src/                    # Frontend source
│   ├── assets/            # Static assets
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── layouts/           # Layout components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── backend/               # Backend source
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # Express routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   └── uploads/          # Uploaded files
└── public/               # Public static files
```

## Contributing

1. Fork repository
2. Tạo branch mới
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

MIT License
