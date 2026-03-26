# API Documentation - Quản Lý Thi Trắc Nghiệm

## Danh sách tất cả các API Endpoints CRUD

Tài liệu này liệt kê tất cả các API endpoints với pattern CRUD kèm request body đầy đủ dựa vào FormRequest validation.

---

## 1. QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN

### 1.1 Users (Người dùng)

#### GET /api/users

Lấy danh sách tất cả người dùng

#### POST /api/users - Tạo người dùng mới

**Request Body:**

```json
{
  "hoTen": "Nguyễn Văn A",
  "email": "nguyena@example.com",
  "password": "Password123",
  "password_confirmation": "Password123",
  "nhomQuyenId": 1,
  "sdt": "0123456789",
  "username": "nguyenv",
  "ngaySinh": "2000-01-15",
  "laGioiTinhNu": false,
  "ggid": "1234567890",
  "urlAvatar": "https://example.com/avatar.jpg"
}
```

**Validation Rules:**

- hoTen: required, string, max:255
- email: required, email, unique:users,email
- password: required, min:6 với letters, numbers, mixedCase, confirmed
- password_confirmation: required (phải match password)
- nhomQuyenId: required, numeric, exists:roles,id
- sdt: required, numeric, digits:10
- username: required, unique:users,username
- ngaySinh: required, date_format:Y-m-d, before:today
- laGioiTinhNu: required, boolean
- ggid: required, string
- urlAvatar: optional, string

#### GET /api/users/{user}

Lấy chi tiết một người dùng

#### PUT /api/users/{user} - Cập nhật người dùng

**Request Body:**

```json
{
  "hoTen": "Nguyễn Văn B",
  "nhomQuyenId": 2,
  "sdt": "0987654321",
  "username": "nguyenb",
  "ngaySinh": "2000-01-20",
  "laGioiTinhNu": true,
  "ggid": "9876543210",
  "urlAvatar": "https://example.com/avatar2.jpg"
}
```

**Validation Rules:**

- hoTen: sometimes, string, max:255
- nhomQuyenId: sometimes, numeric, exists:roles,id
- sdt: sometimes, numeric, digits:10
- username: sometimes, unique:users,username (ignore current user)
- ngaySinh: sometimes, date_format:Y-m-d, before:today
- laGioiTinhNu: sometimes, boolean
- ggid: sometimes, string
- urlAvatar: sometimes, string

#### DELETE /api/users/{user}

Xóa người dùng

#### POST /api/users/changepassword

Thay đổi mật khẩu (Custom endpoint - xem formRequest riêng)

---

### 1.2 Authentication (Xác thực)

#### POST /api/login

Đăng nhập

#### GET /api/me

Lấy thông tin người dùng hiện tại (require auth)

#### POST /api/logout

Đăng xuất (require auth)

---

### 1.3 Roles (Vai trò)

#### GET /api/roles

Lấy danh sách tất cả vai trò

#### POST /api/roles - Tạo vai trò mới

**Request Body:**

```json
{
  "tenNhomQuyen": "Admin",
  "role_details": [
    {
      "tenChucNang": "Users",
      "canView": true,
      "canCreate": true,
      "canUpdate": true,
      "canDelete": true
    },
    {
      "tenChucNang": "Roles",
      "canView": true,
      "canCreate": false,
      "canUpdate": true,
      "canDelete": false
    }
  ]
}
```

**Validation Rules:**

- tenNhomQuyen: required, string, max:255
- role_details: required, array, min:1
- role_details.\*.tenChucNang: required, string, exists:actions,tenChucNang
- role_details.\*.canView: required, boolean
- role_details.\*.canCreate: required, boolean
- role_details.\*.canUpdate: required, boolean
- role_details.\*.canDelete: required, boolean

#### GET /api/roles/{role}

Lấy chi tiết một vai trò

#### PUT /api/roles/{role} - Cập nhật vai trò

**Request Body:** (giống POST)

```json
{
  "tenNhomQuyen": "Manager",
  "role_details": [
    {
      "tenChucNang": "Users",
      "canView": true,
      "canCreate": false,
      "canUpdate": true,
      "canDelete": false
    }
  ]
}
```

