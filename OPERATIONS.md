# Vận hành và kiểm thử ScamCheck

## Chạy ứng dụng

1. Sao chép `config.example.js` thành `config.js` và điền Gemini API key.
2. Mở thư mục bằng một máy chủ web tĩnh; không mở trực tiếp `file://` nếu trình
   duyệt chặn ES module từ CDN.
3. Mở `index.html`. Không đưa `config.js` lên kho mã hoặc chia sẻ ảnh chứa khoá.

## Đo chất lượng

1. Kiểm tra quota rồi chạy `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\run-evaluation.ps1 -ConfirmApiCost` hoặc mở `evaluation.html`.
2. Công cụ gọi 60 lần, gồm 18 tin khó; tải báo cáo JSON sau khi hoàn tất.
3. Lưu bảng trước/sau lớp luật, ma trận nhầm lẫn, độ chính xác và độ phủ Nguy hiểm.
4. Ghi ít nhất ba nhóm lỗi cụ thể vào `TECHNICAL_LOG.md`, chỉnh prompt/luật rồi đo lại.

Không coi hạng mục đo lường là đạt chỉ vì có trang chạy; phải lưu số đo thật từ
API và ngày/model đã dùng.

## Bốn ca khủng hoảng bắt buộc

1. Chưa làm gì: không gọi thêm AI, hướng dẫn chặn và tự xác minh.
2. Đã bấm link: đổi mật khẩu trên thiết bị sạch, kiểm tra ứng dụng lạ và liên hệ đơn vị.
3. Đã đưa thông tin/OTP: khoá dịch vụ, đổi thông tin đăng nhập, báo ngân hàng.
4. Đã chuyển tiền: gọi ngân hàng ngay, lưu bằng chứng, trình báo cơ quan chức năng.

Với từng ca, kiểm tra đầu ra không chứa số ngoài `verified-hotlines.js`.

## Khi Gemini gặp sự cố

- 429/5xx/timeout: ứng dụng tự hạ model; 429 có độ trễ tăng dần ngắn.
- Trần 12 lượt Gemini thật mỗi phiên; fallback cũng tính lượt. Chạm trần thì dừng và báo lịch sự.
- Khoá sai/403: sửa cấu hình, không liên tục thử lại.
- Mất mạng: tin đã lưu vẫn xem được; tin mới không được tự gán là an toàn.

## Kiểm thử hồi quy không tốn quota

Chạy `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\run-tests.ps1`. Runner phải in `PASS` trước khi demo.

## Trước buổi demo

- Chạy checklist iPhone trong `ACCESSIBILITY_CHECKLIST.md`.
- Chạy 3 tin mẫu, một prompt injection và đủ bốn ca Người ứng cứu.
- Mở sẵn video dự phòng (do nhóm tự quay) và không để API key xuất hiện trong video.
- Xác nhận URL công khai và tổng đài còn đúng nguồn chính thức.
