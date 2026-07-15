import { GoogleGenAI } from 'https://esm.run/@google/genai';

const checkBtn = document.getElementById('checkBtn');
const resultDiv = document.getElementById('result');
const resultContainer = document.getElementById('resultContainer');
const smsInput = document.getElementById('smsInput');
const loadingIndicator = document.getElementById('loadingIndicator');
const historyList = document.getElementById('historyList');
const checkerSection = document.getElementById('checkerSection');
const practiceSection = document.getElementById('practiceSection');
const historySection = document.getElementById('historySection');
const categoryButtons = document.querySelectorAll('.category-btn');
const pageTitle = document.getElementById('pageTitle');
const brandHome = document.getElementById('brandHome');
const practiceScore = document.getElementById('practiceScore');
const practiceQuestion = document.getElementById('practiceQuestion');
const practiceScamBtn = document.getElementById('practiceScamBtn');
const practiceSafeBtn = document.getElementById('practiceSafeBtn');
const questionNavigator = document.getElementById('questionNavigator');
const previousQuestionBtn = document.getElementById('previousQuestionBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const submitQuizBtn = document.getElementById('submitQuizBtn');
const quizWorkspace = document.getElementById('quizWorkspace');
const quizResults = document.getElementById('quizResults');

const HISTORY_KEY = 'scamcheck-history';
const MAX_HISTORY_ITEMS = 10;
const OFFICIAL_PHONES = Object.freeze({
    Vietcombank: '1900545413',
    CucAnToanThongTin: '156',
    CongAn: '113'
});
const BLOCKED_PHONE_MESSAGE = '[Số điện thoại đã bị hệ thống chặn để bảo vệ bác - Vui lòng chỉ gọi số in trên thẻ ngân hàng]';
const sampleMessages = {
    bank: 'Ngân hàng thông báo tài khoản của quý khách bị khóa. Vui lòng truy cập đường link http://kiemtra-taikhoan.example để xác minh ngay, nếu không tài khoản sẽ bị đóng.',
    police: 'CÔNG AN thông báo bạn có liên quan đến vụ án. Yêu cầu giữ bí mật và gọi ngay số 0900000000 để làm việc, nếu không sẽ bị bắt giữ.',
    prize: 'Chúc mừng bạn đã trúng thưởng 50.000.000 đồng. Hãy bấm vào link http://nhanthuong.example và nộp phí nhận thưởng ngay hôm nay.'
};

const practiceMessages = [
    { text: 'Ngân hàng yêu cầu bác cung cấp mã OTP qua điện thoại để mở khóa tài khoản ngay.', label: 'Lừa đảo', explanation: 'Ngân hàng không yêu cầu khách hàng đọc mã OTP. Kẻ gian đang tạo cảm giác gấp gáp để bác làm theo.' },
    { text: 'Công an gọi yêu cầu bác chuyển tiền vào tài khoản “an toàn” để chứng minh mình vô tội.', label: 'Lừa đảo', explanation: 'Cơ quan công an không xử lý vụ việc bằng cách yêu cầu chuyển tiền vào tài khoản cá nhân hay tài khoản “an toàn”.' },
    { text: 'Bác trúng xe máy, chỉ cần đóng trước 500.000 đồng phí hồ sơ qua link lạ để nhận thưởng.', label: 'Lừa đảo', explanation: 'Giải thưởng bất ngờ đi kèm yêu cầu nộp phí trước là dấu hiệu lừa đảo phổ biến đánh vào lòng tham.' },
    { text: 'Đơn hàng của bác bị giữ. Bấm vào http://giaohang-nhanh.top để cập nhật địa chỉ trong 5 phút.', label: 'Lừa đảo', explanation: 'Tên miền lạ và thời hạn rất gấp là cách kẻ xấu ép bác bấm link trước khi kịp kiểm tra.' },
    { text: 'Con đang cấp cứu, mẹ chuyển ngay 10 triệu vào số tài khoản này, đừng gọi lại.', label: 'Lừa đảo', explanation: 'Tin nhắn tạo hoảng sợ và ngăn bác xác minh. Hãy gọi trực tiếp cho người thân bằng số quen thuộc.' },
    { text: 'Hóa đơn điện tháng này của bác là 245.000 đồng. Bác có thể xem trong ứng dụng điện lực đã cài đặt.', label: 'An toàn', explanation: 'Tin nhắn chỉ cung cấp thông tin và hướng bác kiểm tra trong ứng dụng chính thức, không đòi mã hay chuyển tiền gấp.' },
    { text: 'Chúc mừng sinh nhật bác. Gia đình mình hẹn ăn cơm lúc 6 giờ tối nay nhé.', label: 'An toàn', explanation: 'Đây là lời nhắn cá nhân bình thường, không có yêu cầu tiền bạc, mã xác thực hay liên kết lạ.' },
    { text: 'Ngân hàng thông báo: Nếu cần hỗ trợ, bác vui lòng gọi số in ở mặt sau thẻ hoặc đến quầy giao dịch.', label: 'An toàn', explanation: 'Nội dung hướng bác đến kênh xác minh chính thức và không yêu cầu cung cấp thông tin nhạy cảm.' },
    { text: 'Lịch khám của bác tại bệnh viện là 8 giờ sáng thứ Hai. Vui lòng mang theo thẻ bảo hiểm y tế.', label: 'An toàn', explanation: 'Tin nhắn nhắc lịch có thông tin cụ thể, không chứa link lạ hoặc yêu cầu thanh toán bất thường.' },
    { text: 'Tổ dân phố thông báo họp lúc 19 giờ tối thứ Sáu tại nhà văn hóa khu phố.', label: 'An toàn', explanation: 'Đây là thông báo cộng đồng thông thường, không tạo áp lực về tiền, mã OTP hay đường dẫn.' }
];

let practiceIndex = 0;
const userAnswers = Array(10).fill(null);
let quizSubmitted = false;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const detectiveInstruction = `Bạn là chuyên gia phân tích an ninh mạng tên "Thám tử". Phân tích tin nhắn nghi ngờ lừa đảo cho người dùng trên 45 tuổi. Phong cách khô khan, lý tính, chính xác và cực kỳ cẩn thận.

Chỉ trả về duy nhất một JSON hợp lệ, không dùng Markdown và không kèm bất kỳ lời dẫn giải nào. JSON phải có chính xác cấu trúc đã yêu cầu. "muc_do_rui_ro" chỉ được là "An toàn", "Nghi ngờ" hoặc "Nguy hiểm"; "mau_sac" tương ứng chỉ được là "green", "yellow" hoặc "red". Mỗi "trich_doan" phải là chuỗi xuất hiện 100% chính xác trong tin nhắn gốc; không suy diễn, không chỉnh sửa và không tự tạo trích đoạn. "hanh_dong_de_xuat" luôn có đúng 3 hành động cụ thể, dễ hiểu cho người lớn tuổi.`;

const psychologyInstruction = `Bạn là "Cô tâm lý", hỗ trợ người dùng trên 45 tuổi nhận ra chiêu thức lừa đảo. Xưng "cô" và gọi người dùng là "bác". Dựa hoàn toàn vào tin nhắn và kết quả kỹ thuật được cung cấp, hãy giải thích gần gũi vì sao bác có thể suýt tin, tập trung vào việc kẻ gian đánh vào nỗi sợ hoặc lòng tham nếu có. Chỉ trả lời bằng 2 đến 3 câu ngắn, không dùng Markdown, không lặp lại danh sách kỹ thuật và không đưa ra kết luận trái với phần kỹ thuật.`;
const PSYCHOLOGY_BUSY_MESSAGE = 'Cô tâm lý đang bận, bác xem trước phần kỹ thuật nhé.';

const responseJsonSchema = {
    type: 'object',
    required: ['muc_do_rui_ro', 'mau_sac', 'danh_sach_dau_hieu', 'hanh_dong_de_xuat'],
    properties: {
        muc_do_rui_ro: { type: 'string', enum: ['An toàn', 'Nghi ngờ', 'Nguy hiểm'] },
        mau_sac: { type: 'string', enum: ['green', 'yellow', 'red'] },
        danh_sach_dau_hieu: {
            type: 'array',
            items: {
                type: 'object',
                required: ['mo_ta', 'trich_doan'],
                properties: {
                    mo_ta: { type: 'string' },
                    trich_doan: { type: 'string' }
                }
            }
        },
        hanh_dong_de_xuat: {
            type: 'array',
            minItems: 3,
            maxItems: 3,
            items: { type: 'string' }
        }
    }
};

function createSafeAnalysis() {
    return {
        muc_do_rui_ro: 'An toàn',
        mau_sac: 'green',
        danh_sach_dau_hieu: [],
        hanh_dong_de_xuat: [
            'Không cung cấp thông tin cá nhân hoặc mã xác thực.',
            'Không nhấp vào đường link hoặc gọi số điện thoại trong tin nhắn.',
            'Liên hệ trực tiếp với ngân hàng hoặc đơn vị liên quan để kiểm tra.'
        ]
    };
}

function parseAIResponse(responseText) {
    try {
        const jsonText = responseText.trim().replace(/^```json\s*|\s*```$/g, '');
        const analysis = JSON.parse(jsonText);
        const validRisks = { 'An toàn': 'green', 'Nghi ngờ': 'yellow', 'Nguy hiểm': 'red' };
        const hasValidSigns = Array.isArray(analysis.danh_sach_dau_hieu)
            && analysis.danh_sach_dau_hieu.every(sign => (
                sign && typeof sign.mo_ta === 'string' && typeof sign.trich_doan === 'string'
            ));
        const hasValidActions = Array.isArray(analysis.hanh_dong_de_xuat)
            && analysis.hanh_dong_de_xuat.length === 3
            && analysis.hanh_dong_de_xuat.every(action => typeof action === 'string');

        if (!analysis || validRisks[analysis.muc_do_rui_ro] !== analysis.mau_sac
            || !hasValidSigns || !hasValidActions) {
            return createSafeAnalysis();
        }

        return analysis;
    } catch {
        return createSafeAnalysis();
    }
}

function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
    }[character]));
}