**Validation Rules:** Giống POST nhưng tenNhomQuyen sẽ unique ignore current role

#### DELETE /api/roles/{role}

Xóa vai trò

---

### 1.4 Role Details (Chi tiết phân quyền)

#### GET /api/roledetails

Lấy danh sách tất cả chi tiết phân quyền

#### POST /api/roledetails

Tạo chi tiết phân quyền mới

#### GET /api/roledetails/{roledetail}

Lấy chi tiết một phần quyền cụ thể

#### PUT /api/roledetails/{roledetail}

Cập nhật chi tiết phân quyền

#### DELETE /api/roledetails/{roledetail}

Xóa chi tiết phân quyền

---

### 1.5 Actions (Hành động/Quyền)

#### GET /api/actions

Lấy danh sách tất cả hành động

#### POST /api/actions

Tạo hành động mới

#### GET /api/actions/{action}

Lấy chi tiết một hành động

#### PUT /api/actions/{action}

Cập nhật hành động

#### DELETE /api/actions/{action}

Xóa hành động

---

## 2. QUẢN LÝ MÔN HỌC & LỚP HỌC

### 2.1 Môn Học (Subjects)

#### GET /api/monhocs

Lấy danh sách tất cả môn học

#### POST /api/monhocs - Tạo môn học mới

**Request Body:**

```json
{
  "tenMonHoc": "Lập Trình Web",
  "soTinChi": 3,
  "soTietLyThuyet": 30,
  "soTietThucHanh": 30,
  "isDeleted": false
}
```

**Validation Rules:**

- tenMonHoc: required, string, max:150
- soTinChi: required, integer, min:1
- soTietLyThuyet: nullable, integer, min:0
- soTietThucHanh: nullable, integer, min:0
- isDeleted: nullable, boolean

#### GET /api/monhocs/{monhoc}

Lấy chi tiết một môn học

#### PUT /api/monhocs/{monhoc} - Cập nhật môn học

**Request Body:**

```json
{
  "tenMonHoc": "Lập Trình Web Nâng Cao",
  "soTinChi": 4,
  "soTietLyThuyet": 45,
  "soTietThucHanh": 45,
  "isDeleted": false
}
```

**Validation Rules:**

- tenMonHoc: sometimes, string, max:150
- soTinChi: sometimes, integer, min:1
- soTietLyThuyet: sometimes, integer, min:0
- soTietThucHanh: sometimes, integer, min:0
- isDeleted: sometimes, boolean

#### DELETE /api/monhocs/{monhoc}

Xóa môn học

---

### 2.2 Nhóm Học Phần (Class Groups)

#### GET /api/nhomhocphans

Lấy danh sách tất cả nhóm học phần

#### POST /api/nhomhocphans - Tạo nhóm học phần mới

**Request Body:**

```json
{
  "monHocId": 1,
  "tenNhom": "Nhóm 01 - Sáng thứ Hai",
  "maMoi": "LPWEB01",
  "siSo": 30,
  "notes": "Nhóm đủ học viên",
  "hocKy": 1,
  "namHoc": 2024,
  "giangVienId": 5,
  "isHide": false,
  "isDeleted": false
}
```

**Validation Rules:**

- monHocId: required, integer, exists:mon_hocs,id
- tenNhom: required, string, max:100
- maMoi: required, string, max:20, unique:nhom_hoc_phans,maMoi
- siSo: nullable, integer, min:1
- notes: nullable, string
- hocKy: required, integer, min:1, max:3
- namHoc: required, integer, min:2000
- giangVienId: nullable, integer, exists:users,id
- isHide: nullable, boolean
- isDeleted: nullable, boolean

#### GET /api/nhomhocphans/{nhomhocphan}

Lấy chi tiết một nhóm học phần

#### PUT /api/nhomhocphans/{nhomhocphan} - Cập nhật nhóm học phần

**Request Body:** (giống POST nhưng tất cả sometimes)

```json
{
  "monHocId": 1,
  "tenNhom": "Nhóm 01 - Sáng thứ Ba",
  "maMoi": "LPWEB01",
  "siSo": 35,
  "notes": "Nhóm có yêu cầu đặc biệt",
  "hocKy": 1,
  "namHoc": 2024,
  "giangVienId": 6,
  "isHide": false,
  "isDeleted": false
}
```

