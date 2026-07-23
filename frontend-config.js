// Public frontend configuration. This file must never contain an API key.
const isLocalScamCheck = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
const isBackendHostedPage =
    (isLocalScamCheck && ['5000', '8766'].includes(window.location.port)) ||
    window.location.hostname.endsWith('.onrender.com');
window.SCAMCHECK_CONFIG = Object.freeze({
    API_BASE_URL: isBackendHostedPage
        ? window.location.origin
        : (isLocalScamCheck
            ? 'http://127.0.0.1:5000'
            : 'https://scamcheck-api-minhkhoitn12345.onrender.com')
});
