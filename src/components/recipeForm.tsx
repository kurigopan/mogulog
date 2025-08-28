"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Recipe, recipeIngredient, recipeStep, Stage } from "@/types/types";
import {
  AddIcon,
  DeleteIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoOutlineIcon,
} from "@/icons";
import {
  Tooltip,
  IconButton,
  Switch,
  FormControlLabel,
  TextField,
  Chip,
} from "@mui/material";

interface FormInput {
  name: string;
  image: string;
  stages: Stage[];
  cookingTime: string;
  servings: string;
  description: string;
  ingredients: recipeIngredient[];
  steps: recipeStep[];
  nutritionTips: string[];
  tags: string[];
  isPrivate: boolean;
}

const stageValues: Stage[] = ["初期", "中期", "後期", "完了期"];

// レシピフォームのコンポーネント
export default function RecipeForm({
  initialData,
  isEditMode,
}: {
  initialData: Recipe | null;
  isEditMode: boolean;
}) {
  // フォームの状態を管理
  const [formData, setFormData] = useState<FormInput>({
    name: "",
    image: "",
    stages: [],
    cookingTime: "",
    servings: "",
    description: "",
    ingredients: [{ name: "", amount: "", note: "" }],
    steps: [{ step: 1, title: "", description: "", time: "", image: "" }],
    nutritionTips: [],
    tags: [],
    isPrivate: false,
  });

  // フォーム送信ボタンのローディング状態
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // 編集モードの場合、初期データでフォームを初期化
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        image: initialData.image || "",
        stages: initialData.stages || [],
        cookingTime: initialData.cookingTime || "",
        servings: initialData.servings || "",
        description: initialData.description || "",
        ingredients: initialData.ingredients || [
          { name: "", amount: "", note: "" },
        ],
        steps: initialData.steps || [
          { title: "", description: "", time: "", image: "" },
        ],
        nutritionTips: initialData.nutritionTips || [],
        tags: initialData.tags || [],
        isPrivate: initialData.isPrivate || false,
      });
    }
  }, [initialData]);

  // 入力フィールドの変更をハンドル
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 離乳食段階のチェックボックス変更をハンドル
  const handleStageChange = (stage: Stage) => {
    setFormData((prev) => {
      const newStages = prev.stages.includes(stage)
        ? prev.stages.filter((s) => s !== stage)
        : [...prev.stages, stage];
      return { ...prev, stages: newStages };
    });
  };

  // 材料の追加・削除
  const handleAddIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", amount: "", note: "" }],
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [name]: value };
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  // 作り方の追加・削除
  const handleAddStep = () => {
    setFormData((prev) => {
      const lastStep =
        prev.steps.length > 0 ? prev.steps[prev.steps.length - 1].step : 0;
      return {
        ...prev,
        steps: [
          ...prev.steps,
          {
            step: lastStep + 1,
            title: "",
            description: "",
            time: "",
            image: "",
          },
        ],
      };
    });
  };

  const handleRemoveStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const handleStepChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [name]: value };
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  // タグの追加・削除
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: ここにAPIコールを追加してデータを送信する
    console.log("フォームデータを保存:", formData);
    // 成功または失敗に応じてローディング状態をリセット
    setTimeout(() => {
      setIsSaving(false);
      alert("保存しました！"); // 成功メッセージ
    }, 1500);
  };

  return (
    <div className="p-4 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* レシピ基本情報 */}
        <section className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col items-center space-y-4">
            {/* 画像プレビュー */}
            <div className="w-[200px] h-[200px] bg-stone-100 rounded-2xl flex items-center justify-center overflow-hidden">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt="レシピ画像"
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <span className="text-stone-400 text-sm">画像なし</span>
              )}
            </div>
            <TextField
              fullWidth
              label="画像のURL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="画像のURLを入力"
              variant="outlined"
              size="small"
            />
          </div>

          <div className="space-y-4 mt-6">
            <TextField
              fullWidth
              label="レシピ名"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="例：にんじんとかぼちゃの煮物"
              variant="outlined"
            />
            <div className="flex flex-wrap gap-2">
              {stageValues.map((stage) => (
                <Chip
                  key={stage}
                  label={`離乳食${stage}`}
                  onClick={() => handleStageChange(stage)}
                  color={
                    formData.stages.includes(stage) ? "secondary" : "default"
                  }
                  variant={
                    formData.stages.includes(stage) ? "filled" : "outlined"
                  }
                  sx={{
                    borderRadius: "9999px",
                    fontWeight: "medium",
                    "&.MuiChip-colorSecondary": {
                      backgroundColor: "#f5f3ff",
                      color: "#9333ea",
                    },
                    "&.MuiChip-outlined": {
                      borderColor: "#e7e5e4",
                      color: "#78716c",
                    },
                  }}
                />
              ))}
            </div>
            <div className="flex space-x-4">
              <TextField
                className="flex-1"
                label="調理時間"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
                placeholder="例：15分"
                variant="outlined"
              />
              <TextField
                className="flex-1"
                label="分量"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                placeholder="例：1食分"
                variant="outlined"
              />
            </div>
            <TextField
              fullWidth
              label="レシピの説明"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="レシピのポイントや赤ちゃんへの想いを自由に書いてみましょう"
              multiline
              rows={4}
              variant="outlined"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPrivate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPrivate: e.target.checked,
                    }))
                  }
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#9333ea",
                      "&:hover": {
                        backgroundColor: "rgba(147, 51, 234, 0.08)",
                      },
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#9333ea",
                    },
                  }}
                />
              }
              label="非公開にする"
            />
            <Tooltip
              title="非公開レシピは自分専用なので、他のユーザーは閲覧できません。"
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
                sx={{ color: "rgba(120, 113, 108, 0.7)" }}
              >
                <InfoOutlineIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </div>
        </section>

        {/* 材料 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-stone-700">材料</h3>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              <AddIcon fontSize="small" className="mr-1" />
              追加
            </button>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-2">
                <TextField
                  className="flex-1"
                  label="材料名"
                  name="name"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(e, index)}
                  size="small"
                />
                <TextField
                  className="w-24"
                  label="分量"
                  name="amount"
                  value={ingredient.amount}
                  onChange={(e) => handleIngredientChange(e, index)}
                  size="small"
                />
                <TextField
                  className="flex-1"
                  label="備考"
                  name="note"
                  value={ingredient.note}
                  onChange={(e) => handleIngredientChange(e, index)}
                  size="small"
                />
                <Tooltip title="材料を削除">
                  <IconButton onClick={() => handleRemoveIngredient(index)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </div>
            ))}
          </div>
        </section>

        {/* 作り方 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-stone-700">作り方</h3>
            <button
              type="button"
              onClick={handleAddStep}
              className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              <AddIcon fontSize="small" className="mr-1" />
              ステップ追加
            </button>
          </div>
          <div className="space-y-4">
            {formData.steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-700">
                    ステップ {index + 1}
                  </h4>
                  <Tooltip title="ステップを削除">
                    <IconButton onClick={() => handleRemoveStep(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </div>
                <TextField
                  fullWidth
                  label="タイトル"
                  name="title"
                  value={step.title}
                  onChange={(e) => handleStepChange(e, index)}
                />
                <TextField
                  fullWidth
                  label="説明"
                  name="description"
                  value={step.description}
                  onChange={(e) => handleStepChange(e, index)}
                  multiline
                  rows={3}
                />
                <div className="flex items-center space-x-2">
                  <TextField
                    className="flex-1"
                    label="所要時間"
                    name="time"
                    value={step.time}
                    onChange={(e) => handleStepChange(e, index)}
                    size="small"
                  />
                  <TextField
                    className="flex-1"
                    label="画像のURL"
                    name="image"
                    value={step.image}
                    onChange={(e) => handleStepChange(e, index)}
                    size="small"
                  />
                </div>
                {step.image && (
                  <div className="w-full h-auto rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src={step.image}
                      alt={`ステップ${index + 1}の画像`}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* タグ */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-stone-700">タグ</h3>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <TextField
              fullWidth
              label="タグを追加"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="例：作り置きOK"
              helperText="タグを入力してEnterキーを押してください"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  deleteIcon={<CloseIcon />}
                  sx={{
                    borderRadius: "9999px",
                    fontWeight: "medium",
                    backgroundColor: "#fef3c7",
                    color: "#92400e",
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* フォーム送信ボタン */}
        <div className="flex justify-end p-4">
          <button
            type="submit"
            className="flex items-center px-8 py-3 bg-purple-500 text-white rounded-2xl font-medium hover:bg-purple-600 transition-colors"
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="animate-spin h-5 w-5 mr-3 border-4 border-white border-t-transparent rounded-full"></span>
            ) : (
              <CheckCircleIcon className="mr-2" />
            )}
            {isEditMode ? "レシピを更新" : "レシピを保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