**Validation Rules:** Giống POST nhưng maMoi sẽ unique ignore current nhom

#### DELETE /api/nhomhocphans/{nhomhocphan}

Xóa nhóm học phần

#### GET /api/nhomhocphans/o_svien/{user}

Lấy nhóm học phần của sinh viên (Custom)

#### GET /api/nhomhocphans/w_gvien_mon/{nhomhocphan}

Lấy giáo viên của nhóm học phần (Custom)

#### GET /api/nhomhocphans/w_dekiemtra/{nhomhocphan}

Lấy bài kiểm tra của nhóm học phần (Custom)

#### POST /api/nhomhocphans/join_group

Tham gia nhóm học phần (Custom)
**Request Body:**

```json
{
  "sinhVienId": 1,
  "nhomHocPhanId": 1,
  "maMoi": "ABC1234"
}
```

**Validation Rules:**

- sinhVienId: required, numeric, exists:users,id
- nhomHocPhanId: required, numeric, exists:nhom_hoc_phans,id
- maMoi: required, string, max:20

#### PATCH /api/nhomhocphans/reset_invite_code/{nhomhocphan}

Reset mã lời mời (Custom)

---

## 3. QUẢN LÝ BÀI THI

### 3.1 Đề Thi (Test Papers)

#### GET /api/dethis

Lấy danh sách tất cả đề thi

#### POST /api/dethis - Tạo đề thi mới

**Request Body:**

```json
{
  "monThiId": 1,
  "nguoiTaoId": 5,
  "tenDe": "Đề thi Lập Trình Web - Học kỳ 1 (2024)",
  "thoiGianBatDau": "2024-12-01 09:00:00",
  "thoiGianKetThuc": "2024-12-01 11:00:00",
  "thoiGianLamBai": 120,
  "isDeleted": false
}
```

**Validation Rules:**

- monThiId: required, integer, exists:mon_hocs,id
- nguoiTaoId: required, integer, exists:users,id
- tenDe: required, string, max:255
- thoiGianBatDau: required, date
- thoiGianKetThuc: required, date, after:thoiGianBatDau
- thoiGianLamBai: required, integer, min:1 (phút)
- isDeleted: nullable, boolean

#### GET /api/dethis/{dethi}

Lấy chi tiết một đề thi

#### PUT /api/dethis/{dethi} - Cập nhật đề thi

**Request Body:**

```json
{
  "monThiId": 1,
  "nguoiTaoId": 5,
  "tenDe": "Đề thi Lập Trình Web - Học kỳ 1 (2024) - Bản sửa",
  "thoiGianBatDau": "2024-12-02 09:00:00",
  "thoiGianKetThuc": "2024-12-02 11:30:00",
  "thoiGianLamBai": 150,
  "isDeleted": false
}
```

**Validation Rules:** Giống POST nhưng tất cả sometimes

#### DELETE /api/dethis/{dethi}

Xóa đề thi

#### GET /api/dethis/get_osvien/{user}

Lấy đề thi của sinh viên (Custom)

---

### 3.2 Chương (Chapters)

#### GET /api/chuongs

Lấy danh sách tất cả chương

#### POST /api/chuongs - Tạo chương mới

**Request Body:**

```json
{
  "tenChuong": "Chương 1: Giới thiệu HTML",
  "monHocId": 1,
  "isDeleted": false
}
```

**Validation Rules:**

- tenChuong: required, string, max:100
- monHocId: required, integer, exists:mon_hocs,id
- isDeleted: nullable, boolean

#### GET /api/chuongs/{chuong}

Lấy chi tiết một chương

#### PUT /api/chuongs/{chuong} - Cập nhật chương

**Request Body:**

```json
{
  "tenChuong": "Chương 1: Giới thiệu HTML & CSS",
  "monHocId": 1,
  "isDeleted": false
}
```

**Validation Rules:** Giống POST nhưng tất cả sometimes

#### DELETE /api/chuongs/{chuong}

Xóa chương

---

### 3.3 Độ Khó (Difficulty Levels)

