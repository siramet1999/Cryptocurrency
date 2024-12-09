# Cryptocurrency
Features
1.สมัครบัญชีผู้ใช้และ Login
2.ซื้อ/ขาย Cryptocurrencies ผ่าน Fiat currencies
  2.1ซื้อเหรียญด้วย THB หรือ USD
  2.2 ขายเหรียญ (BTC,ETH,XRP, DOGE)
  2.3 ขายเหรียญกลับเป็น Fiat currency
3.โอน Cryptocurrencies ภายในระบบ
4.รองรับ Fiat Currencies เช่น THB และ USD
5.รองรับการทำธุรกรรม (Transaction)
🛠️ Tech Stack
Node.js & Express.js - Backend routing และ Middleware
Prisma ORM - จัดการฐานข้อมูล SQLite
JWT (JSON Web Token) - สำหรับการยืนยันตัวตน
Bcrypt - สำหรับเข้ารหัส Password
SQLite - Database สำหรับจัดเก็บข้อมูล
1️⃣ Clone Repository
  https://github.com/siramet1999/Cryptocurrency.git
2️⃣ ติดตั้ง Dependencies
  npm install
3️⃣ Database 
  npm install @prisma/client  
  npx prisma migrate dev --name init
4️⃣ Seed ข้อมูล (Database Seed) 
  npm run prisma:seed    
🚀 Run Application
  npm run dev
💬 API Routes
📌User Authentication Routes
1./api/users/register	POST	สมัครสมาชิกผู้ใช้งาน
{
  "username": "user",
  "email": "user@gmail.com",
  "password": "password"
}
2./api/users/login	POST	เข้าสู่ระบบ (Login)
{
  "email": "user@gmail.com",
  "password": "password"
}
3./api/users/me	GET	ดูข้อมูลผู้ใช้งานปัจจุบัน
  ผ่าน Authorization token
4./api/users/update	PATCH	แก้ไขข้อมูลบัญชี
  ผ่าน Authorization token
{
  "username": "user1",
  "email": "user1@example.com" 
}
5./api/users/delete	DELETE	ลบบัญชีผู้ใช้งาน
 ผ่าน Authorization token
📌 Transaction Routes
1./api/transaction/transfer	POST	ทำธุรกรรมการโอนเงิน
*receiverwalletuse คือเลข walletuser_id
ผ่าน Authorization token
{
  "cryptoId": 1,
  "quantity": 10,
  "receiverwalletuser": 743782
}
📌 Fiat Wallet Routes
1./api/fiat-wallet POST	สร้าง Fiat Wallet ใหม่
ผ่าน Authorization token
{
  "walletuser_id":206362,
  "fiat_id": 1
}
2./api/fiat-wallet/my-wallets	GET	ดู Fiat Wallet ของผู้ใช้งาน
ผ่าน Authorization token
3./api/fiat-wallet/update-balance	PATCH	อัพเดท Balance Wallet
*เอาเงินเข้าระบบ
ผ่าน Authorization token
{
  "wallet_id": "5",
  "amount": 50
}
📌 Wallet Routes (Cryptocurrency)
1./api/wallets/create POST	สร้าง  Wallet ใหม่
ผ่าน Authorization token
{
  "walletuser_id": 743782,
  "crypto_id": 1
}
2.api/wallets/my-wallets	GET	ดู  Wallet ของผู้ใช้งาน
ผ่าน Authorization token
3./api/wallets/update-balance อัพเดท Balance Wallet
*เอาCryptocurrencyเข้าระบบ
ผ่าน Authorization token
{
  "wallet_id": "5",
  "amount": 50
}
📌Cryptocurrency Routes
1./api/cryptocurrencies	GET	ดึง Cryptocurrencies ทั้งหมด
2./api/cryptocurrencies	POST	สร้าง Cryptocurrency ใหม่
{
  "name": "tester",
  "symbol": "TT",
  "price_usd": 18
}
3./api/cryptocurrencies/:id	PATCH	อัพเดทข้อมูล Cryptocurrency
ใส่idเหรียญ
{
  "price_usd": 28000
}
4./api/cryptocurrencies/:id	DELETE	ลบ Cryptocurrency
ใส่idเหรียญ
📌 Fiat Routes
1./api/fiat	GET	ดึง Fiat Currencies ทั้งหมด
2./api/fiat	POST	เพิ่ม Fiat Currency ใหม่
{
  "name": "Euro",
  "symbol": "EUR",
  "exchange_rate": 0.85
}
3./api/fiat/:id	PATCH	อัพเดทข้อมูล Fiat Currency
ใส่id เงิน fiat
{
  "exchange_rate": 1
}
4./api/fiat/:id	DELETE	ลบ Cryptocurrency
ใส่id เงิน fiat

📌 trade
1.api/trade/buy post ทำการตั้งซื้อและหาคู่แมชจะหาคู่ที่ราคา<=จำนวนราคาpricePerUnit
ผ่าน Authorization token
cryptoId = idเหรียญ
fiat_id  = idเงิน
quantity = จำนวน
pricePerUnit = ราคาต่อเหรียญ

{
  "cryptoId": 1,
  "fiat_id": 1, 
  "quantity": 1,
  "pricePerUnit": 1
}
2.api/trade/sell post ทำการตั้งขายและหาคู่แมชจะหาคู่ที่ราคา>=จำนวนราคาpricePerUnit
ผ่าน Authorization token
{
  "cryptoId": 1,
  "fiat_id": 1, 
  "quantity": 1,
  "pricePerUnit": 1
}
/api/trade/cancel post ยกเลิก order และคือเงินหรือเหรียญ
เลข order
{
"orderId":7
}

📊 Database Schema
Prisma Schema (schema.prisma)
Model และ Entity Relationships ถูกออกแบบตามนี้:

User: ข้อมูลผู้ใช้งานและ Wallet
Cryptocurrency: ข้อมูลเหรียญ Bitcoin, Ethereum, Dogecoin อื่นๆ
FiatCurrency: ข้อมูล Fiat Currencies เช่น THB และ USD
Wallet และ FiatWallet: จัดการ Balance สำหรับ Wallet ต่างๆ
Transaction: บันทึกการโอนเงินระหว่างผู้ใช้งาน
Order: เก็บข้อมูล Order Pending และ Order ที่ทำสำเร็จ



