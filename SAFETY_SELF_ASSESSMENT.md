# Tự đánh giá an toàn

Ngày rà soát: 2026-07-18.

## Kiểm soát đã triển khai

- Parser lỗi trả Nghi ngờ và đúng ba hành động; bộ kiểm thử phủ năm đầu ra sai.
- 12 ca biên chạy bằng lớp luật ngoài AI; luật chỉ nâng, không hạ mức rủi ro.
- Ba vai coi tin nhắn là dữ liệu không tin cậy và cấm làm theo prompt injection.
- Người ứng cứu chỉ nhận danh sách tổng đài từ tệp dữ liệu; số lạ bị che trước khi hiển thị.
- Lỗi Cô tâm lý/Người ứng cứu không xoá kết quả kỹ thuật.
- Mất mạng không bị hiểu nhầm thành lỗi model và không gọi fallback vô ích.
- Trần 12 lượt/phiên, deadline chung, cache và nhật ký giảm lạm dụng tài nguyên.

## Rủi ro còn lại

- Khoá Gemini chạy phía trình duyệt có thể bị xem. Cần referrer/quota cho demo và proxy cho sản xuất.
- Trình duyệt tĩnh không thể giải mọi redirect do CORS; proxy tương lai phải chống SSRF.
- Kết luận AI có thể sai. Giao diện luôn khuyên xác minh bằng kênh chính thức.
- Số tổng đài có thể đổi; phải kiểm tra lại nguồn trước mỗi buổi demo.
- Web Speech, tải ảnh và tương phản cần thử trên đúng iPhone dùng trình diễn.

## Điều kiện phát hành

Không đánh dấu sẵn sàng công khai cho đến khi: lịch sử Git sạch khoá; API key bị giới hạn; báo cáo 60 tin đã lưu; recall Nguy hiểm đạt ngưỡng nhóm đặt ra; iPhone/VoiceOver/AA đã kiểm tra; URL QR và video offline đã xác nhận.
