window.ORGANIZATION_CATALOG = Object.freeze([
    {
        category: 'Cơ quan Chính phủ và nhà nước',
        organizations: [
            'Văn phòng Chính phủ',
            'Cổng Dịch vụ công Quốc gia',
            'Bộ Công an',
            { name: 'Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao', aliases: ['Cục An ninh mạng', 'A05'] },
            { name: 'Bộ Khoa học và Công nghệ', aliases: ['Bộ Thông tin và Truyền thông', 'Bộ TT&TT', 'Bộ TTTT'] },
            'Bộ Tài chính',
            'Ngân hàng Nhà nước Việt Nam',
            { name: 'Cục Thuế', aliases: ['Tổng cục Thuế'] },
            { name: 'Cục Hải quan', aliases: ['Tổng cục Hải quan', 'Hải quan Việt Nam'] },
            'Bảo hiểm xã hội Việt Nam',
            'Bộ Y tế',
            { name: 'Bộ Giáo dục và Đào tạo', aliases: ['Bộ Giáo dục'] },
            'Bộ Nội vụ',
            { name: 'Bộ Lao động - Thương binh và Xã hội (tên cũ)', aliases: ['Bộ Lao động', 'Bộ Lao động - Thương binh và Xã hội'] },
            'Bộ Tư pháp',
            'Bộ Ngoại giao',
            { name: 'Công an tỉnh, thành phố', aliases: ['Công an tỉnh', 'Công an thành phố', 'Công an TP', 'Công an'] },
            { name: 'Ủy ban nhân dân tỉnh, thành phố', aliases: ['UBND', 'Ủy ban nhân dân'] },
            { name: 'Trung tâm Giám sát an toàn không gian mạng quốc gia', aliases: ['NCSC'] },
            { name: 'Cục Cảnh sát quản lý hành chính về trật tự xã hội', aliases: ['Cục Cảnh sát QLHC', 'C06'] },
            'Cơ quan Căn cước công dân',
            'Trung tâm Dữ liệu quốc gia',
            { name: 'VNeID', aliases: ['Cổng định danh VNeID', 'Định danh điện tử VNeID'] }
        ]
    },
    {
        category: 'Ngân hàng',
        organizations: [
            { name: 'Vietcombank', aliases: ['VCB', 'Ngân hàng Ngoại thương'] },
            { name: 'BIDV', aliases: ['Ngân hàng Đầu tư và Phát triển Việt Nam'] },
            { name: 'VietinBank', aliases: ['Ngân hàng Công Thương'] },
            'Agribank', 'Techcombank',
            { name: 'MB Bank', aliases: ['MB', 'Ngân hàng Quân đội'] },
            'ACB', 'VPBank', 'Sacombank', 'HDBank', 'TPBank', 'SHB', 'VIB', 'OCB',
            'Eximbank', 'ABBank', 'SeABank', 'Nam A Bank', 'LPBank', 'PVcomBank',
            'BaoViet Bank',
            { name: 'MBV', aliases: ['OceanBank', 'Ngân hàng Đại Dương'] },
            'GPBank',
            { name: 'VCBNeo', aliases: ['CBBank', 'Ngân hàng Xây dựng'] },
            'NCB', 'KienlongBank', 'VietABank', 'Bac A Bank', 'Saigonbank', 'PGBank',
            'MSB', 'CIMB Việt Nam', 'Woori Bank', 'Shinhan Bank', 'UOB', 'HSBC Việt Nam',
            'Standard Chartered Việt Nam', 'Public Bank Việt Nam', 'Hong Leong Bank Việt Nam'
        ]
    },
    {
        category: 'Ví điện tử',
        organizations: ['MoMo', 'ZaloPay', 'VNPAY', 'ShopeePay', 'Viettel Money', 'FPT Pay', 'Payoo', 'SmartPay', 'Foxpay', 'VNPT Money']
    },
    {
        category: 'Nhà mạng',
        organizations: ['Viettel', 'VinaPhone', 'MobiFone', 'Vietnamobile', 'Gmobile']
    },
    {
        category: 'Điện lực',
        organizations: [{ name: 'EVN', aliases: ['Tập đoàn Điện lực Việt Nam', 'Điện lực Việt Nam'] }, 'EVNHANOI', 'EVNHCMC', 'EVNNPC', 'EVNCPC', 'EVNSPC']
    },
    {
        category: 'Nước sạch',
        organizations: ['SAWACO', 'HAWACO', 'HueWACO', 'Da Nang Water', { name: 'Công ty cấp nước tỉnh, thành phố', aliases: ['cấp nước', 'nước sạch'] }]
    },
    {
        category: 'Internet và truyền hình',
        organizations: ['Viettel Telecom', 'VNPT', 'FPT Telecom', 'SCTV', 'CMC Telecom']
    },
    {
        category: 'Chuyển phát',
        organizations: ['Vietnam Post', 'Viettel Post', 'Giao Hàng Nhanh', 'Giao Hàng Tiết Kiệm', 'J&T Express', 'Ninja Van', 'BEST Express', 'EMS']
    },
    {
        category: 'Hàng không',
        organizations: ['Vietnam Airlines', 'Vietjet Air', 'Bamboo Airways', 'Pacific Airlines', 'VASCO']
    },
    {
        category: 'Đường sắt',
        organizations: ['Tổng công ty Đường sắt Việt Nam']
    },
    {
        category: 'Taxi và gọi xe',
        organizations: ['Mai Linh', 'Vinasun', 'Xanh SM', 'Grab', 'Be']
    },
    {
        category: 'Sàn thương mại điện tử',
        organizations: ['Shopee', 'Lazada', 'Tiki', 'TikTok Shop']
    },
    {
        category: 'Công ty tài chính',
        organizations: ['FE Credit', 'Home Credit', 'HD Saison', 'Mirae Asset', 'Shinhan Finance', 'Mcredit', 'Easy Credit', 'JACCS']
    },
    {
        category: 'Bảo hiểm',
        organizations: ['Bảo Việt', 'PVI', 'PTI', 'MIC', 'BIC', 'Prudential', 'Manulife', 'AIA', 'Dai-ichi Life', 'Chubb', 'Generali', 'Sun Life', 'FWD']
    },
    {
        category: 'Mạng xã hội và nhắn tin',
        organizations: ['Facebook', 'Messenger', 'Zalo', 'Telegram', 'WhatsApp', 'Viber', 'TikTok', 'Instagram']
    },
    {
        category: 'Email',
        organizations: ['Gmail', 'Outlook', 'Yahoo Mail', 'iCloud Mail']
    },
    {
        category: 'Công nghệ',
        organizations: ['Apple', 'Google', 'Microsoft', 'Samsung', 'Xiaomi', 'OPPO', 'vivo']
    },
    {
        category: 'Mạng lưới thẻ',
        organizations: ['Visa', 'Mastercard', 'JCB', 'NAPAS']
    },
    {
        category: 'Cổng thanh toán',
        organizations: ['VNPAY', 'OnePay', 'AlePay', 'Payoo']
    },
    {
        category: 'Dịch vụ phổ biến với người lớn tuổi',
        organizations: [
            'Bệnh viện Bạch Mai', 'Bệnh viện Chợ Rẫy', 'Bệnh viện Hữu nghị Việt Đức',
            'Bệnh viện Trung ương Quân đội 108', 'Bệnh viện Đại học Y Dược',
            'Điện Máy Xanh', 'Thế Giới Di Động', 'FPT Shop', 'CellphoneS', 'Nguyễn Kim',
            'Co.opmart', 'WinMart', 'GO!', 'Bách Hóa Xanh'
        ]
    }
]);
