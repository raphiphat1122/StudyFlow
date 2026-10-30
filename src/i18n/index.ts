import type { Language } from '@/types';
type Dict = Record<string, string>;
const th: Dict = { login:'เข้าสู่ระบบ', signUpSub:'มาเริ่มต้นเส้นทางการเรียนไปด้วยกัน!', fullName:'ชื่อ-นามสกุล', confirmPassword:'ยืนยันรหัสผ่าน', haveAccount:'มีบัญชีอยู่แล้ว?', otpTitle:'ยืนยันรหัส OTP', otpSub:'กรุณากรอกรหัส 6 หลักที่ส่งไปยังอีเมลของคุณ', resendIn:'ส่งรหัสใหม่อีกครั้งใน', resend:'ส่งรหัสอีกครั้ง', forgotSub:'กรอกอีเมลของคุณ', sendReset:'ส่งลิงก์รีเซ็ตรหัสผ่าน', backToLogin:'กลับไปหน้าเข้าสู่ระบบ', passMismatch:'รหัสผ่านไม่ตรงกัน', passShort:'รหัสผ่านอย่างน้อย 6 ตัวอักษร', badEmail:'รูปแบบอีเมลไม่ถูกต้อง', otpIncomplete:'กรุณากรอกรหัสให้ครบ 6 หลัก', authDemo:'โหมดทดสอบ: ยังไม่มีการส่งหรือตรวจรหัสจริง', userOrEmail:'อีเมลหรือชื่อผู้ใช้', remember:'จดจำฉัน', forgot:'ลืมรหัสผ่าน?', welcomeBack:'ยินดีต้อนรับกลับมา!', noAccount:'ยังไม่มีบัญชี?', signUp:'สมัครสมาชิก', loginSoon:'ระบบเข้าสู่ระบบจะเปิดใช้งานเร็ว ๆ นี้', guest:'ใช้งานต่อโดยไม่ล็อกอิน', email:'อีเมล', password:'รหัสผ่าน', home:'หน้าแรก', schedule:'ตารางเรียน', tasks:'งาน', progress:'สถิติ', settings:'ตั้งค่า',
 getStarted:'เริ่มต้นใช้งาน', skip:'ข้าม', tagline:'เรียนวันนี้ เพื่ออนาคตที่ดีกว่า', intro:'วางแผนการเรียน จัดการงาน และติดตามความก้าวหน้าในที่เดียว',
 hello:'สวัสดี', today:'วันนี้', pending:'ค้างอยู่', completed:'เสร็จแล้ว', overdue:'เลยกำหนด', all:'ทั้งหมด',
 add:'เพิ่ม', edit:'แก้ไข', delete:'ลบ', save:'บันทึก', cancel:'ยกเลิก', confirm:'ยืนยัน',
 title:'ชื่อ', subject:'วิชา', date:'วันที่', start:'เริ่ม', end:'สิ้นสุด', location:'สถานที่', notes:'บันทึก', description:'รายละเอียด',
 priority:'ความสำคัญ', low:'ต่ำ', medium:'กลาง', high:'สูง', due:'กำหนดส่ง',
 required:'จำเป็นต้องกรอก', badTime:'เวลาสิ้นสุดต้องหลังเวลาเริ่ม', badDate:'รูปแบบวันที่ไม่ถูกต้อง (ปปปป-ดด-วว)', badTimeFmt:'รูปแบบเวลา HH:MM',
 emptySchedule:'ยังไม่มีตารางเรียน', emptyTasks:'ยังไม่มีงาน', emptyProgress:'ยังไม่มีข้อมูลการเรียน',
 confirmDelete:'ลบรายการนี้?', unsaved:'ละทิ้งข้อมูลที่ยังไม่บันทึก?', discard:'ละทิ้ง',
 language:'ภาษา', theme:'โหมดสี', light:'สว่าง', dark:'มืด', system:'ตามระบบ', reset:'ล้างข้อมูลทั้งหมด', resetMsg:'ข้อมูลทั้งหมดจะถูกลบถาวร', version:'เวอร์ชัน',
 goal:'เป้าหมายต่อสัปดาห์ (นาที)', logSession:'บันทึกเวลาเรียน', minutes:'นาที', totalTime:'เวลาเรียนรวม', gpa:'เกรดเฉลี่ย (กรอกเอง)', gpaNote:'ค่านี้กรอกโดยผู้ใช้ ไม่ได้คำนวณจากแอป', week:'สัปดาห์นี้' };