function sanitizePhoneNumbers(text) {
    if (typeof text !== 'string') return text;

    // Matches 3–11 digits even when spaces, dots, or hyphens separate the digits.
    const phonePattern = /(^|[^\d])((?:\d[ .-]?){2,10}\d)(?!\d)/g;
    const officialPhoneValues = new Set(Object.values(OFFICIAL_PHONES));

    return text.replace(phonePattern, (match, prefix, phone) => {
        const normalizedPhone = phone.replace(/\D/g, '');
        return officialPhoneValues.has(normalizedPhone)
            ? `${prefix}${phone}`
            : `${prefix}${BLOCKED_PHONE_MESSAGE}`;
    });
}

function sanitizeRescuerGuidance(analysis) {
    return {
        ...analysis,
        hanh_dong_de_xuat: analysis.hanh_dong_de_xuat.map(sanitizePhoneNumbers)
    };
}

function extractLinks(text) {
    const matches = text.match(/(?:https?:\/\/|www\.)[^\s<>'"]+/gi) || [];
    return matches.map(link => link.replace(/[.,!?;:)}\]]+$/, ''));
}

function levenshteinDistance(first, second) {
    const previous = Array.from({ length: second.length + 1 }, (_, index) => index);
    for (let row = 1; row <= first.length; row += 1) {
        let diagonal = previous[0];
        previous[0] = row;
        for (let column = 1; column <= second.length; column += 1) {
            const saved = previous[column];
            previous[column] = Math.min(
                previous[column] + 1,
                previous[column - 1] + 1,
                diagonal + (first[row - 1] === second[column - 1] ? 0 : 1)
            );
            diagonal = saved;
        }
    }
    return previous[second.length];
}

