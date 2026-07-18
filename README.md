# ScamCheck

ScamCheck là ứng dụng web hỗ trợ người dùng trên 45 tuổi nhận diện tin nhắn lừa đảo. Ứng dụng kết hợp Gemini với lớp luật an toàn chạy tại trình duyệt, giải thích tâm lý, hướng dẫn ứng cứu và bảng tổng đài đã xác minh. Kết quả chỉ mang tính giáo dục, không thay thế cảnh báo từ ngân hàng hoặc cơ quan chức năng.

## Chạy trên máy

1. Sao chép `config.example.js` thành `config.js`.
2. Điền `GEMINI_API_KEY`. Sau khi có URL công khai, điền thêm `PUBLIC_APP_URL` để mã QR dẫn đúng sản phẩm.
3. Chạy một máy chủ web tĩnh, ví dụ Live Server, rồi mở `index.html`. Không mở trực tiếp bằng `file://`.

`config.js`, `.env*` và `node_modules` đã bị loại khỏi Git. Không chụp màn hình, commit hoặc chia sẻ tệp chứa khoá. Với bản công khai, cần giới hạn API key theo HTTP referrer và quota trong Google Cloud; khoá đặt trong JavaScript phía trình duyệt không thể được coi là bí mật tuyệt đối.

## Tính năng đã có mã

- Thám tử trả JSON có schema, streaming, timeout toàn luồng, fallback tối đa hai lần và parser chịu lỗi.
- 12 luật ngoài AI, chống prompt injection, phát hiện URL rút gọn, punycode và tên miền gần giống 10 ngân hàng.
- Trần 12 lượt AI/phiên, nhật ký phiên, cache tin trùng và lịch sử tối đa 10 tin có xoá từng tin/toàn bộ.
- Cô tâm lý 2–3 câu; Người ứng cứu bốn tình huống; chặn số ngoài bảng tổng đài xác minh.
- Nhập giọng nói, thư viện 12 kiểu, luyện tập 10 câu, chữ lớn và tương phản cao.
- Ảnh cảnh báo 1080 × 1080 có QR, Web Share và tải PNG.
- Bộ 60 tin cân bằng 20/20/20, 18 tin khó, confusion matrix và so sánh trước/sau lớp luật.

## Kiểm thử

Chạy kiểm thử hồi quy không gọi AI:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\run-tests.ps1
```

Để đo AI thật bằng một lệnh (phát sinh 60 lượt có tính quota), chạy:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\run-evaluation.ps1 -ConfirmApiCost
```

Trang tự chạy, in bảng đúng/sai và ma trận rồi cho tải báo cáo JSON. Ghi số vào `TECHNICAL_LOG.md`; không tuyên bố đạt độ chính xác khi chưa có báo cáo thật.

## Thành viên nhóm

Chưa được cung cấp. Nhóm cần thay dòng này bằng họ tên và vai trò trước khi nộp.

## Tài liệu

- `BACKLOG_STATUS.md`: đối chiếu từng tiêu chí và phần cần xác nhận bên ngoài.
- `ARCHITECTURE.md`: luồng dữ liệu và máy trạng thái.
- `OPERATIONS.md`: vận hành và các ca khủng hoảng.
- `ACCESSIBILITY_CHECKLIST.md`: checklist iPhone/WCAG AA.
- `SLIDES.md`, `DEMO_SCRIPT.md`: nội dung trình diễn.
