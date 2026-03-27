import { useMemo, useState } from "react";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Tabs from "@/components/atomic/molecules/Tabs/Tabs";
import AddQuestionForm from "@/components/atomic/organisms/AddQuestionForm/AddQuestionForm";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import QuestionItem from "@/components/atomic/molecules/QuestionItem/QuestionItem";
import { useDoKho } from "@/hooks/useDoKho";
import type { DoKho, Question, QuestionStatus } from "@/types";
import { useSubject } from "@/hooks/useSubject";
import { useQuestions } from "@/hooks/useQuestion";

export const QuestionPage = () => {
  const [selectedTab, setSelectedTab] = useState<QuestionStatus>("public");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterDifficulty, setFilterDifficulty] = useState<DoKho>();

  const { doKhos } = useDoKho();
  const { subjects } = useSubject();
  const { questions } = useQuestions();

  const filteredQuestions = useMemo(() => {
    return questions.filter((q: Question) => {
      // 1. Lọc theo Tab (Trạng thái)
      const matchTab = q.status === selectedTab;

      // 2. Lọc theo nội dung Search (Không phân biệt hoa thường)
      const matchSearch = q.noiDungCauHoi
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // 3. Lọc theo Độ khó (nếu có chọn)
      const matchDifficulty = filterDifficulty
        ? q.do_kho === filterDifficulty
        : true;

      return matchTab && matchSearch && matchDifficulty;
    });
  }, [questions, selectedTab, searchQuery, filterDifficulty]);

  const handleAction = (type: string, id: string) => {
    console.log(`Action: ${type} on ID: ${id}`);
  };

  return (
    <MainContentLayout>
      <div className="flex flex-col gap-3 rounded-md bg-background-body-background">
        <div className="border-b-1 flex items-center justify-between border-other-outlined-border pr-3">
          <Tabs
            value={selectedTab}
            onChange={(val) => setSelectedTab(val as QuestionStatus)}
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
            options={subjects.map((item) => ({
              label: item.tenMonHoc,
              value: item.id,
            }))}
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
            options={doKhos.map((item) => ({
              label: item.tenDoKho,
              value: item.id,
            }))}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onSelect={(val) => {
              // setFilterDifficulty();
            }}
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
              // setFilterDifficulty("");
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