function detectFakeDomains(links) {
    const officialDomains = ['vietcombank.com.vn', 'bidv.com.vn', 'mbbank.com.vn', 'techcombank.com', 'vpbank.com.vn', 'agribank.com.vn'];
    const knownBrands = ['vietcombank', 'bidv', 'mbbank', 'techcombank', 'vpbank', 'agribank'];
    const suspiciousTlds = ['.top', '.xyz', '.click', '.vip', '.info'];

    return links.flatMap(link => {
        try {
            const domain = new URL(link.startsWith('http') ? link : `https://${link}`).hostname.toLowerCase().replace(/^www\./, '');
            if (officialDomains.some(official => domain === official || domain.endsWith(`.${official}`))) return [];

            const compactDomain = domain.replace(/[^a-z0-9]/g, '');
            const brandTypo = knownBrands.find(brand => compactDomain.includes(brand)
                || domain.split('.').some(part => levenshteinDistance(part, brand) <= 2));
            const hasSuspiciousTld = suspiciousTlds.some(tld => domain.endsWith(tld));

            if (brandTypo || hasSuspiciousTld) {
                return [{
                    url: link,
                    domain,
                    reason: brandTypo
                        ? `Tên miền có dấu hiệu giả mạo thương hiệu ${brandTypo}.`
                        : 'Tên miền lạ thường được dùng trong các chiến dịch lừa đảo.'
                }];
            }
        } catch {
            return [{ url: link, domain: link, reason: 'Đường dẫn không hợp lệ hoặc khó xác minh.' }];
        }
        return [];
    });
}

