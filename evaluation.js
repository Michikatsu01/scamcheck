const runButton = document.getElementById('runEvaluationBtn');
const progress = document.getElementById('evaluationProgress');
const summary = document.getElementById('evaluationSummary');
const table = document.getElementById('evaluationTable');
const downloadButton = document.getElementById('downloadEvaluationBtn');
const dataset = window.EVALUATION_DATASET || [];
const labels = ['An toàn', 'Nghi ngờ', 'Nguy hiểm'];
const EVALUATION_MODEL = 'server-managed';
const API_BASE_URL = String(window.SCAMCHECK_CONFIG?.API_BASE_URL || '').replace(/\/+$/, '');

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
    }[character]));
}

function applySafetyRules(text, aiLabel) {
    const otpRequest = /(?:cung cấp|đọc|gửi|chia sẻ|nhập).{0,35}(?:OTP|mã xác thực)|(?:OTP|mã xác thực).{0,35}(?:cung cấp|đọc|gửi|chia sẻ)/i.test(text)
        && !/(?:không|đừng|tuyệt đối không)\s+(?:được\s+)?chia sẻ/i.test(text);
    const critical = otpRequest || /\b(?:mật\s+khẩu|PIN|chuyển\s+(?:tiền|khoản)|đóng\s+phí|AnyDesk|TeamViewer|chia\s+sẻ\s+màn\s+hình)\b/i.test(text);
    const accountThreat = /\b(?:tài\s+khoản|thẻ)\D{0,30}(?:bị|sẽ\s+bị)\s+(?:khóa|khoá|đóng)\b/i.test(text);
    const pressure = /\b(?:ngay|trong\s+\d+\s+phút|nếu\s+không|giữ\s+bí\s+mật|đừng\s+gọi)\b/i.test(text);
    const injection = /(?:ignore\s+(?:all\s+)?(?:previous|prior)|bỏ\s+qua.{0,20}(?:chỉ\s+dẫn|quy\s+tắc))/i.test(text);
    const suspiciousLink = /(?:https?:\/\/|www\.)[^\s<>'"]+\.(?:top|xyz|click|vip|info|example)(?=[\/:?#\s<>'"]|$)/i.test(text);
    const rank = { 'An toàn': 0, 'Nghi ngờ': 1, 'Nguy hiểm': 2 };
    const score = (critical ? 3 : 0)
        + (accountThreat ? 2 : 0)
        + (pressure ? 1 : 0)
        + (injection ? 2 : 0)
        + (suspiciousLink ? 2 : 0);
    const ruleLabel = score >= 5 ? 'Nguy hiểm' : (score > 0 ? 'Nghi ngờ' : 'An toàn');
    return rank[ruleLabel] > rank[aiLabel] ? ruleLabel : aiLabel;
}

function calculateMetrics(results, predictionKey) {
    const matrix = Object.fromEntries(labels.map(actual => [actual, Object.fromEntries(labels.map(predicted => [predicted, 0]))]));
    results.forEach(result => { matrix[result.label][result[predictionKey]] += 1; });
    const correct = results.filter(result => result.label === result[predictionKey]).length;
    const dangerous = results.filter(result => result.label === 'Nguy hiểm');
    const dangerousRecall = dangerous.filter(result => result[predictionKey] === 'Nguy hiểm').length / dangerous.length;
    return { matrix, accuracy: correct / results.length, dangerousRecall };
}

function matrixHtml(title, metrics) {
    return `<section><h2>${title}</h2><p>Độ chính xác: <strong>${(metrics.accuracy * 100).toFixed(1)}%</strong> · Độ phủ Nguy hiểm: <strong>${(metrics.dangerousRecall * 100).toFixed(1)}%</strong></p>
        <table><thead><tr><th>Thực tế ↓ / Dự đoán →</th>${labels.map(label => `<th>${label}</th>`).join('')}</tr></thead>
        <tbody>${labels.map(actual => `<tr><th>${actual}</th>${labels.map(predicted => `<td>${metrics.matrix[actual][predicted]}</td>`).join('')}</tr>`).join('')}</tbody></table></section>`;
}

async function classify(item) {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            role: 'evaluation',
            contents: `<TIN_NHAN_KHONG_TIN_CAY>\n${item.text}\n</TIN_NHAN_KHONG_TIN_CAY>`,
            stream: false
        })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Máy chủ trả về lỗi ${response.status}.`);
    const parsed = JSON.parse(payload.text);
    if (!labels.includes(parsed.muc_do_rui_ro)) throw new Error('Nhãn không hợp lệ');
    return parsed.muc_do_rui_ro;
}

let latestReport = null;

async function runEvaluation() {
    const isAutomated = new URLSearchParams(location.search).get('autorun') === '1';
    if (!isAutomated && !confirm(`Đánh giá sẽ gọi Gemini ${dataset.length} lần. Tiếp tục?`)) return;

    runButton.disabled = true;
    const results = [];
    for (let index = 0; index < dataset.length; index += 1) {
        const item = dataset[index];
        progress.textContent = `Đang chạy ${index + 1}/${dataset.length}: ${item.id}`;
        try {
            const aiLabel = await classify(item);
            results.push({ ...item, aiLabel, finalLabel: applySafetyRules(item.text, aiLabel), error: '' });
        } catch (error) {
            results.push({ ...item, aiLabel: 'Nghi ngờ', finalLabel: 'Nghi ngờ', error: error.message });
        }
    }

    const before = calculateMetrics(results, 'aiLabel');
    const after = calculateMetrics(results, 'finalLabel');
    const weaknesses = results.filter(result => result.label !== result.finalLabel).slice(0, 3);
    summary.innerHTML = matrixHtml('Trước lớp luật', before) + matrixHtml('Sau lớp luật', after)
        + `<section><h2>Điểm yếu cụ thể</h2>${weaknesses.length ? `<ol>${weaknesses.map(item => `<li><strong>${item.id}</strong>: ${escapeHtml(item.reason)} — dự đoán ${item.finalLabel}, nhãn đúng ${item.label}.</li>`).join('')}</ol>` : '<p>Chưa có mẫu sai trong lần chạy này.</p>'}</section>`;
    table.innerHTML = `<thead><tr><th>Mã</th><th>Tin</th><th>Thực tế</th><th>AI</th><th>Sau luật</th><th>Kết quả</th></tr></thead><tbody>${results.map(result => `
        <tr class="${result.label === result.finalLabel ? 'is-correct' : 'is-incorrect'}"><td>${result.id}</td><td>${escapeHtml(result.text)}</td><td>${result.label}</td><td>${result.aiLabel}</td><td>${result.finalLabel}</td><td>${result.error ? escapeHtml(result.error) : (result.label === result.finalLabel ? 'Đúng' : 'Sai')}</td></tr>
    `).join('')}</tbody>`;
    progress.textContent = `Đã hoàn tất ${results.length} mẫu. Có ${dataset.filter(item => item.hard).length} tin khó.`;
    latestReport = { generatedAt: new Date().toISOString(), model: EVALUATION_MODEL, before, after, results };
    downloadButton.classList.remove('hidden');
    document.body.dataset.evaluation = 'complete';
    runButton.disabled = false;
}

runButton.addEventListener('click', runEvaluation);
downloadButton.addEventListener('click', () => {
    if (!latestReport) return;
    const blob = new Blob([JSON.stringify(latestReport, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `scamcheck-evaluation-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
});

if (new URLSearchParams(location.search).get('autorun') === '1') runEvaluation();