#### GET /api/dokhos

Lấy danh sách tất cả độ khó

#### POST /api/dokhos - Tạo độ khó mới

**Request Body:**

```json
{
  "tenDoKho": "Dễ"
}
```

**Validation Rules:**

- tenDoKho: required, string, max:100, unique:do_khos,tenDoKho

#### GET /api/dokhos/{dokho}

Lấy chi tiết một độ khó

#### PUT /api/dokhos/{dokho} - Cập nhật độ khó

**Request Body:**

```json
{
  "tenDoKho": "Rất dễ"
}
```

**Validation Rules:**

- tenDoKho: required, string, max:100, unique:do_khos,tenDoKho (ignore current)

#### DELETE /api/dokhos/{dokho}

Xóa độ khó

---

### 3.4 Cấu Hình Thi (Test Configuration)

#### GET /api/cauhinhthis

Lấy danh sách tất cả cấu hình thi

#### POST /api/cauhinhthis - Tạo cấu hình thi mới

**Request Body:**

```json
{
  "deThiId": 1,
  "hasMonitoring": true,
  "allowCopy": false,
  "allowPrint": false,
  "isEnableResume": true,
  "shuffleQuestions": true,
  "shuffleAnswers": true,
  "showScore": true,
  "showDetailResults": true,
  "isLimitSwitchTab": true,
  "tabSwitchLimit": 3,
  "messageOnWarning": "Cảnh báo: Bạn không được chuyển tab quá 3 lần!"
}
```

**Validation Rules:**

- deThiId: required, integer, exists:de_this,id, unique:cau_hinh_this,deThiId
- hasMonitoring: nullable, boolean
- allowCopy: nullable, boolean
- allowPrint: nullable, boolean
- isEnableResume: nullable, boolean
- shuffleQuestions: nullable, boolean
- shuffleAnswers: nullable, boolean
- showScore: nullable, boolean
- showDetailResults: nullable, boolean
- isLimitSwitchTab: nullable, boolean
- tabSwitchLimit: nullable, integer, min:0
- messageOnWarning: nullable, string, max:255

#### GET /api/cauhinhthis/{cauHinhThi}

Lấy chi tiết cấu hình thi

#### PUT /api/cauhinhthis/{cauHinhThi} - Cập nhật cấu hình thi

**Request Body:** (giống POST)

```json
{
  "deThiId": 1,
  "hasMonitoring": true,
  "allowCopy": false,
  "allowPrint": true,
  "isEnableResume": true,
  "shuffleQuestions": false,
  "shuffleAnswers": false,
  "showScore": true,
  "showDetailResults": false,
  "isLimitSwitchTab": false,
  "tabSwitchLimit": 0,
  "messageOnWarning": ""
}
```

**Validation Rules:** Giống POST nhưng deThiId sẽ unique ignore current

#### DELETE /api/cauhinhthis/{cauHinhThi}

Xóa cấu hình thi

---

### 3.5 Chi Tiết Đề Thi (Test Paper Details)

#### GET /api/chitietdethis

Lấy danh sách chi tiết đề thi

#### POST /api/chitietdethis

Tạo chi tiết đề thi mới
**Request Body:**

```json
{
  "cauHoiId": 1,
  "deThiId": 1,
  "thutu": 1,
  "diem": 1.5
}
```

**Validation Rules:**

- cauHoiId: required, integer, exists:cau_hois,id
- deThiId: required, integer, exists:de_this,id
- thutu: required, integer, min:1
- diem: required, numeric, min:0

#### GET /api/chitietdethis/{chitietdethi}

Lấy chi tiết một phần của đề thi

#### PUT /api/chitietdethis/{chitietdethi}

Cập nhật chi tiết đề thi
**Request Body:**

```json
{
  "cauHoiId": 1,
  "deThiId": 1,
  "thutu": 2,
  "diem": 2.0
}
```

**Validation Rules:**

- cauHoiId: required, integer, exists:cau_hois,id
- deThiId: required, integer, exists:de_this,id
- thutu: sometimes, integer, min:1
- diem: sometimes, numeric, min:0

#### DELETE /api/chitietdethis/{chitietdethi}