function highlightText(originalText, signs) {
    const ranges = [];

    signs.forEach(({ trich_doan }) => {
        if (!trich_doan) return;

        let startIndex = 0;
        while (startIndex < originalText.length) {
            const index = originalText.indexOf(trich_doan, startIndex);
            if (index === -1) break;
            ranges.push([index, index + trich_doan.length]);
            startIndex = index + trich_doan.length;
        }
    });

    const mergedRanges = ranges
        .sort((first, second) => first[0] - second[0] || second[1] - first[1])
        .reduce((merged, range) => {
            const previous = merged.at(-1);
            if (previous && range[0] <= previous[1]) {
                previous[1] = Math.max(previous[1], range[1]);
            } else {
                merged.push([...range]);
            }
            return merged;
        }, []);

    let html = '';
    let cursor = 0;
    mergedRanges.forEach(([start, end]) => {
        html += escapeHtml(originalText.slice(cursor, start));
        html += `<mark>${escapeHtml(originalText.slice(start, end))}</mark>`;
        cursor = end;
    });

    return html + escapeHtml(originalText.slice(cursor));
}

function renderAnalysis(originalText, analysis, psychologyNote = null) {
    const signsHtml = analysis.danh_sach_dau_hieu.length
        ? `<ul>${analysis.danh_sach_dau_hieu.map(sign => `<li><strong>${escapeHtml(sign.mo_ta)}:</strong> ${escapeHtml(sign.trich_doan)}</li>`).join('')}</ul>`
        : '<p>Không phát hiện dấu hiệu lừa đảo rõ ràng trong nội dung này.</p>';
    const actionsHtml = analysis.hanh_dong_de_xuat
        .map(action => `<li>${escapeHtml(action)}</li>`)
        .join('');
    const psychologyHtml = psychologyNote
        ? escapeHtml(psychologyNote)
        : 'Tin nhắn được đánh giá An toàn nên chưa cần phần giải thích tâm lý.';
    const fakeDomains = detectFakeDomains(extractLinks(originalText));
    const linkWarningHtml = fakeDomains.length
        ? `<div class="fake-domain-warning"><strong>Cảnh báo đường dẫn giả mạo</strong><ul>${fakeDomains.map(item => `<li><strong>${escapeHtml(item.domain)}:</strong> ${escapeHtml(item.reason)}</li>`).join('')}</ul></div>`
        : '';

    resultDiv.innerHTML = `
        <div class="risk-badge risk-${analysis.mau_sac}" role="status">
            Mức độ rủi ro: ${escapeHtml(analysis.muc_do_rui_ro)}
        </div>
        <section class="analysis-section technical-analysis">
            <h3>Phân tích kỹ thuật</h3>
            ${linkWarningHtml}
            <h4>Nội dung tin nhắn</h4>
            <div class="message-content">${highlightText(originalText, analysis.danh_sach_dau_hieu)}</div>
            <h4>Dấu hiệu cần lưu ý</h4>
            ${signsHtml}
            <h4>Hành động đề xuất</h4>
            <ol class="recommended-actions">${actionsHtml}</ol>
        </section>
        <section class="analysis-section psychology-analysis">
            <h3>Hiểu vì sao mình suýt tin</h3>
            <p>${psychologyHtml}</p>
        </section>
    `;
}

