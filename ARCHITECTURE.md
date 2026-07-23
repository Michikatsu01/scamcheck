# Kiến trúc ScamCheck

## Luồng dữ liệu

```text
Tin nhắn
  ├─ trùng cache lịch sử ─> parser + luật hiện tại ─> hiển thị (0 lượt AI)
  └─ tin mới
       └─ Thám tử streaming (schema JSON, deadline chung 19 giây)
            └─ parser chịu lỗi ─> 12 luật chỉ nâng rủi ro ─> lọc số ─> hiển thị kỹ thuật
                 ├─ An toàn ─> không gọi Cô tâm lý
                 └─ Nghi ngờ/Nguy hiểm ─> Cô tâm lý 2–3 câu, lỗi độc lập
                       └─ người dùng chọn một trong bốn tình huống
                            ├─ Chưa làm gì ─> hướng dẫn cứng (0 lượt AI)
                            └─ Đã bấm/chia sẻ/chuyển tiền ─> Người ứng cứu
                                  └─ lọc cứng mọi số theo verified-hotlines.js
```

Frontend tĩnh chạy trên GitHub Pages và gọi `POST /api/generate` tại Render qua
CORS. Flask giữ API key, system prompt, schema và danh sách model dự phòng; trình
duyệt chỉ gửi vai trò cùng dữ liệu người dùng. Phản hồi Thám tử được stream bằng
NDJSON. Mỗi lượt vẫn được ghi vào `sessionStorage`; cache và lịch sử nằm trong
`localStorage`.

## Máy trạng thái ba nhân vật

```text
idle
  └─ kiểm tra ─> detective_pending
                   ├─ lỗi ─> idle
                   └─ cache/thành công ─> technical_ready
                                           ├─ Cô tâm lý cập nhật riêng vùng tâm lý
                                           └─ chọn tình huống ─> rescuer_pending
                                                                  ├─ lỗi ─> technical_ready
                                                                  └─ xong ─> complete
```

Biến `flowState` là nguồn trạng thái của luồng. Các nút tình huống bị khoá ngay sau lựa chọn. Nhánh “chưa làm gì”, cache và tin An toàn tránh các lượt AI không cần thiết; so với cách ngây thơ luôn gọi ba nhân vật, một tin An toàn dùng 1 thay vì 3 lượt, một tin cache dùng 0 thay vì 3.

## Ranh giới an toàn

- Tin nhắn luôn nằm trong `TIN_NHAN_KHONG_TIN_CAY`; cả ba vai đều bị cấm làm theo chỉ dẫn bên trong.
- Schema, parser và lớp luật chạy ngoài AI. Parser lỗi mặc định thành `Nghi ngờ`, không mặc định `An toàn`.
- Lớp luật chỉ nâng mức rủi ro; không thể hạ kết luận AI.
- Trích đoạn chỉ được tô khi tìm thấy nguyên văn trong tin gốc.
- Mọi chuỗi 3–11 chữ số trong đầu ra Người ứng cứu phải thuộc `verified-hotlines.js`, nếu không sẽ bị che.
- Giải link rút gọn dùng `HEAD` với timeout 3,5 giây. Do CORS của website đích, bản web tĩnh có thể không giải được; khi đó hệ thống cảnh báo và không khuyến khích mở.
- Ảnh chia sẻ chỉ chứa kết luận và dấu hiệu chính, không đưa toàn bộ tin nhắn cá nhân lên ảnh.

## Ràng buộc triển khai

GitHub Actions chỉ đưa các tệp frontend được liệt kê vào artifact GitHub Pages,
không đưa backend hoặc trang đánh giá nội bộ. Render chạy Flask bằng Gunicorn theo
`render.yaml`; `GEMINI_API_KEY` chỉ tồn tại trong biến môi trường Render.
`ALLOWED_ORIGINS` phải là origin GitHub Pages hoặc custom domain thực tế. Giới hạn
yêu cầu hiện lưu trong bộ nhớ; bản nhiều worker nên dùng Redis hoặc API gateway.