Xóa chi tiết đề thi

---

**Request Body:**

```json
{
  "noiDungLuaChon": "Nội dung đáp án A",
  "isCorrectAnswer": false,
  "cauHoiId": 1
}
```

**Validation Rules:**

- noiDungLuaChon: required, string, max:1000
- isCorrectAnswer: required, boolean
- cauHoiId: required, integer, exists:cau_hois,id

#### GET /api/cautraloims/{cautralom}

Lấy chi tiết một câu trả lời

#### PUT /api/cautraloims/{cautralom}

Cập nhật câu trả lời
**Request Body:**

```json
{
  "noiDungLuaChon": "Nội dung đáp án A đã sửa"
}
```

**Validation Rules:**

- noiDungLuaChon: sometimes, required, string, max:1000 câu hỏi

#### POST /api/cauhois

Tạo câu hỏi mới

#### GET /api/cauhois/{cauhoi}

Lấy chi tiết một câu hỏi

#### PUT /api/cauhois/{cauhoi}

Cập nhật câu hỏi

#### DELETE /api/cauhois/{cauhoi}

Xóa câu hỏi

---

### 4.2 Câu Trả Lời (Answers)

#### GET /api/cautraloims

Lấy danh sách tất cả câu trả lời

#### POST /api/cautraloims

Tạo câu trả lời mới

#### GET /api/cautraloims/{cautralom}

Lấy chi tiết một câu trả lời

#### PUT /api/cautraloims/{cautralom}

Cập nhật câu trả lời

#### DELETE /api/cautraloims/{cautralom}

Xóa câu trả lời

---

## 5. QUẢN LÝ BÀI LÀM & SUBMISSION

### 5.1 Bài Làm (Student Submissions)

#### GET /api/bailams

Lấy danh sách tất cả bài làm

#### POST /api/bailams - Tạo bài làm mới

**Request Body:**

```json
{
  "thiSinhId": 10,
  "deThiId": 1,
  "thoiGianNopBai": "2024-12-01 10:50:00",
  "tongDiem": 8.5,
  "soCauDung": 17,
  "status": "DA_NOP"
}
```

**Validation Rules:**

- thiSinhId: required, integer, exists:users,id
- deThiId: required, integer, exists:de_this,id
- thoiGianNopBai: nullable, date, after_or_equal:thoiGianBatDau
- tongDiem: nullable, numeric, min:0, max:10
- soCauDung: nullable, integer, min:0
- status: in:DANG_LAM,TAM_LUU,DA_NOP,BI_HUY

#### GET /api/bailams/{bailam}

Lấy chi tiết một bài làm
**Request Body:**

```json
{
  "thiSinhId": 10,
  "deThiId": 1
}
```

**Validation Rules:**

- thiSinhId: required, integer, exists:users,id
- deThiId: required, integer, exists:de_this,id

#### PUT /api/bailams/updatestudenttest/{bailam}

Cập nhật câu trả lời bài thi (Custom endpoint)
**Request Body:**

```json
{
  "answers": [
    {
      "cauHoiId": 1,
      "dapAnId": 10
    },
    {
      "cauHoiId": 2,
      "dapAnId": 15
    }
  ]
}
```

**Validation Rules:**

- answers: required, array
- answers.\*.cauHoiId: required, integer, exists:cau_hois,id
- answers.\*.dapAnId: required, integer, exists:cau_tra_lois,id

#### PUT /api/bailams/submittest/{bailam}

Nộp bài thi (Custom endpoint)
**Request Body:**
**Request Body:**

```json
{
  "baiLamId": 1,
  "cauHoiId": 10,
  "dapAnId": 101,
  "isCorrectChooser": true,
  "diem": 0.5
}
```

**Validation Rules:**

- baiLamId: required, integer, exists:bai_lams,id
- cauHoiId: required, integer, exists:cau_hois,id
- dapAnId: nullable, integer, exists:cau_tra_lois,id
- isCorrectChooser: nullable, boolean
- diem: nullable, numeric, min:0

#### GET /api/chitietbailams/{chitietbailam}

Lấy chi tiết một phần bài làm
**Request Body:**

