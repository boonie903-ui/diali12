import { Question } from '../types';

export const QUESTIONS_DATABASE: Question[] = [
  // --- VIỆT NAM (Lịch sử, Địa lý, Di sản & Văn hóa) ---
  {
    id: 'vn-01',
    topic: 'vietnam',
    difficulty: 'easy',
    region: 'Hà Nội',
    question: 'Hồ Gươm (Hồ Hoàn Kiếm) ở Thủ đô Hà Nội gắn liền với truyền thuyết về vị vua nào trả gươm báu cho Rùa Vàng?',
    options: ['Vua Lê Lợi (Lê Thái Tổ)', 'Vua Lý Thái Tổ', 'Vua Trần Hưng Đạo', 'Vua Quang Trung'],
    answerIndex: 0,
    explanation: 'Sau khi đánh thắng quân Minh xâm lược, vua Lê Lợi du thuyền trên hồ Tả Vọng đã trả lại thanh gươm Thuận Thiên cho Rùa Vàng, từ đó hồ đổi tên thành Hồ Hoàn Kiếm.',
    hint: 'Vị vua mở đầu cho triều đại nhà Hậu Lê, khởi nghĩa Lam Sơn.',
    triviaFact: 'Tháp Rùa giữa hồ được xây dựng vào khoảng năm 1886 trên một gò đất nhỏ.'
  },
  {
    id: 'vn-02',
    topic: 'vietnam',
    difficulty: 'easy',
    region: 'Quảng Ninh',
    question: 'Vịnh biển nào của Việt Nam hai lần được UNESCO công nhận là Di sản Thiên nhiên Thế giới với hàng nghìn hòn đảo đá vôi kỳ vĩ?',
    options: ['Vịnh Hạ Long', 'Vịnh Nha Trang', 'Vịnh Vân Phong', 'Vịnh Lăng Cô'],
    answerIndex: 0,
    explanation: 'Vịnh Hạ Long (Quảng Ninh) được UNESCO công nhận Di sản Thế giới vào năm 1994 (về giá trị thẩm mỹ) và năm 2000 (về giá trị địa chất - địa mạo).',
    hint: 'Tên gọi có ý nghĩa là "nơi rồng đáp xuống biển".',
    triviaFact: 'Vịnh có gần 2.000 hòn đảo lớn nhỏ, phần lớn là đảo đá vôi kiến tạo qua 500 triệu năm.'
  },
  {
    id: 'vn-03',
    topic: 'vietnam',
    difficulty: 'medium',
    region: 'Thừa Thiên Huế',
    question: 'Công trình kiến trúc nào dưới triều Nguyễn tại Huế là trường đại học quốc gia đầu tiên dưới thời phong kiến ở miền Trung?',
    options: ['Quốc Tử Giám triều Nguyễn', 'Điện Thái Hòa', 'Kỳ Đài', 'Ngọ Môn'],
    answerIndex: 0,
    explanation: 'Quốc Tử Giám Huế được thành lập năm 1803 dưới thời vua Gia Long tại kinh đô Huế, là trung tâm giáo dục cao cấp đào tạo nhân tài thời Nguyễn.',
    hint: 'Trường học danh tiếng kế thừa truyền thống Quốc Tử Giám Hà Nội.',
    triviaFact: 'Quần thể di tích Cố đô Huế là Di sản Văn hóa Thế giới đầu tiên của Việt Nam (1993).'
  },
  {
    id: 'vn-04',
    topic: 'vietnam',
    difficulty: 'medium',
    region: 'Quảng Nam',
    question: 'Đô thị cổ nào từng là thương cảng quốc tế sầm uất bậc nhất Đông Nam Á từ thế kỷ 16-17, nổi tiếng với Chùa Cầu?',
    options: ['Phố cổ Hội An', 'Cù Lao Chàm', 'Mỹ Sơn', 'Thương cảng Vân Đồn'],
    answerIndex: 0,
    explanation: 'Phố cổ Hội An từng là nơi giao thương sầm uất của các thương nhân Nhật Bản, Trung Hoa, Hà Lan, Bồ Đào Nha với những ngôi nhà cổ rực rỡ đèn lồng.',
    hint: 'Thành phố bên bờ sông Hoài lung linh với lễ hội hoa đăng.',
    triviaFact: 'Chùa Cầu (Lai Viễn Kiều) do các thương gia người Nhật Bản xây dựng vào thế kỷ 17.'
  },
  {
    id: 'vn-05',
    topic: 'vietnam',
    difficulty: 'easy',
    region: 'Biển Đông',
    question: 'Hai quần đảo nào là phần lãnh thổ thiêng liêng không thể tách rời của Tổ quốc Việt Nam trên Biển Đông?',
    options: ['Hoàng Sa và Trường Sa', 'Côn Đảo và Phú Quốc', 'Cô Tô và Cát Bà', 'Lý Sơn và Nam Du'],
    answerIndex: 0,
    explanation: 'Việt Nam có đầy đủ căn cứ lịch sử và cơ sở pháp lý khẳng định chủ quyền không thể chối cãi đối với hai quần đảo Hoàng Sa và Trường Sa.',
    hint: 'Hai quần đảo san hô xa bờ ở Biển Đông thuộc Đà Nẵng và Khánh Hòa.',
    triviaFact: 'Đội Hoàng Sa kiêm quản Trường Sa đã được triều đình nhà Nguyễn và các triều đại trước xác lập thực thi chủ quyền từ nhiều thế kỷ.'
  },
  {
    id: 'vn-06',
    topic: 'vietnam',
    difficulty: 'hard',
    region: 'Tây Bắc',
    question: 'Đỉnh núi Fansipan thuộc dãy Hoàng Liên Sơn được mệnh danh là "Nóc nhà Đông Dương" có độ cao chính xác là bao nhiêu mét?',
    options: ['3.143 m', '3.147 m', '2.850 m', '3.250 m'],
    answerIndex: 0,
    explanation: 'Fansipan có độ cao 3.143 mét theo số liệu đo đạc chính thức, là đỉnh núi cao nhất bán đảo Đông Dương (Việt Nam, Lào, Campuchia).',
    hint: 'Con số 3 nghìn hơn 14 chục và 3 đơn vị.',
    triviaFact: 'Fansipan trong tiếng bản địa H\'Mông có nghĩa là "phiến đá khổng lồ chênh vênh".'
  },
  {
    id: 'vn-07',
    topic: 'vietnam',
    difficulty: 'medium',
    region: 'Đồng bằng Sông Cửu Long',
    question: 'Sông Mê Kông khi chảy vào lãnh thổ Việt Nam chia thành hai nhánh chính là sông Tiền và sông Hậu, rồi đổ ra biển qua bao nhiêu cửa sông (nguyên gốc)?',
    options: ['9 cửa sông (Cửu Long)', '7 cửa sông', '5 cửa sông', '12 cửa sông'],
    answerIndex: 0,
    explanation: 'Sông Mê Kông chảy qua đồng bằng Nam Bộ đổ ra biển Đông qua chín cửa sông hình tượng như chín con rồng, nên được gọi là đồng bằng sông Cửu Long.',
    hint: 'Số chín tượng trưng cho con số rồng may mắn.',
    triviaFact: 'Hiện nay do bồi lắng và tự nhiên, hai cửa Ba Thắc và Bát Xắc đã biến đổi chỉ còn 7 hoặc 8 cửa hoạt động.'
  },
  {
    id: 'vn-08',
    topic: 'vietnam',
    difficulty: 'boss',
    region: 'Điện Biên',
    question: 'Chiến dịch Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" toàn thắng vào ngày tháng năm nào?',
    options: ['07/05/1954', '30/04/1975', '19/08/1945', '02/09/1945'],
    answerIndex: 0,
    explanation: 'Vào lúc 17h30 ngày 7 tháng 5 năm 1954, lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm tướng De Castries, kết thúc thắng lợi 56 ngày đêm khoét núi ngủ hầm.',
    hint: 'Tháng 5 năm một chín năm tư.',
    triviaFact: 'Đại tướng Võ Nguyên Giáp đã đưa ra quyết định lịch sử chuyển từ phương châm "đánh nhanh, thắng nhanh" sang "đánh chắc, tiến chắc".'
  },

  // --- THIÊN VĂN & VŨ TRỤ (Hệ Mặt Trời, Khám phá vũ trụ) ---
  {
    id: 'ast-01',
    topic: 'astronomy',
    difficulty: 'easy',
    question: 'Hành tinh nào là hành tinh lớn nhất trong Hệ Mặt Trời của chúng ta?',
    options: ['Sao Mộc (Jupiter)', 'Sao Thổ (Saturn)', 'Sao Hải Vương (Neptune)', 'Trái Đất (Earth)'],
    answerIndex: 0,
    explanation: 'Sao Mộc là hành tinh khí khổng lồ lớn nhất Hệ Mặt Trời, có thể chứa hơn 1.300 Trái Đất bên trong và có Vết Đỏ Lớn là một cơn bão khổng lồ.',
    hint: 'Hành tinh thứ 5 tính từ Mặt Trời, mang tên vị thần sấm sét La Mã.',
    triviaFact: 'Sao Mộc có từ trường mạnh gấp 20.000 lần Trái Đất và hơn 90 vệ tinh tự nhiên quay quanh.'
  },
  {
    id: 'ast-02',
    topic: 'astronomy',
    difficulty: 'easy',
    question: 'Hành tinh nào được mệnh danh là "Hành tinh Đỏ" do bề mặt phủ đầy oxit sắt (gỉ sét)?',
    options: ['Sao Hỏa (Mars)', 'Sao Kim (Venus)', 'Sao Thủy (Mercury)', 'Sao Diêm Vương (Pluto)'],
    answerIndex: 0,
    explanation: 'Sao Hỏa có màu đỏ cam đặc trưng do bụi oxit sắt trên bề mặt. Đây là mục tiêu thám hiểm lớn nhất cho công cuộc tìm kiếm sự sống ngoài Trái Đất.',
    hint: 'Hành tinh thứ tư tính từ Mặt Trời, nơi có tàu thăm dò Perseverance.',
    triviaFact: 'Sao Hỏa sở hữu ngọn núi lửa Olympus Mons cao gần 22 km, gấp gần 3 lần đỉnh Everest!'
  },
  {
    id: 'ast-03',
    topic: 'astronomy',
    difficulty: 'medium',
    question: 'Ánh sáng từ Mặt Trời mất khoảng bao lâu để truyền tới bề mặt Trái Đất?',
    options: ['Khoảng 8 phút 20 giây', 'Khoảng 1 giây', 'Khoảng 1 giờ 15 phút', 'Tức thì (0 giây)'],
    answerIndex: 0,
    explanation: 'Với khoảng cách trung bình khoảng 149,6 triệu km và tốc độ ánh sáng xấp xỉ 300.000 km/s, ánh sáng mất khoảng 500 giây (~8 phút 20 giây) để đến Trái Đất.',
    hint: 'Nhiều hơn 5 phút nhưng ít hơn 10 phút.',
    triviaFact: 'Điều này có nghĩa là chúng ta luôn nhìn thấy Mặt Trời ở trạng thái của nó cách đây hơn 8 phút.'
  },
  {
    id: 'ast-04',
    topic: 'astronomy',
    difficulty: 'medium',
    question: 'Kính viễn vọng không gian nào được phóng vào cuối năm 2021 để quan sát vũ trụ sâu bằng bước sóng hồng ngoại kế nhiệm kính Hubble?',
    options: ['James Webb (JWST)', 'Kepler', 'Spitzer', 'Chandra'],
    answerIndex: 0,
    explanation: 'Kính viễn vọng không gian James Webb được trang bị gương phản xạ mạ vàng đường kính 6,5 mét đặt tại điểm Lagrange L2 cách Trái Đất 1,5 triệu km.',
    hint: 'Mang tên nhà lãnh đạo thứ hai của NASA thời kỳ Apollo.',
    triviaFact: 'James Webb có thể phát hiện ánh sáng từ những ngôi sao và thiên hà đầu tiên hình thành sau Vụ Nổ Lớn (Big Bang).'
  },
  {
    id: 'ast-05',
    topic: 'astronomy',
    difficulty: 'hard',
    question: 'Vùng ranh giới xung quanh một lỗ đen mà tại đó không vật chất hay ánh sáng nào có thể thoát ra ngoài được gọi là gì?',
    options: ['Chân trời sự kiện (Event Horizon)', 'Điểm kỳ dị (Singularity)', 'Đĩa bồi tụ (Accretion Disk)', 'Tia plasma năng lượng'],
    answerIndex: 0,
    explanation: 'Chân trời sự kiện là ranh giới một chiều, nơi vận tốc vũ trụ cấp 2 vượt quá tốc độ ánh sáng, khiến ngay cả photon ánh sáng cũng bị giam cầm vĩnh viễn.',
    hint: 'Biên giới sự kiện không thể quay đầu.',
    triviaFact: 'Năm 2019, Kính viễn vọng Chân trời Sự kiện (EHT) đã chụp được bức ảnh lịch sử đầu tiên về bóng của lỗ đen tại thiên hà M87.'
  },
  {
    id: 'ast-06',
    topic: 'astronomy',
    difficulty: 'boss',
    question: 'Thiên hà xoắn ốc khổng lồ gần Dải Ngân Hà (Milky Way) nhất và dự kiến sẽ sáp nhập với Ngân Hà sau khoảng 4,5 tỷ năm nữa có tên là gì?',
    options: ['Thiên hà Tiên Nữ (Andromeda / M31)', 'Đám mây Magellan Lớn', 'Thiên hà Tam Giác (M33)', 'Thiên hà Sombrero'],
    answerIndex: 0,
    explanation: 'Thiên hà Tiên Nữ (Andromeda) cách chúng ta khoảng 2,5 triệu năm ánh sáng, chứa khoảng 1 nghìn tỷ ngôi sao và đang tiến lại gần Ngân Hà với tốc độ ~110 km/s.',
    hint: 'Mang tên một nàng công chúa xinh đẹp trong thần thoại Hy Lạp.',
    triviaFact: 'Khi hai thiên hà sáp nhập, các ngôi sao hiếm khi va chạm trực tiếp vì khoảng cách trống giữa chúng là vô cùng lớn.'
  },

  // --- ĐỊA LÝ THẾ GIỚI (Châu lục, Đại dương & Kỳ quan) ---
  {
    id: 'geo-01',
    topic: 'geography',
    difficulty: 'easy',
    question: 'Đại dương nào có diện tích và độ sâu lớn nhất trên bề mặt Trái Đất?',
    options: ['Thái Bình Dương', 'Đại Tây Dương', 'Ấn Độ Dương', 'Bắc Băng Dương'],
    answerIndex: 0,
    explanation: 'Thái Bình Dương chiếm khoảng 1/3 diện tích bề mặt Trái Đất (hơn 165 triệu km²), lớn hơn tổng diện tích của tất cả các lục địa gộp lại.',
    hint: 'Đại dương bao bọc bờ đông của Việt Nam và châu Á.',
    triviaFact: 'Rãnh Mariana - điểm sâu nhất thế giới (khoảng 11.034 m) nằm tại vùng biển Thái Bình Dương.'
  },
  {
    id: 'geo-02',
    topic: 'geography',
    difficulty: 'easy',
    question: 'Châu lục nào trên Trái Đất có diện tích lớn nhất và dân số đông nhất hiện nay?',
    options: ['Châu Á', 'Châu Phi', 'Châu Âu', 'Châu Mỹ'],
    answerIndex: 0,
    explanation: 'Châu Á có diện tích khoảng 44,58 triệu km² và dân số hơn 4,7 tỷ người, chiếm gần 60% dân số toàn cầu.',
    hint: 'Nơi có Việt Nam, Nhật Bản, Ấn Độ và Trung Quốc.',
    triviaFact: 'Châu Á có cả điểm cao nhất Trái Đất (đỉnh Everest) và điểm thấp nhất trên cạn (Biển Chết).'
  },
  {
    id: 'geo-03',
    topic: 'geography',
    difficulty: 'medium',
    question: 'Con sông nào dài nhất thế giới chảy qua khu vực Đông Bắc châu Phi?',
    options: ['Sông Nile (sông Nin)', 'Sông Amazon', 'Sông Dương Tử (Trường Giang)', 'Sông Mississippi'],
    answerIndex: 0,
    explanation: 'Sông Nile với chiều dài khoảng 6.650 km bắt nguồn từ vùng hồ Victoria và đổ ra Địa Trung Hải, là cái nôi nuôi dưỡng nền văn minh Ai Cập cổ đại.',
    hint: 'Dòng sông của các Pharaoh và tượng Nhân sư.',
    triviaFact: 'Mặc dù sông Nile dài nhất, sông Amazon lại là con sông có lưu lượng nước lớn nhất thế giới gấp nhiều lần sông Nile.'
  },
  {
    id: 'geo-04',
    topic: 'geography',
    difficulty: 'medium',
    question: 'Kỳ quan nhân tạo nào nối liền Địa Trung Hải và Biển Đỏ, cho phép tàu thuyền di chuyển giữa châu Âu và châu Á mà không cần đi vòng qua châu Phi?',
    options: ['Kênh đào Suez', 'Kênh đào Panama', 'Kênh đào Kiel', 'Eo biển Gibraltar'],
    answerIndex: 0,
    explanation: 'Kênh đào Suez khánh thành năm 1869 tại Ai Cập, dài 193 km, rút ngắn khoảng cách hàng hải giữa châu Âu và châu Á tới hàng nghìn hải lý.',
    hint: 'Kênh đào nổi tiếng nằm trên lãnh thổ Ai Cập.',
    triviaFact: 'Khoảng 12% thương mại toàn cầu và 30% lưu lượng tàu container thế giới đi qua kênh đào Suez mỗi năm.'
  },
  {
    id: 'geo-05',
    topic: 'geography',
    difficulty: 'hard',
    question: 'Hệ thống rạn san hô lớn nhất thế giới Great Barrier Reef nằm ngoài khơi bờ biển của quốc gia nào?',
    options: ['Úc (Australia)', 'Indonesia', 'Philippines', 'Brazil'],
    answerIndex: 0,
    explanation: 'Rạn san hô Great Barrier nằm ở biển San Hô ngoài khơi bờ biển Queensland (Úc), trải dài hơn 2.300 km và có thể nhìn thấy từ ngoài vũ trụ.',
    hint: 'Xứ sở chuột túi và gấu koala.',
    triviaFact: 'Đây là công trình sinh học đơn lẻ lớn nhất do các sinh vật sống (polyp san hô) tạo nên.'
  },
  {
    id: 'geo-06',
    topic: 'geography',
    difficulty: 'boss',
    question: 'Hồ nước ngọt sâu nhất và cổ xưa nhất thế giới, chứa tới 20% lượng nước ngọt không bị đóng băng của Trái Đất là hồ nào?',
    options: ['Hồ Baikal (Nga)', 'Hồ Superior (Hồ Thượng - Bắc Mỹ)', 'Hồ Victoria (Châu Phi)', 'Hồ Tanganyika'],
    answerIndex: 0,
    explanation: 'Hồ Baikal ở vùng Siberia (Nga) có độ sâu lên đến 1.642 mét và ước tính tuổi đời khoảng 25-30 triệu năm, với độ trong vắt nhìn sâu tới 40 mét.',
    hint: 'Hồ nước nổi tiếng nằm tại vùng tuyết trắng Siberia.',
    triviaFact: 'Hồ Baikal là nơi sinh sống của hơn 2.500 loài thực vật và động vật, trong đó 80% là loài đặc hữu không tìm thấy ở bất cứ nơi nào khác.'
  },

  // --- KHOA HỌC TỰ NHIÊN & VẬT LÝ ---
  {
    id: 'sci-01',
    topic: 'science',
    difficulty: 'easy',
    question: 'Đơn vị cấu tạo cơ bản nhất của mọi sinh vật sống từ thực vật đến con người là gì?',
    options: ['Tế bào (Cell)', 'Mô', 'Cơ quan', 'Nguyên tử'],
    answerIndex: 0,
    explanation: 'Tế bào là đơn vị cấu trúc và chức năng cơ bản của mọi sinh vật sống. Cơ thể người trưởng thành gồm khoảng 30 đến 37 nghìn tỷ tế bào.',
    hint: 'Bao gồm màng tế bào, tế bào chất và nhân.',
    triviaFact: 'Tế bào lớn nhất từng được biết đến là lòng đỏ của trứng đà điểu!'
  },
  {
    id: 'sci-02',
    topic: 'science',
    difficulty: 'medium',
    question: 'Khí nào chiếm tỷ lệ phần trăm thể tích lớn nhất trong bầu khí quyển của Trái Đất?',
    options: ['Khí Nitơ (N2) ~ 78%', 'Khí Ôxy (O2) ~ 21%', 'Khí Argon (Ar) ~ 0.9%', 'Khí Carbonic (CO2) ~ 0.04%'],
    answerIndex: 0,
    explanation: 'Khí Nitơ chiếm khoảng 78.08% thể tích khí quyển, trong khi khí Ôxy cần thiết cho sự hô hấp chiếm khoảng 20.95%.',
    hint: 'Một chất khí trơ không màu, không mùi, công thức N2.',
    triviaFact: 'Nếu khí quyển có quá nhiều ôxy (>25%), các vụ cháy rừng tự phát sẽ bùng nổ dữ dội và rất khó dập tắt.'
  },
  {
    id: 'sci-03',
    topic: 'science',
    difficulty: 'hard',
    question: 'Nhà khoa học nào đã phát biểu ba định luật kinh điển về chuyển động và định luật vạn vật hấp dẫn sau câu chuyện quả táo rơi?',
    options: ['Sir Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Nikola Tesla'],
    answerIndex: 0,
    explanation: 'Isaac Newton công bố ba định luật về chuyển động và định luật vạn vật hấp dẫn trong kiệt tác "Philosophiae Naturalis Principia Mathematica" năm 1687.',
    hint: 'Nhà vật lý học vĩ đại người Anh thời thế kỷ 17.',
    triviaFact: 'Cây táo trong vườn nhà Newton ở Woolsthorpe Manor vẫn còn sống và đơm hoa kết trái cho đến tận ngày nay.'
  },
  {
    id: 'sci-04',
    topic: 'science',
    difficulty: 'boss',
    question: 'Phân tử mang thông tin di truyền mã hóa sự phát triển và hoạt động của tất cả các sinh vật sống có cấu trúc xoắn kép được gọi là gì?',
    options: ['DNA (Axit Deoxyribonucleic)', 'RNA', 'Protein', 'Ribosome'],
    answerIndex: 0,
    explanation: 'Cấu trúc xoắn kép của phân tử DNA được James Watson và Francis Crick phát hiện năm 1953 dựa trên ảnh nhiễu xạ tia X của Rosalind Franklin.',
    hint: 'Gồm 4 bazơ nitơ: A, T, G, X (C).',
    triviaFact: 'Nếu duỗi thẳng tất cả các chuỗi DNA trong toàn bộ tế bào của một người trưởng thành, nó có thể vươn từ Trái Đất đến Sao Diêm Vương và quay lại nhiều lần!'
  },

  // --- LỊCH SỬ THẾ GIỚI ---
  {
    id: 'his-01',
    topic: 'history',
    difficulty: 'easy',
    question: 'Kim tự tháp vĩ đại Giza được xây dựng làm lăng mộ cho Pharaoh nào của Ai Cập cổ đại?',
    options: ['Pharaoh Khufu (Cheops)', 'Pharaoh Tutankhamun', 'Pharaoh Ramses II', 'Nữ hoàng Cleopatra'],
    answerIndex: 0,
    explanation: 'Đại kim tự tháp Giza được xây dựng dưới triều đại Pharaoh Khufu vào khoảng năm 2560 TCN, là kỳ quan cổ đại duy nhất còn tồn tại nguyên vẹn.',
    hint: 'Vị vua thuộc Vương triều thứ Tư của Ai Cập cổ.',
    triviaFact: 'Kim tự tháp từng giữ kỷ lục công trình nhân tạo cao nhất thế giới trong hơn 3.800 năm cho đến khi nhà thờ Lincoln (Anh) được xây dựng.'
  },
  {
    id: 'his-02',
    topic: 'history',
    difficulty: 'medium',
    question: 'Ai là người đầu tiên trên thế giới chỉ huy đoàn thám hiểm thực hiện chuyến hải hành đi vòng quanh Trái Đất (1519–1522)?',
    options: ['Ferdinand Magellan', 'Christopher Columbus', 'Vasco da Gama', 'James Cook'],
    answerIndex: 0,
    explanation: 'Magellan chỉ huy hạm đội Armada de Molucca khởi hành từ Tây Ban Nha; dù ông hy sinh tại Philippines, hoa tiêu Juan Sebastián Elcano đã đưa tàu Victoria hoàn thành chuyến đi vòng quanh thế giới.',
    hint: 'Tên ông được đặt cho eo biển ở cực nam châu Mỹ.',
    triviaFact: 'Magellan cũng chính là người đặt tên cho "Thái Bình Dương" (Pacific) vì biển lặng sóng khi hạm đội của ông tiến vào.'
  },
  {
    id: 'his-03',
    topic: 'history',
    difficulty: 'hard',
    question: 'Thời kỳ Phục Hưng (Renaissance) - phong trào tái sinh văn hóa, nghệ thuật và tư tưởng rực rỡ của châu Âu khởi nguồn từ quốc gia nào?',
    options: ['Ý (Italia) - tiêu biểu là thành phố Florence', 'Pháp', 'Anh', 'Đức'],
    answerIndex: 0,
    explanation: 'Phong trào Phục Hưng bắt đầu từ thế kỷ 14 tại các thành bang miền bắc nước Ý, đặc biệt là Florence với những danh họa vĩ đại như Leonardo da Vinci, Michelangelo.',
    hint: 'Cái nôi của Đế chế La Mã cổ đại và nghệ thuật hội họa kinh điển.',
    triviaFact: 'Gia tộc Medici tại Florence đã đóng vai trò nhà bảo trợ nghệ thuật vĩ đại nhất nuôi dưỡng các thiên tài thời kỳ này.'
  },

  // --- VĂN HÓA & TRÍ TUỆ DÂN GIAN ---
  {
    id: 'cul-01',
    topic: 'culture',
    difficulty: 'easy',
    question: 'Bánh chưng bánh giầy trong phong tục cổ truyền ngày Tết Nguyên Đán Việt Nam tượng trưng cho điều gì?',
    options: ['Đất vuông và Trời tròn', 'Mặt Trăng và Mặt Trời', 'Cha và Mẹ', 'Biển cả và Núi rừng'],
    answerIndex: 0,
    explanation: 'Theo truyền thuyết thời Hùng Vương thứ 6, chàng hoàng tử Lang Liêu đã làm bánh chưng vuông tượng trưng cho Đất và bánh giầy tròn tượng trưng cho Trời để dâng lên Tiên Vương.',
    hint: 'Hai biểu tượng cổ xưa về vũ trụ quan trong văn hóa lúa nước.',
    triviaFact: 'Bánh chưng được gói bằng lá dong, nhân đậu xanh và thịt mỡ, thể hiện sự hòa hợp âm dương và lòng hiếu thảo.'
  },
  {
    id: 'cul-02',
    topic: 'culture',
    difficulty: 'medium',
    question: 'Điền từ còn thiếu vào câu thành ngữ quen thuộc: "Uống nước nhớ ... / Ăn quả nhớ kẻ trồng cây"?',
    options: ['nguồn', 'sông', 'dòng', 'suối'],
    answerIndex: 0,
    explanation: 'Thành ngữ "Uống nước nhớ nguồn" nhắc nhở con người phải luôn biết ơn công lao sinh thành dưỡng dục và những người đã cống hiến cho thế hệ mai sau.',
    hint: 'Nơi khởi đầu của dòng chảy.',
    triviaFact: 'Đây là đạo lý truyền thống ngàn đời tốt đẹp của dân tộc Việt Nam.'
  },
  {
    id: 'cul-03',
    topic: 'culture',
    difficulty: 'medium',
    question: 'Nhã nhạc Cung đình Huế của Việt Nam được UNESCO ghi danh vào danh sách nào vào năm 2003?',
    options: ['Kiệt tác Di sản Phi vật thể và Truyền khẩu của nhân loại', 'Di sản Thiên nhiên Thế giới', 'Di sản Tư liệu Ký ức Thế giới', 'Kỳ quan Thế giới mới'],
    answerIndex: 0,
    explanation: 'Nhã nhạc cung đình Huế là di sản phi vật thể đầu tiên của Việt Nam được UNESCO vinh danh vì sự tinh tế, trang trọng và bác học của âm nhạc chốn hoàng cung.',
    hint: 'Âm nhạc trang nhã dưới triều Nguyễn.',
    triviaFact: 'Nhã nhạc được biểu diễn trong các dịp đại lễ như tế Giao, tế Miếu, lễ Đăng quang và tiếp đón sứ thần nước ngoài.'
  }
];