const en: Dict = { login:'Log in', signUpSub:"Let's start learning together!", fullName:'Full name', confirmPassword:'Confirm password', haveAccount:'Already have an account?', otpTitle:'Verify OTP', otpSub:'Enter the 6-digit code sent to your email', resendIn:'Resend code in', resend:'Resend code', forgotSub:'Enter your email', sendReset:'Send reset link', backToLogin:'Back to login', passMismatch:'Passwords do not match', passShort:'At least 6 characters', badEmail:'Invalid email address', otpIncomplete:'Enter all 6 digits', authDemo:'Demo mode: no real code is sent or checked yet', userOrEmail:'Email or username', remember:'Remember me', forgot:'Forgot password?', welcomeBack:'Welcome back!', noAccount:'No account yet?', signUp:'Sign up', loginSoon:'Login will be available soon', guest:'Continue without logging in', email:'Email', password:'Password', home:'Home', schedule:'Schedule', tasks:'Tasks', progress:'Progress', settings:'Settings',
 getStarted:'Get Started', skip:'Skip', tagline:'Study today, for a better tomorrow', intro:'Plan classes, manage tasks and track progress in one place.',
 hello:'Hello', today:'Today', pending:'Pending', completed:'Completed', overdue:'Overdue', all:'All',
 add:'Add', edit:'Edit', delete:'Delete', save:'Save', cancel:'Cancel', confirm:'Confirm',
 title:'Title', subject:'Subject', date:'Date', start:'Start', end:'End', location:'Location', notes:'Notes', description:'Description',
 priority:'Priority', low:'Low', medium:'Medium', high:'High', due:'Due',
 required:'Required', badTime:'End time must be after start time', badDate:'Invalid date (YYYY-MM-DD)', badTimeFmt:'Time format HH:MM',
 emptySchedule:'No classes yet', emptyTasks:'No tasks yet', emptyProgress:'No study data yet',
 confirmDelete:'Delete this item?', unsaved:'Discard unsaved changes?', discard:'Discard',
 language:'Language', theme:'Appearance', light:'Light', dark:'Dark', system:'System', reset:'Reset all data', resetMsg:'All data will be permanently deleted.', version:'Version',
 goal:'Weekly goal (minutes)', logSession:'Log study session', minutes:'min', totalTime:'Total study time', gpa:'GPA (entered by you)', gpaNote:'This value is entered manually, not calculated by the app.', week:'This week' };
const zh: Dict = { ...en, login:'登录', userOrEmail:'邮箱或用户名', remember:'记住我', forgot:'忘记密码？', welcomeBack:'欢迎回来！', noAccount:'还没有账号？', signUp:'注册', loginSoon:'登录功能即将推出', guest:'不登录继续使用', email:'邮箱', password:'密码', home:'首页', schedule:'课表', tasks:'任务', progress:'进度', settings:'设置', getStarted:'开始使用', skip:'跳过',
 tagline:'今天学习，成就更好的未来', intro:'在一个地方规划课程、管理任务并追踪进度。', hello:'你好', today:'今天', pending:'待完成', completed:'已完成', overdue:'已逾期', all:'全部',
 add:'添加', edit:'编辑', delete:'删除', save:'保存', cancel:'取消', confirm:'确认', title:'标题', subject:'科目', date:'日期', start:'开始', end:'结束', location:'地点', notes:'备注', description:'描述',
 priority:'优先级', low:'低', medium:'中', high:'高', due:'截止', required:'必填', confirmDelete:'删除此项？', language:'语言', theme:'外观', light:'浅色', dark:'深色', system:'跟随系统',
 reset:'重置所有数据', resetMsg:'所有数据将被永久删除。', version:'版本', minutes:'分钟', week:'本周', emptySchedule:'暂无课程', emptyTasks:'暂无任务', emptyProgress:'暂无学习数据' };
const ja: Dict = { ...en, login:'ログイン', userOrEmail:'メールまたはユーザー名', remember:'ログイン情報を保存', forgot:'パスワードをお忘れですか？', welcomeBack:'おかえりなさい！', noAccount:'アカウントをお持ちでない方', signUp:'新規登録', loginSoon:'ログイン機能は近日公開予定です', guest:'ログインせずに続ける', email:'メール', password:'パスワード', home:'ホーム', schedule:'時間割', tasks:'課題', progress:'進捗', settings:'設定', getStarted:'はじめる', skip:'スキップ',
 tagline:'今日の学びが、よりよい未来へ', intro:'授業・課題・進捗をひとつにまとめて管理しましょう。', hello:'こんにちは', today:'今日', pending:'未完了', completed:'完了', overdue:'期限切れ', all:'すべて',
 add:'追加', edit:'編集', delete:'削除', save:'保存', cancel:'キャンセル', confirm:'確認', title:'タイトル', subject:'科目', date:'日付', start:'開始', end:'終了', location:'場所', notes:'メモ', description:'説明',
 priority:'優先度', low:'低', medium:'中', high:'高', due:'期限', required:'必須', confirmDelete:'この項目を削除しますか？', language:'言語', theme:'外観', light:'ライト', dark:'ダーク', system:'システム',
 reset:'すべてのデータをリセット', resetMsg:'すべてのデータが完全に削除されます。', version:'バージョン', minutes:'分', week:'今週', emptySchedule:'授業がありません', emptyTasks:'課題がありません', emptyProgress:'学習データがありません' };
export const dictionaries: Record<Language, Dict> = { th, en, zh, ja };
export const languageNames: Record<Language, string> = { th: 'ไทย', en: 'English', zh: '简体中文', ja: '日本語' };
