"use client";

import { Tooltip, IconButton } from "@mui/material";
import {
  FilterListIcon,
  ExpandMoreIcon,
  ExpandLessIcon,
  HelpOutlineIcon,
  ClearIcon,
} from "@/icons";
import { useAtom } from "jotai";
import {
  filterCategoryAtom,
  filterStageAtom,
  filterStatusAtom,
} from "@/lib/utils/atoms";

interface IngredientsFilterProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export default function IngredientsFilter({
  showFilters,
  setShowFilters,
}: IngredientsFilterProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(filterCategoryAtom);
  const [selectedStageFilter, setSelectedStageFilter] =
    useAtom(filterStageAtom);
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useAtom(filterStatusAtom);

  const categories = [
    { value: "all", label: "すべて" },
    { value: "穀類", label: "穀類" },
    { value: "肉", label: "肉" },
    { value: "魚", label: "魚" },
    { value: "野菜", label: "野菜" },
    { value: "きのこ", label: "きのこ" },
    { value: "海藻", label: "海藻" },
    { value: "果物", label: "果物" },
    { value: "豆類", label: "豆類" },
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

  // 選択されているフィルターのタグを生成する関数
  const getSelectedFilterTags = () => {
    const tags = [];

    if (selectedCategory !== "all") {
      const label = categories.find(
        (cat) => cat.value === selectedCategory
      )?.label;
      if (label) {
        tags.push({
          type: "category",
          label: `${label}`,
          reset: () => setSelectedCategory("all"),
        });
      }
    }

    if (selectedStageFilter !== "all") {
      const label = stageFilters.find(
        (stage) => stage.value === selectedStageFilter
      )?.label;
      if (label) {
        tags.push({
          type: "stage",
          label: `${label}`,
          reset: () => setSelectedStageFilter("all"),
        });
      }
    }

    if (selectedStatusFilter !== "all") {
      const label = statusFilters.find(
        (status) => status.value === selectedStatusFilter
      )?.label;
      if (label) {
        tags.push({
          type: "status",
          label: `${label}`,
          reset: () => setSelectedStatusFilter("all"),
        });
      }
    }

    return tags;
  };

  const activeFilterTags = getSelectedFilterTags();

  const helpText =
    "初期(5-6ヶ月)、中期(7-8ヶ月)、後期(9-11ヶ月)、完了期(12-18ヶ月)";

  return (
    <>
      <div className="flex items-center justify-between">
        {/* 選択中のタグ表示エリア */}
        {activeFilterTags && (
          <div className="flex flex-wrap gap-3 mr-4">
            {activeFilterTags.map((tag) => (
              <span
                key={tag.type}
                className={`flex items-center rounded-full px-4 py-2 text-sm font-medium hover:shadow-sm hover:-translate-y-1 ${
                  tag.type === "category"
                    ? "bg-violet-100"
                    : tag.type === "stage"
                    ? "bg-amber-100"
                    : "bg-blue-100"
                }`}
              >
                {tag.label}
                <button
                  type="button"
                  onClick={tag.reset}
                  className="ml-1 h-4 w-4 flex-shrink-0 rounded-full flex items-center justify-center"
                >
                  <ClearIcon
                    className={`h-3 w-3 ${
                      tag.type === "category"
                        ? "text-violet-600"
                        : tag.type === "stage"
                        ? "text-amber-600"
                        : "text-blue-600"
                    }`}
                  />
                </button>
              </span>
            ))}
          </div>
        )}
        {/* フィルターボタン */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-stone-200 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <FilterListIcon />
            <span className="text-sm font-medium">フィルター</span>
            {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </button>
        </div>
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