function renderQuestionNavigator() {
    questionNavigator.innerHTML = practiceMessages.map((_, index) => {
        const isCurrent = index === practiceIndex;
        const isAnswered = userAnswers[index] !== null;
        const stateClass = `${isCurrent ? ' is-current' : ''}${isAnswered ? ' is-answered' : ''}`;
        return `<button type="button" class="question-number-btn${stateClass}" data-question-index="${index}" aria-current="${isCurrent ? 'step' : 'false'}">${index + 1}</button>`;
    }).join('');
}

function renderPracticeQuestion() {
    const item = practiceMessages[practiceIndex];
    const answeredCount = userAnswers.filter(answer => answer !== null).length;
    const selectedAnswer = userAnswers[practiceIndex];

    practiceScore.textContent = `Câu ${practiceIndex + 1}/10 · Đã chọn đáp án: ${answeredCount}/10`;
    practiceQuestion.innerHTML = `<h3>Tin nhắn</h3><p>${escapeHtml(item.text)}</p><p><strong>Theo bác, đây là tin gì?</strong></p>`;
    practiceScamBtn.disabled = false;
    practiceSafeBtn.disabled = false;
    practiceScamBtn.setAttribute('aria-pressed', String(selectedAnswer === 'Lừa đảo'));
    practiceSafeBtn.setAttribute('aria-pressed', String(selectedAnswer === 'An toàn'));
    previousQuestionBtn.disabled = practiceIndex === 0;
    nextQuestionBtn.disabled = practiceIndex === practiceMessages.length - 1;
    submitQuizBtn.disabled = answeredCount !== practiceMessages.length;
    renderQuestionNavigator();
}

function goToQuestion(index) {
    if (quizSubmitted || index < 0 || index >= practiceMessages.length) return;
    practiceIndex = index;
    renderPracticeQuestion();
}

function answerPractice(answer) {
    if (quizSubmitted) return;
    userAnswers[practiceIndex] = answer;
    renderPracticeQuestion();
}

function submitQuiz() {
    if (userAnswers.some(answer => answer === null)) return;

    quizSubmitted = true;
    const correctCount = userAnswers.reduce((total, answer, index) => (
        total + Number(answer === practiceMessages[index].label)
    ), 0);
    const incorrectCount = practiceMessages.length - correctCount;
    const missedLessons = practiceMessages
        .filter((item, index) => userAnswers[index] !== item.label)
        .map(item => item.explanation)
        .slice(0, 3)
        .join(' ');
    const reviewHtml = practiceMessages.map((item, index) => {
        const isCorrect = userAnswers[index] === item.label;
        return `<li class="quiz-review-item ${isCorrect ? 'is-correct' : 'is-incorrect'}">
            Câu ${index + 1}: ${isCorrect ? 'Đúng' : `Chưa đúng — đáp án: ${escapeHtml(item.label)}`}
        </li>`;
    }).join('');
    const advice = incorrectCount === 0
        ? 'Cô tâm lý: Bác làm rất tốt. Hãy tiếp tục giữ thói quen dừng lại và kiểm tra trước khi bấm vào liên kết lạ.'
        : incorrectCount > 3
            ? `Cô tâm lý: Bác đừng lo, đây là những chiêu thức rất dễ gây nhầm lẫn. Bác nên luyện lại phần này. ${missedLessons}`
            : `Cô tâm lý: Bác đã nhận ra nhiều dấu hiệu quan trọng. Với những câu còn nhầm, hãy bình tĩnh kiểm tra qua kênh chính thức trước khi làm theo. ${missedLessons}`;
    const retryHtml = incorrectCount > 3
        ? '<button type="button" id="retryQuizBtn" class="retry-quiz-btn">Luyện tập lại phần này</button>'
        : '';

    quizWorkspace.classList.add('hidden');
    quizResults.classList.remove('hidden');
    quizResults.innerHTML = `
        <h3>Kết quả bài kiểm tra</h3>
        <p class="quiz-score-summary">Bác đạt ${correctCount}/${practiceMessages.length} câu đúng</p>
        <ul class="quiz-review-list">${reviewHtml}</ul>
        <p class="quiz-advice">${advice}</p>
        ${retryHtml}
    `;
}

