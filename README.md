# ScamCheck

ScamCheck là ứng dụng web hỗ trợ người dùng trên 45 tuổi nhận diện tin nhắn lừa đảo. Ứng dụng kết hợp Gemini với lớp luật an toàn chạy tại trình duyệt, giải thích tâm lý, hướng dẫn ứng cứu và bảng tổng đài đã xác minh. Kết quả chỉ mang tính giáo dục, không thay thế cảnh báo từ ngân hàng hoặc cơ quan chức năng.

## Chạy trên máy

Yêu cầu Python 3.10 trở lên.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Điền `GEMINI_API_KEY` vào `.env`. Chạy backend:

```powershell
python -m backend.app
```

Máy chủ mặc định lắng nghe trên `0.0.0.0` và dùng biến môi trường `PORT` nếu có,
do đó cùng lệnh này cũng đáp ứng yêu cầu port binding của Render.

Ở cửa sổ terminal khác, chạy frontend tĩnh:

```powershell
python -m http.server 5500
```

Mở `http://127.0.0.1:5500`. `frontend-config.js` tự dùng Flask tại cổng 5000 khi
chạy local và dùng Render khi được mở từ GitHub Pages.

Khóa Gemini chỉ được đọc tại backend. Không commit hoặc chia sẻ `.env`. Khi triển
khai thật, dùng biến môi trường của nền tảng và máy chủ WSGI:

```powershell
waitress-serve --listen=0.0.0.0:5000 backend.app:app
```

## Triển khai

### Backend trên Render

1. Trong Render chọn **New > Blueprint** và kết nối repository này.
2. Render đọc `render.yaml` và tạo service `scamcheck-api-minhkhoitn12345`.
3. Nhập `GEMINI_API_KEY` khi Render yêu cầu biến bí mật.
4. Sau deploy, kiểm tra
   `https://scamcheck-api-minhkhoitn12345.onrender.com/api/health`.

Nếu Render cấp URL khác, sửa `API_BASE_URL` trong `frontend-config.js` rồi push lại.

### Frontend trên GitHub Pages

1. Vào **Settings > Pages** của repository.
2. Chọn **Source: GitHub Actions**.
3. Push nhánh `main` hoặc `master`; workflow `pages.yml` chỉ đóng gói frontend.

Origin Pages đã được CORS cho phép là `https://minhkhoitn12345.github.io`.

## Tính năng đã có mã

- Render/Flask giữ khóa, system prompt, schema và model fallback; frontend GitHub Pages nhận luồng NDJSON qua CORS.
- 12 luật ngoài AI, chống prompt injection, phát hiện URL rút gọn, punycode và tên miền gần giống 10 ngân hàng.
- Trần 12 lượt AI/phiên, nhật ký phiên, cache tin trùng và lịch sử không giới hạn số bản ghi cố định, có xoá từng tin/toàn bộ.
- Cô tâm lý 2–3 câu; Người ứng cứu bốn tình huống; chặn số ngoài bảng tổng đài xác minh.
- Nhập giọng nói, thư viện 12 kiểu với tình huống mô phỏng và dẫn chứng chính thống, hướng dẫn từng bước, hỏi đáp 8 chủ đề và Trợ lý AI chăm sóc người dùng mở nhanh từ logo nổi, tìm kiếm/lọc nhanh, ngân hàng luyện tập 60 câu với mỗi bộ 10 câu ngẫu nhiên và 60 gợi ý riêng theo tình huống, chữ lớn.
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
