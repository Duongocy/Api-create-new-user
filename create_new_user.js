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
    const kieu_yeu_cau = yeucaune.query.kieuyeucau;
    if (kieu_yeu_cau==='checkusertontai')
    {
        console.log("Tên cần kiểm tra nè : ",ten_user);
        try {
                const ket_qua_kiem_tra_ton_tai = await pool.query('SELECT 1 FROM user_table WHERE user_name = $1 LIMIT 1',[ten_user]);
                traloine.json({ exists: ket_qua_kiem_tra_ton_tai.rows.length > 0 });
            } 
        catch (err) {
                console.error(err);
                traloine.status(500).json({ error: 'Không thể kiểm tra sự tồn tại của user name' });
            }
    }
    else if (kieu_yeu_cau==='dangnhap')
    {
        const ten_email = yeucaune.query.email;
        const password = yeucaune.query.pass;
        console.log("Email đăng nhập :",ten_email);
        console.log("Pass đăng nhâp :",password);   
        //kiểm tra xem có đúng email và pass không nè 
        try {
                const ket_qua_kiem_tra_ton_tai = await pool.query('SELECT user_name,user_id FROM user_table WHERE email = $1 AND pass = $2 ',[ten_email,password]);
                // Kiểm tra xem có bản ghi nào không
                if (ket_qua_kiem_tra_ton_tai.rows.length > 0) {
                // Nếu có, trả kết quả về client
                    res.status(200).json({
                    status: 'success',
                    data: ket_qua_kiem_tra_ton_tai.rows[0] // Gửi thông tin người dùng đầu tiên tìm thấy
                    });
                } else {
                // Nếu không có, thông báo không tìm thấy
                    res.status(404).json({
                    status: 'fail',
                    message: 'Không tìm thấy người dùng'
                    });
                }
            } 
        catch (err) {
                console.error(err);
                traloine.status(500).json({ error: 'Không thể kiểm tra sự tồn tại của user name' });
            }
    }    
})
// Thêm dữ liệu user vào bảng user
app.post('/Invoice', async (req, res) => {
    const user_array = req.body;
    console.log("Đã nhận được yêu cầu tạo user từ client");//báo trên log là đã nhận được 1 yêu cầu từ client
    // console.log(product_name,price,quantity);
    try {
        console.log("Đang cố ghi thông tin user mới vào database...");
        const {user_id,user_name,create_date,email,pass} = user_array;
        const result = await pool.query(
                    'INSERT INTO user_table (user_id,user_name,create_date,email,pass) VALUES ($1, $2, $3,$4,$5) RETURNING *',
                    [user_id,user_name,create_date,email,pass]
                );
        res.status(201).json({ message: 'User created successfully' });
        }
    catch (err) {
        console.log("Không thể ghi thông tin user mới vào database.")
        console.error(err);
        res.status(500).json({ message: 'User created failed' });
    }
});

// Khởi động server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});