# Đối chiếu tiêu chí ScamCheck

Ngày đối chiếu: 2026-07-18. Trạng thái “Đã có mã” không thay cho kiểm thử thiết bị/API thật. Không có tiêu chí bên ngoài nào được tự nhận hoàn tất khi thiếu bằng chứng.

| Mã | Trạng thái | Bằng chứng hoặc việc còn lại |
|---|---|---|
| L1-01 | Một phần | `.gitignore` và `config.example.js` đã có; `.git` rỗng nên chưa có GitHub và chưa chứng minh toàn bộ lịch sử sạch khoá. |
| L1-02 | Cần iPhone | Ô lớn, nút và footer mọi view đã có; cần Safari iPhone thật. |
| L1-03 | Cần đo | Async, schema, streaming và deadline 19 giây đã có; cần báo cáo 9/10 thật. |
| L1-04 | Đạt bằng test | `run-tests.ps1` xác nhận 5 đầu ra sai vẫn trả cấu trúc hợp lệ. |
| L1-05 | Đạt bằng test | 12 ca biên; 429/5xx/timeout fallback tối đa hai lần, trễ 300/600 ms; lỗi mạng dừng ngay. |
| L1-06 | Bên ngoài | Chưa có repo, nhánh chính hoặc URL GitHub Pages. |
| L1-07 | Đã có mã | Trần 12 lượt AI/phiên, deadline chung, báo lịch sự và bộ đếm hiển thị. |
| L1-08 | Đã có mã | Nhật ký `sessionStorage`: thời gian, vai, model, độ dài, tóm tắt, tối đa 50 dòng. |
| L2-01 | Cần mentor đo | Prompt đúng vai/schema; chưa có bộ 30 tin ẩn và tiêu chí 27/30. |
| L2-02 | Đã có mã | Badge xanh/vàng/đỏ ở đầu kết quả. |
| L2-03 | Đạt bằng test | Danh sách và tô chuỗi nguyên văn; không tìm thấy thì bỏ qua. |
| L2-04 | Đã có mã | Parser buộc đúng ba hành động; CSS chữ tối thiểu 18 px. |
| L2-05 | Đã có mã | `localStorage` lưu toàn bộ lịch sử không giới hạn số bản ghi cố định; mở lại không gọi Gemini. |
| L2-06 | Đã có mã | Ba nút mẫu, spinner, trạng thái streaming và khoá nút đúng lúc. |
| L2-07 | Đạt bằng test | 12 luật gồm link tệp độc và tiêu đề/thân mâu thuẫn. |
| L2-08 | Cần iPhone/AA | Responsive, focus, 18 px và checklist có mã; cần axe/Lighthouse/VoiceOver thật. |
| L2-09 | Cần iPhone | Web Speech `vi-VN`, bật/tắt và lỗi quyền đã có; phụ thuộc Safari/iOS thực tế. |
| L2-10 | Đã có mã | Xoá từng tin/toàn bộ, cả hai hỏi xác nhận. |
| L3-01 | Cần đo | Prompt đúng giọng; mã giới hạn đầu ra thành 2–3 câu; cần kiểm tra đầu ra thật. |
| L3-02 | Cần đo thời gian | Thám tử xong mới gọi Cô tâm lý, hai phần tách; dùng chung deadline 19 giây. |
| L3-03 | Đã có mã | Chỉ gọi Cô với Nghi ngờ/Nguy hiểm; lỗi riêng không xoá kỹ thuật. |
| L3-04 | Đạt bằng test | Thẻ dữ liệu không tin cậy, prompt cấm đổi vai và luật prompt injection ngoài AI. |
| L3-05 | Đã có công cụ | 60 tin gán nhãn vượt yêu cầu 20; trang in đúng/sai và tải JSON; chưa chạy API thật. |
| L3-06 | Đã có mã | 12 kiểu, đủ Ngân hàng/Công an/Trúng thưởng/Giao hàng, lọc và mở chi tiết không reload. |
| L4-01 | Một phần có giới hạn | Tách URL/rút gọn và thử `HEAD`; CORS khiến web tĩnh không thể bảo đảm giải mọi link, cần proxy chống SSRF. |
| L4-02 | Đạt bằng test nội bộ | Punycode/ký tự đồng hình, Levenshtein, 10 thương hiệu và 10 tên miền giả trong test. |
| L4-03 | Đạt bằng test | 12 luật OTP, chuyển tiền, STK, gấp, bí mật, mã độc… chỉ nâng rủi ro. |
| L4-04 | Đã có dữ liệu | 60 tin cân bằng 20/20/20, 18 tin khó, mỗi tin có lý do. |
| L4-05 | Cần chạy thật | `evaluation.html` tính accuracy, recall Nguy hiểm và ma trận nhầm lẫn. |
| L4-06 | Cần chạy thật | Báo cáo so trước/sau luật và liệt kê ba mẫu sai; chưa có số thật. |
| L4-07 | Đã có mã | 10 câu, trạng thái, chấm điểm, giải thích và tổng kết. |
| L4-08 | Đã có mã | `generateContentStream`; preview cập nhật theo chunk, JSON chỉ render chính thức sau validation. |
| L4-09 | Đạt bằng test | Chuẩn hoá NFKC/khoảng trắng; tin trùng lấy lịch sử, không tốn lượt. |
| L5-01 | Đã xác minh 2026-07-18 | 10 ngân hàng + 156 + 113, có ngày và URL nguồn chính thức trong `verified-hotlines.js`. |
| L5-02 | Đã có mã | Bốn lựa chọn rõ; chọn xong khoá toàn bộ. |
| L5-03 | Đã có mã | Prompt bình tĩnh/dứt khoát, 3–6 bước, mỗi bước có câu nói mẫu. |
| L5-04 | Đã có mã | Bốn ngữ cảnh; “chưa làm gì” dùng hướng dẫn cứng, ba ca còn lại gọi Người ứng cứu. |
| L5-05 | Đã có mã/tài liệu | `flowState` và `ARCHITECTURE.md`; cache/an toàn/chưa làm gì giảm lượt so với luôn gọi ba vai. |
| L5-06 | Đạt bằng test | Số 3–11 chữ số ngoài bảng bị thay bằng cảnh báo; số bảng được giữ. |
| L5-07 | Một phần | `OPERATIONS.md` và `SAFETY_SELF_ASSESSMENT.md` đủ bốn ca; test tự động AI cho ba ca khủng hoảng chưa có. |
| L5-08 | Cần URL công khai | Canvas 1080², nội dung và QR đã có; phải điền `PUBLIC_APP_URL` và quét xác nhận. |
| L5-09 | Cần thiết bị | Web Share + tải PNG đã có; cần xác nhận Photos/Downloads trên Android và iPhone. |
| L5-10 | Cần iPhone/AA | Chữ lớn/tương phản và lưu lựa chọn đã có; cần đo tương phản và iPhone. |
| N7-01 | Một phần | README đầy đủ tính năng/cách chạy nhưng chưa có tên thành viên. |
| N7-02 | Đã có tài liệu | Luồng dữ liệu và máy trạng thái khớp `flowState`. |
| N7-03 | Một phần | `SLIDES.md` có 9 slide; số đo còn placeholder hợp lệ cho đến khi chạy thật. |
| N7-04 | Một phần | Kịch bản 3–5 phút đã có; nhóm chưa ghi nhận hai lần tập. |
| N7-05 | Một phần | Runner và tải báo cáo có; thiếu ảnh chụp ba prompt/phản hồi và báo cáo thật. |
| N7-06 | Bên ngoài | Nhóm phải tự quay/duyệt video dưới 5 phút. |
| N7-07 | Đã có tài liệu | Nhật ký phân định AI/mã và quyết định kỹ thuật; cần bổ sung lỗi từ lần đo thật. |

## Việc còn cần người dùng hoặc hạ tầng

1. Cung cấp tên thành viên, URL GitHub và URL Pages.
2. Xác nhận chi phí/hạn mức rồi chạy 60 lượt Gemini, tải JSON và điền số thật.
3. Test Safari/VoiceOver/AA, micro, ảnh và QR trên iPhone/Android thật.
4. Quét toàn bộ lịch sử Git trước push; giới hạn API key theo referrer/quota.
5. Quay video, chụp minh chứng và ghi hai lần tập demo.
6. Nếu bắt buộc giải mọi short-link, bổ sung backend/proxy chống SSRF; GitHub Pages thuần tĩnh không đáp ứng chắc chắn tiêu chí này.
