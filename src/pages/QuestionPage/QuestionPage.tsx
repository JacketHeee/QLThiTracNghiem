import { useMemo, useState } from "react";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Tabs from "@/components/atomic/molecules/Tabs/Tabs";
import AddQuestionForm from "@/components/atomic/organisms/AddQuestionForm/AddQuestionForm";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import QuestionItem, {
  type QuestionData,
} from "@/components/atomic/molecules/QuestionItem/QuestionItem";

const MOCK_QUESTIONS: QuestionData[] = [
  {
    id: "1",
    difficulty: "Thông hiểu",
    category: "Lập trình hướng đối tượng/Chương 1",
    content: "Mã số sinh viên của bạn là gì?",
    timeAgo: "5 giờ",
    usageCount: 160,
    status: "public",
    answers: [
      { label: "A", content: "Mã số định danh duy nhất" },
      { label: "B", content: "Số chứng minh nhân dân", isCorrect: true },
      { label: "C", content: "Số điện thoại cá nhân" },
      { label: "D", content: "Họ và tên viết tắt" },
    ],
  },
  {
    id: "2",
    difficulty: "Vận dụng",
    category: "Cấu trúc dữ liệu/Cây nhị phân",
    content: "Độ phức tạp của thuật toán tìm kiếm trên cây BST là bao nhiêu?",
    timeAgo: "1 ngày",
    usageCount: 45,
    status: "private",
    answers: [
      { label: "A", content: "O(n)" },
      { label: "B", content: "O(1)" },
      { label: "C", content: "O(log n)", isCorrect: true },
      { label: "D", content: "O(n log n)" },
    ],
  },
  {
    id: "3",
    difficulty: "Nhận biết",
    category: "ReactJS/Hook",
    content: "Hook nào dùng để quản lý side effect trong React?",
    timeAgo: "2 giờ",
    usageCount: 1200,
    status: "public",
    answers: [
      { label: "A", content: "useState" },
      { label: "B", content: "useEffect", isCorrect: true },
      { label: "C", content: "useContext" },
      { label: "D", content: "useMemo" },
    ],
  },
  {
    id: "4",
    difficulty: "Vận dụng cao",
    category: "Toán cao cấp/Ma trận",
    content: "Tính định thức của ma trận xoay chiều 4x4 sau...",
    timeAgo: "12 giờ",
    usageCount: 12,
    status: "archive",
  },
  {
    id: "5",
    difficulty: "Thông hiểu",
    category: "Mạng máy tính/OSI",
    content: "Tầng nào trong mô hình OSI chịu trách nhiệm định tuyến?",
    timeAgo: "3 ngày",
    usageCount: 89,
    status: "public",
    answers: [
      { label: "A", content: "Physical Layer" },
      { label: "B", content: "Data Link Layer" },
      { label: "C", content: "Network Layer", isCorrect: true },
      { label: "D", content: "Transport Layer" },
    ],
  },
];

export const QuestionPage = () => {
  const [selectedTab, setSelectedTab] = useState("public");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");

  const filteredQuestions = useMemo(() => {
    return MOCK_QUESTIONS.filter((q) => {
      // 1. Lọc theo Tab (Trạng thái)
      const matchTab = q.status === selectedTab;

      // 2. Lọc theo nội dung Search (Không phân biệt hoa thường)
      const matchSearch = q.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // 3. Lọc theo Độ khó (nếu có chọn)
      const matchDifficulty = filterDifficulty
        ? q.difficulty === filterDifficulty
        : true;

      return matchTab && matchSearch && matchDifficulty;
    });
  }, [selectedTab, searchQuery, filterDifficulty]);

  const handleAction = (type: string, id: string) => {
    console.log(`Action: ${type} on ID: ${id}`);
  };

  return (
    <MainContentLayout>
      <div className="flex flex-col gap-3 rounded-md bg-background-body-background">
        <div className="border-b-1 flex items-center justify-between border-other-outlined-border pr-3">
          <Tabs
            value={selectedTab}
            onChange={setSelectedTab}
            tabs={[
              { value: "public", label: "Công khai" },
              { value: "private", label: "Cá nhân" },
              { value: "archive", label: "Lưu trữ" },
            ]}
          />
          <Button
            onClick={() => setIsAddOpen(true)}
            variant="contained"
            color="primary"
          >
            Thêm câu hỏi <Icon name="arrowDown" />
          </Button>
        </div>

        <div className="flex gap-5 px-3">
          <SelectField
            label="Môn học"
            placeholder="Chọn môn học"
            options={[
              { label: "Lập trình React", value: "react" },
              { label: "Toán cao cấp", value: "math" },
            ]}
            onSelect={() => {}}
          />
          <SelectField
            label="Chương"
            placeholder="Chọn chương"
            options={[
              { label: "Nhận biết", value: "Nhận biết" },
              { label: "Thông hiểu", value: "Thông hiểu" },
              { label: "Vận dụng", value: "Vận dụng" },
              { label: "Vận dụng cao", value: "Vận dụng cao" },
            ]}
            onSelect={() => {}}
          />
          <SelectField
            label="Độ khó"
            placeholder="Chọn độ khó"
            options={[
              { label: "Nhận biết", value: "Nhận biết" },
              { label: "Thông hiểu", value: "Thông hiểu" },
              { label: "Vận dụng", value: "Vận dụng" },
              { label: "Vận dụng cao", value: "Vận dụng cao" },
            ]}
            onSelect={(val) => setFilterDifficulty(val.toString())}
          />
        </div>
        <div className="flex gap-5 px-3 pb-3">
          <Input
            className="flex-1"
            placeholder={`Tìm kiếm trong ${filteredQuestions.length} câu hỏi...`}
            hasBoder={true}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Icon name="search" className="text-text-secondary" />}
          />
          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => {
              setSearchQuery("");
              setFilterDifficulty("");
            }}
          >
            <Icon name="arrowUpDown" />
          </Button>
        </div>
      </div>

      {/* List Section */}
      <section className="mt-4 flex flex-col gap-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <QuestionItem
              key={q.id}
              data={q}
              onEdit={(id) => handleAction("edit", id)}
              onDelete={(id) => handleAction("delete", id)}
              onAddToBank={(id) => handleAction("add-to-bank", id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-other-outlined-border bg-background-body-background py-20">
            <span className="italic text-text-secondary">
              Không tìm thấy câu hỏi nào phù hợp
            </span>
          </div>
        )}
      </section>

      <AddQuestionForm isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </MainContentLayout>
  );
};