function resetQuiz() {
    practiceIndex = 0;
    userAnswers.fill(null);
    quizSubmitted = false;
    quizResults.classList.add('hidden');
    quizResults.innerHTML = '';
    quizWorkspace.classList.remove('hidden');
    renderPracticeQuestion();
}

const viewConfig = {
    checkerSection: { title: 'Kiểm tra tin nhắn', hash: 'kiem-tra' },
    practiceSection: { title: 'Luyện tập kỹ năng', hash: 'luyen-tap' },
    historySection: { title: 'Lịch sử kiểm tra', hash: 'lich-su' }
};

function showView(viewId, updateHash = true) {
    if (!viewConfig[viewId]) return;

    [checkerSection, practiceSection, historySection].forEach(section => {
        section.classList.toggle('hidden', section.id !== viewId);
    });
    categoryButtons.forEach(button => {
        const isActive = button.dataset.view === viewId;
        button.classList.toggle('is-active', isActive);
        if (isActive) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
    });
    pageTitle.textContent = viewConfig[viewId].title;

    if (viewId === 'practiceSection' && !quizSubmitted) renderPracticeQuestion();
    if (viewId === 'historySection') renderHistory();
    if (updateHash) history.replaceState(null, '', `#${viewConfig[viewId].hash}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getHistory() {
    try {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        return Array.isArray(history)
            ? history.filter(entry => entry && typeof entry.text === 'string')
            : [];
    } catch {
        return [];
    }
}

function renderHistory() {
    const history = getHistory();
    if (!history.length) {
        historyList.innerHTML = '<p>Chưa có lịch sử kiểm tra.</p>';
        return;
    }

    historyList.innerHTML = history.map((entry, index) => {
        const analysis = parseAIResponse(JSON.stringify(entry.analysis));
        const preview = entry.text.replace(/\s+/g, ' ').slice(0, 90);
        return `<button type="button" class="history-item" data-history-index="${index}">
            <strong>${escapeHtml(analysis.muc_do_rui_ro)}</strong><br>
            ${escapeHtml(preview)}${entry.text.length > preview.length ? '…' : ''}
        </button>`;
    }).join('');
}

function saveHistory(text, analysis, psychologyNote) {
    try {
        const history = getHistory();
        history.unshift({ text, analysis, psychologyNote, savedAt: new Date().toISOString() });
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_ITEMS)));
        renderHistory();
    } catch (error) {
        console.warn('Không thể lưu lịch sử kiểm tra:', error);
    }
}

document.querySelectorAll('.sample-btn').forEach(button => {
    button.addEventListener('click', () => {
        smsInput.value = sampleMessages[button.dataset.sample];
        smsInput.focus();
    });
});

historyList.addEventListener('click', event => {
    const button = event.target.closest('[data-history-index]');
    if (!button) return;

    const entry = getHistory()[Number(button.dataset.historyIndex)];
    if (!entry || typeof entry.text !== 'string') return;

    showView('checkerSection');
    smsInput.value = entry.text;
    resultContainer.classList.remove('hidden');
    const analysis = sanitizeRescuerGuidance(parseAIResponse(JSON.stringify(entry.analysis)));
    const psychologyNote = typeof entry.psychologyNote === 'string'
        ? sanitizePhoneNumbers(entry.psychologyNote)
        : (analysis.muc_do_rui_ro === 'An toàn' ? null : PSYCHOLOGY_BUSY_MESSAGE);
    renderAnalysis(entry.text, analysis, psychologyNote);
    window.scrollTo({ top: resultContainer.offsetTop - 16, behavior: 'smooth' });
});

categoryButtons.forEach(button => {
    button.addEventListener('click', () => showView(button.dataset.view));
});
brandHome.addEventListener('click', event => {
    event.preventDefault();
    showView('checkerSection');
});
practiceScamBtn.addEventListener('click', () => answerPractice('Lừa đảo'));
practiceSafeBtn.addEventListener('click', () => answerPractice('An toàn'));
questionNavigator.addEventListener('click', event => {
    const button = event.target.closest('[data-question-index]');
    if (button) goToQuestion(Number(button.dataset.questionIndex));
});
previousQuestionBtn.addEventListener('click', () => goToQuestion(practiceIndex - 1));
nextQuestionBtn.addEventListener('click', () => goToQuestion(practiceIndex + 1));
submitQuizBtn.addEventListener('click', submitQuiz);
quizResults.addEventListener('click', event => {
    if (event.target.closest('#retryQuizBtn')) resetQuiz();
});

checkBtn.addEventListener('click', async () => {
    const text = smsInput.value.trim();

    if (!text) {
        alert('Bác vui lòng dán nội dung tin nhắn cần kiểm tra.');
        return;
    }

    if (text.length > 5000) {
        alert('Tin nhắn dài quá 5.000 ký tự. Bác vui lòng rút ngắn nội dung trước khi kiểm tra.');
        return;
    }

    resultContainer.classList.remove('hidden');
    resultDiv.innerText = 'Đang phân tích, vui lòng chờ...';
    loadingIndicator.classList.remove('hidden');
    checkBtn.disabled = true;

    try {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY') {
            throw new Error('Chưa cấu hình GEMINI_API_KEY.');
        }

        const prompt = `Tin nhắn cần phân tích:\n${text}`;
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
            config: {
                systemInstruction: detectiveInstruction,
                responseMimeType: 'application/json',
                responseJsonSchema
            }
        });
        const responseText = response.text;

        if (!responseText) {
            throw new Error('AI không trả về nội dung phân tích.');
        }

        const analysis = sanitizeRescuerGuidance(parseAIResponse(responseText));
        let psychologyNote = null;

        if (analysis.muc_do_rui_ro === 'Nghi ngờ' || analysis.muc_do_rui_ro === 'Nguy hiểm') {
            try {
                const psychologyResponse = await ai.models.generateContent({
                    model: 'gemini-3.5-flash',
                    contents: `Tin nhắn gốc:\n${text}\n\nKết quả phân tích kỹ thuật của Thám tử:\n${JSON.stringify(analysis)}`,
                    config: { systemInstruction: psychologyInstruction }
                });
                psychologyNote = sanitizePhoneNumbers(psychologyResponse.text?.trim());
                if (!psychologyNote) {
                    throw new Error('Cô tâm lý không trả về nội dung.');
                }
            } catch (psychologyError) {
                console.error('Lỗi khi gọi Cô tâm lý:', psychologyError);
                psychologyNote = PSYCHOLOGY_BUSY_MESSAGE;
            }
        }

        renderAnalysis(text, analysis, psychologyNote);
        saveHistory(text, analysis, psychologyNote);
    } catch (error) {
        console.error('Lỗi khi gọi AI:', error);
        resultDiv.innerText = `Có lỗi xảy ra khi kết nối với AI: ${error.message}`;
    } finally {
        loadingIndicator.classList.add('hidden');
        checkBtn.disabled = false;
    }
});

const initialView = Object.entries(viewConfig)
    .find(([, config]) => config.hash === window.location.hash.slice(1))?.[0] || 'checkerSection';
showView(initialView, false);
renderHistory();
