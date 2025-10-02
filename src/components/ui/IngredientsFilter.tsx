import { Tooltip, IconButton } from "@mui/material";
import {
  FilterListIcon,
  ExpandMoreIcon,
  ExpandLessIcon,
  HelpOutlineIcon,
} from "@/icons";

interface IngredientsFilterProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedStageFilter: string;
  setSelectedStageFilter: (stage: string) => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (status: string) => void;
}

export default function IngredientsFilter({
  showFilters,
  setShowFilters,
  selectedCategory,
  setSelectedCategory,
  selectedStageFilter,
  setSelectedStageFilter,
  selectedStatusFilter,
  setSelectedStatusFilter,
}: IngredientsFilterProps) {
  const categories = [
    { value: "all", label: "すべて" },
    { value: "穀類", label: "穀類" },
    { value: "肉・魚", label: "肉・魚" },
    { value: "野菜・きのこ・海藻", label: "野菜・きのこ・海藻" },
    { value: "果物", label: "果物" },
    { value: "大豆・豆類", label: "大豆・豆類" },
    { value: "乳製品", label: "乳製品" },
    { value: "卵", label: "卵" },
    { value: "その他", label: "その他" },
  ];

  const stageFilters = [
    { value: "all", label: "すべて" },
    { value: "初期", label: "初期" },
    { value: "中期", label: "中期" },
    { value: "後期", label: "後期" },
    { value: "完了機", label: "完了期" },
  ];

  const statusFilters = [
    { value: "all", label: "すべて" },
    { value: "not-eaten", label: "未経験" },
    { value: "eaten", label: "食べた" },
    { value: "ng", label: "NG" },
  ];

  const helpText =
    "初期(5-6ヶ月)、中期(7-8ヶ月)、後期(9-11ヶ月)、完了期(12-18ヶ月)";

  return (
    <>
      {/* フィルターボタン */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-stone-200 rounded-full shadow-sm hover:shadow-md transition-all"
        >
          <FilterListIcon />
          <span className="text-sm font-medium">フィルター</span>
          {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </button>
      </div>

      {/* フィルター */}
      {showFilters && (
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          {/* カテゴリフィルター */}
          <div>
            <h3 className="text-sm font-medium text-stone-700 mb-4">
              食材カテゴリ
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-2 py-1 rounded-full text-sm transition-all ${
                    selectedCategory === category.value
                      ? "bg-violet-100 text-violet-600 border border-violet-200"
                      : "bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* 離乳食段階フィルター */}
          <div>
            <div className="flex items-center text-center mb-4">
              <h3 className="text-sm font-medium text-stone-700">離乳食段階</h3>
              <Tooltip
                title={helpText}
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "rgba(0, 0, 0, 0.8)",
                      fontSize: "12px",
                      maxWidth: 280,
                    },
                  },
                }}
              >
                <IconButton
                  size="small"
                  sx={{
                    padding: 0.5,
                    marginLeft: 0.5,
                    color: "rgba(120, 113, 108, 0.7)",
                    "&:hover": {
                      color: "rgba(120, 113, 108, 1)",
                      backgroundColor: "rgba(147, 51, 234, 0.1)",
                    },
                  }}
                >
                  <HelpOutlineIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </div>
            <div className="flex flex-wrap gap-2">
              {stageFilters.map((stageFilter) => (
                <button
                  key={stageFilter.value}
                  onClick={() => setSelectedStageFilter(stageFilter.value)}
                  className={`px-2 py-1 rounded-full text-sm transition-all ${
                    selectedStageFilter === stageFilter.value
                      ? "bg-amber-100 text-amber-600 border border-amber-200"
                      : "bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {stageFilter.label}
                </button>
              ))}
            </div>
          </div>

          {/* ステータスフィルター */}
          <div>
            <h3 className="text-sm font-medium text-stone-700 mb-4">
              食べた記録
            </h3>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((statusFilter) => (
                <button
                  key={statusFilter.value}
                  onClick={() => setSelectedStatusFilter(statusFilter.value)}
                  className={`px-2 py-1 rounded-full text-sm transition-all ${
                    selectedStatusFilter === statusFilter.value
                      ? "bg-blue-100 text-blue-600 border border-blue-200"
                      : "bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {statusFilter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
