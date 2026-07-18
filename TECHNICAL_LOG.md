# Nhật ký kỹ thuật và phân định AI

## Phần do Gemini sinh khi ứng dụng chạy

- Phân loại rủi ro, mô tả dấu hiệu, đoạn trích và ba hành động đề xuất.
- Hai đến ba câu giải thích tâm lý cho tin Nghi ngờ/Nguy hiểm.
- Các bước Người ứng cứu cho ba tình huống đã có hành động rủi ro.

## Phần mã kiểm soát cứng

- Schema JSON, parser chịu lỗi, streaming, deadline chung, fallback và trần 12 lượt AI mỗi phiên.
- Luật OTP/chuyển tiền/đe doạ khoá tài khoản/tên miền giả/gấp gáp/điều khiển từ xa/prompt injection.
- Tô đoạn trích, phát hiện tên miền, cache, lịch sử, thư viện và luyện tập.
- Danh sách tổng đài đã xác minh và chặn mọi số do AI tự tạo.

## Quyết định chính

- Hiển thị kỹ thuật trước, Cô tâm lý chạy nền để giảm thời gian chờ.
- Fallback sang model nhẹ hơn thay vì lặp lâu trên model đang quá tải.
- Lớp luật chỉ nâng mức rủi ro nhằm tránh tin nguy hiểm bị gán An toàn.
- Kết quả lấy từ cache cũng phải chạy lại qua lớp luật hiện tại; giải thích An toàn cũ bị bỏ nếu mức rủi ro được nâng.
- Trang đánh giá tách khỏi ứng dụng để 60 lượt thử không làm nhiễu bộ đếm phiên người dùng.

## Lỗi và kiểm thử ngày 2026-07-18

- Sửa `Failed to fetch` khi mất mạng bị hiểu nhầm là lỗi model: lỗi mạng nay dừng fallback ngay và báo đúng nguyên nhân.
- Phát hiện tài liệu backlog cũ ghi nhiều tính năng chưa tồn tại; đã đối chiếu lại theo mã chạy thực tế.
- Thêm runner `run-tests.ps1`. Kết quả: PASS cho 5 đầu ra AI sai định dạng, 12 ca biên, 10 tên miền giả, URL, cache chuẩn hoá và chặn số lạ.
- Smoke test Chrome headless: module thực thi, thư viện 12 kiểu render và không có `ReferenceError`/`SyntaxError` trong stderr.
- Xác minh lại 10 tổng đài ngân hàng, 156 và 113 từ nguồn chính thức; ngày xác minh lưu trong tệp dữ liệu.

## Số đo cần điền sau lần chạy thật

| Ngày | Model | Độ chính xác trước | Độ phủ Nguy hiểm trước | Độ chính xác sau | Độ phủ Nguy hiểm sau |
|---|---|---:|---:|---:|---:|
| Chưa chạy | gemini-3.5-flash | — | — | — | — |

Ba điểm yếu cần ghi từ các hàng sai trong `evaluation.html`: chưa có số đo thật.
