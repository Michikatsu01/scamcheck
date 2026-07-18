# Checklist tiếp cận và iPhone

## Đã kiểm tra bằng mã

- [x] `lang="vi"`, viewport di động và tiêu đề trang.
- [x] Cỡ chữ nền tối thiểu 18 px cả desktop và màn hình dưới 580 px.
- [x] Nút chính cao tối thiểu 50 px; nút phụ tối thiểu 44 px.
- [x] Có trạng thái focus nhìn thấy bằng bàn phím.
- [x] Vùng kết quả, tiến độ, đếm lượt và hướng dẫn ứng cứu có `aria-live`.
- [x] Nút chọn dùng `aria-pressed`; nút micro có trạng thái bật/tắt.
- [x] Bố cục một cột cho ô nhập, lựa chọn ứng cứu và thư viện trên màn hình nhỏ.
- [x] Chế độ chữ lớn và tương phản cao được ghi nhớ bằng `localStorage`.
- [x] Footer pháp lý xuất hiện trong mọi view.

## Cần xác nhận trên thiết bị thật trước khi trình diễn

- [ ] Safari iPhone mở trang không có lỗi console.
- [ ] Cho phép/từ chối micro đều có phản hồi dễ hiểu.
- [ ] Voice Recognition chuyển tiếng Việt thành chữ trên phiên bản iOS dùng demo.
- [ ] Không có cuộn ngang ở 320, 375 và 430 px.
- [ ] Kiểm tra tương phản bằng Lighthouse/axe đạt WCAG AA.
- [ ] VoiceOver đọc đúng thứ tự tiêu đề, nút, kết quả và cảnh báo.
- [ ] Thử phóng chữ 200% và cả hai hướng màn hình.