```json
{
  "baiLamId": 1,
  "soLanChuyenTab": 3
}
```

**Validation Rules:**

- baiLamId: required, integer, exists:bai_lams,id
- soLanChuyenTab: required, integer, min:0

#### GET /api/logbailams/{logbailam}

Lấy chi tiết một log bài làm

#### PUT /api/logbailams/{logbailam}

Cập nhật log bài làm
**Request Body:**

```json
{
  "soLanChuyenTab": 4
}
```

**Validation Rules:**

- soLanChuyenTab: sometimes, integer, min:0
  "dapAnId": 102
  }

```
**Validation Rules:**
- dapAnId: required, nullable, integer, exists:cau_tra_lois,id
    }
  ]
}
```

**Validation Rules:**

- answers: required, array
- answers.\*.cauHoiId: required, integer, exists:cau_hois,id
- answers.\*.dapAnId: required, integer, exists:cau_tra_lois,id01 09:00:00",
  "thoiGianNopBai": "2024-12-01 10:50:00",
  "status": "DA_NOP"
  }

````
**Validation Rules:**
- thoiGianBatDau: sometimes, date
- thoiGianNopBai: nullable, date, after_or_equal:thoiGianBatDau
- status: sometimes, in:DANG_LAM,TAM_LUU,DA_NOP,BI_HUY

#### DELETE /api/bailams/{bailam}
Xóa bài làm

#### POST /api/bailams/starttest
Bắt đầu bài thi (Custom endpoint)

#### PUT /api/bailams/updatestudenttest/{bailam}
Cập nhật câu trả lời bài thi (Custom endpoint)

#### PUT /api/bailams/submittest/{bailam}
Nộp bài thi (Custom endpoint)

---

### 5.2 Chi Tiết Bài Làm (Submission Details)

#### GET /api/chitietbailams
Lấy danh sách chi tiết bài làm

