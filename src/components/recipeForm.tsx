"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FormControlLabel, Switch } from "@mui/material";
import {
  AddIcon,
  DeleteIcon,
  CloseIcon,
  InfoOutlineIcon,
  PhotoCameraIcon,
  ImageIcon,
  ScheduleIcon,
  PeopleIcon,
} from "@/icons";
import { createRecipe, updateRecipe } from "@/lib/supabase";
import { Category, Recipe, Stage } from "@/types/types";

const stageValues: Stage[] = ["初期", "中期", "後期", "完了期"];
const categoryValues: Category[] = ["主食", "主菜", "副菜", "汁物", "おやつ"];

export default function RecipeForm({
  initialData,
  isEditMode,
}: {
  initialData: Recipe | null;
  isEditMode: boolean;
}) {
  // フォームの状態を管理
  const [formData, setFormData] = useState<Omit<Recipe, "id">>({
    name: "",
    image: "",
    startStage: "初期",
    cookingTime: "",
    servings: "",
    description: "",
    ingredients: [{ name: "", amount: "", note: "" }],
    steps: [{ step: 1, description: "", image: "" }],
    tags: [],
    isPrivate: false,
    date: new Date(),
    isFavorite: false,
    author: "",
    isOwn: true,
    savedMemo: "",
    category: "主食",
    type: "recipe",
    // status: "draft",
  });

  // フォーム送信ボタンのローディング状態
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const stepImageInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ルーターフックを初期化
  const router = useRouter();

  // 編集モードの場合、初期データでフォームを初期化
  useEffect(() => {
    if (initialData) {
      // initialDataにidがある場合は除外してセット
      const { id, ...rest } = initialData;
      setFormData({
        ...rest,
        name: rest.name || "",
        image: rest.image || "",
        startStage: rest.startStage || "初期",
        cookingTime: rest.cookingTime || "",
        servings: rest.servings || "",
        description: rest.description || "",
        ingredients: rest.ingredients || [{ name: "", amount: "", note: "" }],
        steps: rest.steps || [{ title: "", description: "", image: "" }],
        tags: rest.tags || [],
        isPrivate: rest.isPrivate || false,
        date: new Date(),
        isFavorite: rest.isFavorite || false,
        author: rest.author || "",
        isOwn: rest.isOwn || true,
        savedMemo: rest.savedMemo || "",
        category: rest.category || "主食",
        type: rest.type || "recipe",
        // status: rest.status || "draft",
      });
    }
  }, [initialData]);

  // 画像ファイル処理（実際の実装ではファイルアップロード処理が必要）
  const handleImageUpload = (file: File, callback: (url: string) => void) => {
    // 実際の実装では、ここでファイルをサーバーにアップロードしてURLを取得
    // 現在はダミーのURL生成
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // メイン画像の変更処理
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, (url) => {
        setFormData((prev) => ({ ...prev, image: url }));
      });
    }
  };

  // ステップ画像の変更処理
  const handleStepImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    stepIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, (url) => {
        const newSteps = [...formData.steps];
        newSteps[stepIndex] = { ...newSteps[stepIndex], image: url };
        setFormData((prev) => ({ ...prev, steps: newSteps }));
      });
    }
  };

  // 入力フィールドの変更をハンドル
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 離乳食段階のチェックボックス変更
  const handleStageChange = (stage: Stage) => {
    setFormData((prev) => {
      const newStartStage = prev.startStage == stage ? prev.startStage : stage;
      console.log(newStartStage);
      return { ...prev, startStage: newStartStage };
    });
  };

  // カテゴリーのチェックボックス変更
  const handleCategoryChange = (category: Category) => {
    setFormData((prev) => {
      const newCategory = prev.category == category ? prev.category : category;
      console.log(newCategory);
      return { ...prev, category: newCategory };
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
      steps: prev.steps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, step: i + 1 })),
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
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
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
    try {
      // Supabaseにデータを挿入
      let result;
      if (isEditMode && initialData?.id) {
        // 編集モードの場合、IDを使ってレシピを更新
        result = await updateRecipe(initialData.id, formData);
      } else {
        // 新規作成モードの場合、レシピを作成
        result = await createRecipe(formData);
      }

      const { data, error } = result;
      if (error) {
        throw error;
      }
      console.log("レシピを保存しました:", data);
      router.push("/"); // 成功したらトップページにリダイレクト
    } catch (error) {
      console.error("レシピの保存に失敗しました:", error);
      // alert("レシピの保存に失敗しました。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  // 下書き保存処理
  const handleSaveDraft = async () => {
    setIsSaving(true);
    // TODO: 下書きとして保存するロジック（isPrivateを強制的にtrueにするなど）を実装
    console.log("下書きとして保存:", formData);
    setTimeout(() => {
      setIsSaving(false);
      alert("下書きとして保存しました！");
    }, 1000);
  };

  return (
    <div className="p-4 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* レシピ基本情報 */}
        <section className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col items-center space-y-4">
            {/* 画像プレビュー */}
            <div
              className="w-[200px] h-[200px] bg-stone-100 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer hover:bg-stone-200 transition-colors group relative"
              onClick={() => mainImageInputRef.current?.click()}
            >
              {formData.image ? (
                <>
                  <Image
                    src={formData.image}
                    alt="レシピ画像"
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PhotoCameraIcon className="text-white text-3xl" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-stone-400 group-hover:text-stone-500">
                  <ImageIcon style={{ fontSize: 48 }} />
                  <span className="text-sm font-medium">画像を追加</span>
                  <span className="text-xs">タップして選択</span>
                </div>
              )}
            </div>
            <input
              ref={mainImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="hidden"
            />
          </div>

          <div className="space-y-4 mt-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="にんじんとかぼちゃの煮物"
              className="w-full bg-stone-50 rounded-lg p-3 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium text-lg"
              required
            />

            {/* 離乳食段階選択 */}
            <div className="space-y-2 mb-6">
              <h2 className="text-sm font-medium text-stone-600 mb-2">
                離乳食開始時期
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {stageValues.map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => handleStageChange(stage)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.startStage.includes(stage)
                        ? "bg-purple-100 text-purple-700 ring-2 ring-purple-300"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            {/* カテゴリー選択 */}
            <div className="space-y-2 mb-6">
              <h2 className="text-sm font-medium text-stone-600 mb-2">
                カテゴリー
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {categoryValues.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.category === category
                        ? "bg-purple-100 text-purple-700 ring-2 ring-purple-300"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center">
                <ScheduleIcon />
                <input
                  type="text"
                  name="cookingTime"
                  value={formData.cookingTime || ""}
                  onChange={handleChange}
                  placeholder="15分"
                  className="w-30 bg-stone-50 rounded-lg p-3 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ml-2"
                />
              </div>
              <div className="flex items-center">
                <PeopleIcon />
                <input
                  type="text"
                  name="servings"
                  value={formData.servings || ""}
                  onChange={handleChange}
                  placeholder="1食分"
                  className="w-30 bg-stone-50 rounded-lg p-3 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ml-2"
                />
              </div>
            </div>

            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="甘くて栄養満点！赤ちゃんが大好きな定番メニューです。自然の甘みで食べやすく、冷凍保存も可能です。"
              rows={4}
              className="w-full bg-stone-50 rounded-lg p-3 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
            />

            <div className="flex items-center space-x-3">
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
                        color: "#9333EA", // スイッチの丸
                        "&:hover": {
                          backgroundColor: "rgba(147, 51, 234, 0.08)", // hover時
                        },
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#9333EA", // スイッチのトラック
                        },
                    }}
                  />
                }
                label="非公開にする"
              />
              <div className="group relative">
                <InfoOutlineIcon className="w-5 h-5 text-stone-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-stone-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  非公開レシピは自分専用なので、他のユーザーは閲覧できません
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 材料 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-stone-700">材料</h3>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 hover:text-white hover:bg-purple-500 border border-purple-500 rounded-full transition-all"
            >
              <AddIcon className="w-4 h-4 mr-1" />
              追加
            </button>
          </div>
          <div className="bg-white rounded-3xl px-6 py-2 shadow-sm">
            {formData.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex-col items-center py-4 border-b border-stone-100 last:border-b-0"
              >
                <div className="flex justify-between space-x-2 mb-2">
                  <input
                    type="text"
                    name="name"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(e, index)}
                    placeholder="にんじん"
                    className="flex-1 bg-stone-50 rounded-lg p-3 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  <input
                    type="text"
                    name="amount"
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(e, index)}
                    placeholder="30g"
                    className="w-24 bg-stone-50 rounded-lg p-3 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div className="flex justify-between">
                  <input
                    type="text"
                    name="note"
                    value={ingredient.note || ""}
                    onChange={(e) => handleIngredientChange(e, index)}
                    placeholder="皮を厚めに剥く"
                    className="flex-1 bg-stone-50 rounded-lg p-3 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="材料を削除"
                    >
                      <DeleteIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 作り方 */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-stone-700">作り方</h3>
            <button
              type="button"
              onClick={handleAddStep}
              className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 hover:text-white hover:bg-purple-500 border border-purple-500 rounded-full transition-all"
            >
              <AddIcon className="w-4 h-4 mr-1" />
              追加
            </button>
          </div>
          <div className="space-y-6">
            {formData.steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-700 text-lg">
                    ステップ {index + 1}
                  </h4>
                  {formData.steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="ステップを削除"
                    >
                      <DeleteIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <textarea
                  name="description"
                  value={step.description}
                  onChange={(e) => handleStepChange(e, index)}
                  placeholder="にんじんとかぼちゃを月齢に適した大きさに切る。にんじんは皮を厚めに剥き、かぼちゃは種とワタを取り除きます。"
                  rows={3}
                  className="w-full bg-stone-50 rounded-lg p-3 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                />

                {/* ステップ画像 */}
                <div className="flex items-center space-x-4">
                  <div
                    className="w-32 h-24 bg-stone-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-stone-200 transition-colors group relative overflow-hidden"
                    onClick={() => stepImageInputRefs.current[index]?.click()}
                  >
                    {step.image ? (
                      <>
                        <Image
                          src={step.image}
                          alt={`ステップ${index + 1}の画像`}
                          width={128}
                          height={96}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <PhotoCameraIcon className="text-white text-xl" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center space-y-1 text-stone-400 group-hover:text-stone-500">
                        <ImageIcon style={{ fontSize: 24 }} />
                        <span className="text-xs">画像追加</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={(el) => {
                      stepImageInputRefs.current[index] = el;
                    }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleStepImageChange(e, index)}
                    className="hidden"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* タグ */}
        <section className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-stone-700 mb-4">タグ</h3>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="作り置きOK"
            className="w-full bg-stone-50 rounded-lg p-3 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all mb-4"
          />
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-amber-600 hover:text-amber-800 transition-colors"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* フォーム送信ボタン */}
        <div className="flex justify-center space-x-8 p-4">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-6 py-3 bg-stone-200 text-stone-700 rounded-full font-medium hover:bg-stone-300 transition-colors disabled:opacity-50"
          >
            下書き保存
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-3 bg-purple-500 text-white rounded-full font-medium hover:bg-purple-600 transition-colors disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="animate-spin h-5 w-5 mr-3 border-4 border-white border-t-transparent rounded-full"></div>
            ) : isEditMode ? (
              "レシピを更新"
            ) : (
              "レシピを保存"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
