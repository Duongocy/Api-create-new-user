const express = require('express');
const cors = require('cors'); // Import thư viện cors
const { Pool } = require('pg');

const app = express();
app.use(cors()); // Sử dụng middleware CORS
app.use(express.json());

// Cấu hình kết nối đến PostgreSQL
const pool = new Pool({
    user: 'postgres', // Thay thế bằng username của bạn
    host: '14.165.172.59',//địa chỉ ip công khai của máy fujitsu 
    database: 'Invoice',
    password: '1!Ngaycuoicung', // Thay thế bằng password của bạn
    port: 5432
});

//Kiểm tra xem user name đã tồn tại chưa 
app.get('/Invoice',async (yeucaune,traloine) =>{
    const ten_user = yeucaune.query.username;
    console.log("Tên cần kiểm tra nè : ",ten_user);
    try {
            const ket_qua_kiem_tra_ton_tai = await pool.query(
            'SELECT 1 FROM user_table WHERE user_name = $1 LIMIT 1',
            [ten_user]
            );
            traloine.json({ exists: result.rows.length > 0 });
        } 
    catch (err) {
            console.error(err);
            traloine.status(500).json({ error: 'Không thể kiểm tra sự tồn tại của user name' });
        }
})
// Thêm dữ liệu user vào bảng user
app.post('/Invoice', async (req, res) => {
    const user_array = req.body;
    console.log("Đã nhận được yêu cầu tạo user từ client");//báo trên log là đã nhận được 1 yêu cầu từ client
    // console.log(product_name,price,quantity);
    try {
        const {user_id,user_name,create_date,email,pass} = user_array;
        const result = await pool.query(
                    'INSERT INTO user_table (user_id,user_name,create_date,email,pass) VALUES ($1, $2, $3,$4,$5) RETURNING *',
                    [user_id,user_name,create_date,email,pass]
                );
            res.status(201);//không gởi phản hồi trong vòng for vì nó sẽ kết thúc việc lưu dữ liệu ngay sau vòng lặp đầu tiên
        }
    catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi thêm dữ liệu');
    }
});

// Khởi động server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});