**Request Body:**
```json
{
  "deThiId": 1,
  "nhomHocPhanId": 1,
  "thoiGianBatDau": "2024-12-01 09:00:00",
  "thoiGianKetThuc": "2024-12-01 11:00:00"
}
````

**Validation Rules:**

- deThiId: required, integer, exists:de_this,id
- nhomHocPhanId: required, integer, exists:nhom_hoc_phans,id
- thoiGianBatDau: required, date
- thoiGianKetThuc: required, date, after:thoiGianBatDau

#### POST /api/chitietbailams

Tạo chi tiết bài làm mới

#### GET /api/chitietbailams/{chitietbailam}

Lấy chi tiết một phần bài làm

#### PUT /api/chitietbailams/{chitietbailam}

Cập nhật chi tiết bài làm

#### DELETE /api/chitietbailams/{chitietbailam}

Xóa chi tiết bài làm

---

### 5.3 Log Bài Làm (Submission Logs)

#### GET /api/logbailams

Lấy danh sách tất cả log bài làm

#### POST /api/logbailams

Tạo log bài làm mới

#### GET /api/logbailams/{logbailam}

Lấy chi tiết một log bài làm

#### PUT /api/logbailams/{logbailam}

Cập nhật log bài làm

#### DELETE /api/logbailams/{logbailam}

Xóa log bài làm

---

## 6. QUẢN LÝ GIAO BÀI & THÔNG BÁO

### 6.1 Giao Bài Thi (Test Assignment)

#### GET /api/giaobaithis

Lấy danh sách tất cả giao bài thi

#### POST /api/giaobaithis

Tạo giao bài thi mới

#### GET /api/giaobaithis/{giaobaithi}

Lấy chi tiết một giao bài thi

#### PUT /api/giaobaithis/{giaobaithi}

Cập nhật giao bài thi

#### DELETE /api/giaobaithis/{giaobaithi}

Xóa giao bài thi

---

### 6.2 Thông Báo (Notifications)

#### GET /api/thongbaos

Lấy danh sách tất cả thông báo

#### POST /api/thongbaos - Tạo thông báo mới

**Request Body:**

```json
{
  "tieuDe": "Thông báo bắt đầu buổi thi",
  "noiDung": "Các sinh viên vui lòng chuẩn bị cho buổi thi lập trình web vào lúc 9h sáng",
  "nguoiGuiId": 5,
  "thoiGianGui": "2024-12-01 08:00:00",
  "uuTien": 1,
  "status": true
}
```

**Validation Rules:**

- tieuDe: required, string, max:200
- noiDung: required, string
- nguoiGuiId: nullable, integer, exists:users,id
- thoiGianGui: nullable, date
- uuTien: nullable, integer
- status: nullable, boolean

#### GET /api/thongbaos/{thongbao}

Lấy chi tiết một thông báo

#### PUT /api/thongbaos/{thongbao} - Cập nhật thông báo

**Request Body:** (giống POST nhưng tất cả sometimes)

```json
{
  "tieuDe": "Thông báo lùi bắt đầu buổi thi",
  "noiDung": "Buổi thi được lùi lại 1 tiếng, bắt đầu lúc 10h sáng",
  "nguoiGuiId": 5,
  "thoiGianGui": "2024-12-01 08:30:00",
  "uuTien": 2,
  "status": true
}
```

**Validation Rules:** Giống POST nhưng tất cả sometimes

#### DELETE /api/thongbaos/{thongbao}

Xóa thông báo

---

### 6.3 Chi Tiết Thông Báo (Notification Details)

#### GET /api/chitietthongbaos

Lấy danh sách chi tiết thông báo

#### POST /api/chitietthongbaos

Tạo chi tiết thông báo mới

#### GET /api/chitietthongbaos/{chitietthongbao}

Lấy chi tiết một phần thông báo

#### PUT /api/chitietthongbaos/{chitietthongbao}

Cập nhật chi tiết thông báo

#### DELETE /api/chitietthongbaos/{chitietthongbao}

Xóa chi tiết thông báo

---

### 6.4 Chi Tiết Nhóm (Group Details)

#### GET /api/chitietnhoms

Lấy danh sách chi tiết nhóm

#### POST /api/chitietnhoms

Tạo chi tiết nhóm mới

#### GET /api/chitietnhoms/{chitietnhom}

Lấy chi tiết một phần nhóm

#### PUT /api/chitietnhoms/{chitietnhom}

Cập nhật chi tiết nhóm

#### DELETE /api/chitietnhoms/{chitietnhom}

Xóa chi tiết nhóm

---

## 7. BẢNG XẾP HẠNG

### 7.1 Ranking

#### GET /api/ranking

Lấy bảng xếp hạng

#### POST /api/ranking

Tạo bản ghi xếp hạng mới (Custom endpoint)

#### DELETE /api/ranking/{id}

Xóa bản ghi xếp hạng

---

## Ghi Chú Quan Trọng

### Response Format

Tất cả responses sử dụng format chung:

```json
{
    "success": true,
    "data": {...},
    "message": "Success message"
}
```

### HTTP Status Codes

- **200 OK** - Request thành công
- **201 Created** - Resource được tạo thành công (POST)
- **400 Bad Request** - Validation error
- **401 Unauthorized** - Chưa xác thực
- **403 Forbidden** - Không có quyền
- **404 Not Found** - Resource không tồn tại
- **422 Unprocessable Entity** - Validation failed
- **500 Internal Server Error** - Server error

### Authentication

- Endpoints yêu cầu xác thực được đánh dấu `(require auth)`
- Sử dụng JWT token với Bearer scheme:

```
Headers:
Authorization: Bearer {token}
```

### Validation Notes

- Required rules: Field bắt buộc phải có
- Sometimes rules: Field tùy chọn, chỉ validate nếu có
- Unique rules: Giá trị phải duy nhất trong database
- Exists rules: Giá trị phải tồn tại trong database table được chỉ định
- Date format: Y-m-d (ví dụ: 2024-12-01)
- DateTime format: Y-m-d H:i:s (ví dụ: 2024-12-01 09:00:00)

### Pagination (nếu áp dụng)

Các endpoint GET có thể hỗ trợ query parameters:

```
GET /api/{resource}?page=1&per_page=15&sort=-created_at&filter[status]=active
```

### Rate Limiting

- Ranking API: throttle:10,1 (10 requests per 1 minute)

---

**Cập nhật lần cuối:** 24/03/2026
