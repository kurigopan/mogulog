"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import { FormControlLabel, Switch } from "@mui/material";
import {
  AddIcon,
  // InfoOutlineIcon,
  PhotoCameraIcon,
  ImageIcon,
  ScheduleIcon,
  PeopleIcon,
  ClearIcon,
  ErrorIcon,
} from "@/icons";
import { useAtomValue } from "jotai";
import { userIdAtom } from "@/lib/utils/atoms";
import {
  createRecipe,
  createRecipeAllergens,
  deleteRecipeAllergens,
  getAllergens,
  getRecipeAllergensById,
  updateRecipe,
  uploadImage,
} from "@/lib/supabase";
import { Allergen, Category, Recipe, Stage } from "@/types";

const stageValues: Stage[] = ["初期", "中期", "後期", "完了期"];
const categoryValues: Category[] = ["主食", "主菜", "副菜", "汁物", "おやつ"];

export default function RecipeForm({
  initialData,
  isEditMode,
}: {
  initialData: Recipe | null;
  isEditMode: boolean;
}) {
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
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [allergenInclusions, setAllergenInclusions] = useState<
    Record<string, boolean>
  >({});
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestedAllergenNames, setSuggestedAllergenNames] = useState<
    string[]
  >([]);
  const [image, setImage] = useState<File | null>(null);
  const userId = useAtomValue(userIdAtom);

  // 画像の変更処理
  const onUpLoadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      // ファイルが選択されていない場合
      if (!files || files.length === 0) {
        setFormData((prev) => ({ ...prev, image: null }));
        setImage(null);
      } else {
        // 画像URLを生成してformDataにセット
        const imageUrl = URL.createObjectURL(files[0]);
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        // 画像をセット
        setImage(files[0]);
      }
    },
    []
  );

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
      return { ...prev, startStage: newStartStage };
    });
  };

  // カテゴリーのチェックボックス変更
  const handleCategoryChange = (category: Category) => {
    setFormData((prev) => {
      const newCategory = prev.category == category ? prev.category : category;
      return { ...prev, category: newCategory };
    });
  };

  // 材料の追加・削除・変更
  const handleAddIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", amount: "", note: "" }],
    }));
  };
  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => {
      const newIngredients = prev.ingredients.filter((_, i) => i !== index);
      checkAndSuggestAllergens(newIngredients);
      return { ...prev, ingredients: newIngredients };
    });
  };
  const handleIngredientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [name]: value };
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
    // 材料名が変更された場合のみサジェストを更新
    if (name === "name") {
      checkAndSuggestAllergens(newIngredients);
    }
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  // 作り方の追加・削除・変更
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

  // アレルゲン名とその同義語のマップ
  const allergenMap = useRef<Map<string, string>>(new Map());

  // アレルゲン選択
  const toggleAllergen = (allergenId: number) => {
    const isCurrentlySelected = allergenInclusions[allergenId];

    // アレルゲン選択状態を更新
    setAllergenInclusions((prev) => ({
      ...prev,
      [allergenId]: !prev[allergenId],
    }));
    // サジェストリストから該当のアレルゲンを削除するロジック
    const clickedAllergen = allergens.find((a) => a.id === allergenId);
    if (!clickedAllergen) return;

    if (isCurrentlySelected) {
      // 選択を解除する場合（'ON' -> 'OFF'）
      // 材料リストを再チェックして、再度サジェストが必要か確認
      const updatedIngredients = [...formData.ingredients];
      const allIngredients = updatedIngredients
        .map((ing) => ing.name)
        .join(" ");

      // 材料にアレルゲン要素がまだ含まれているか確認
      let hasAllergenInIngredients = allIngredients.includes(
        clickedAllergen.name
      );
      if (clickedAllergen.variants) {
        clickedAllergen.variants.forEach((variant) => {
          if (allIngredients.includes(variant)) {
            hasAllergenInIngredients = true;
          }
        });
      }

      if (hasAllergenInIngredients) {
        // 材料に含まれている場合は、サジェストを再表示
        setSuggestedAllergenNames((prev) => {
          // 既存のサジェストに重複がないか確認して追加
          if (!prev.includes(clickedAllergen.name)) {
            return [...prev, clickedAllergen.name];
          }
          return prev;
        });
      }
    } else {
      // 選択する場合（'OFF' -> 'ON'）
      // サジェストリストから該当のアレルゲンを削除
      setSuggestedAllergenNames((prev) =>
        prev.filter((name) => name !== clickedAllergen.name)
      );
    }
  };

  // 材料名の変更をチェックしてアレルゲンサジェストを更新
  const checkAndSuggestAllergens = (
    ingredients: { name: string; amount: string; note?: string | null }[]
  ) => {
    const allIngredients = ingredients.map((ing) => ing.name).join(" ");
    const newSuggestions: string[] = [];

    for (const [synonym, allergenName] of allergenMap.current.entries()) {
      if (
        allIngredients.includes(synonym) &&
        !newSuggestions.includes(allergenName)
      ) {
        newSuggestions.push(allergenName);
      }
    }
    setSuggestedAllergenNames(newSuggestions);
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let recipeId;
      let newRecipeData; // createRecipeの戻り値を受け取る変数
      let newImageUrl = formData.image; // 画像URLを保持する変数

      // imageファイルが存在する場合のみ、画像をアップロードする
      if (image) {
        newImageUrl = await uploadImage(image, userId!);
      }

      if (isEditMode && initialData?.id) {
        // 編集モードの場合、IDを使ってレシピを更新
        await updateRecipe(
          initialData.id,
          { ...formData, image: newImageUrl },
          userId!
        );
        recipeId = initialData.id;
        setFormData((prev) => ({ ...prev, image: newImageUrl }));
      } else {
        // 新規作成モードの場合、レシピを作成
        newRecipeData = await createRecipe(
          { ...formData, image: newImageUrl },
          userId!
        );
        recipeId = newRecipeData.id;
        setFormData((prev) => ({ ...prev, image: newImageUrl }));
      }
      // 選択されたアレルゲン情報を抽出
      const selectedAllergenIds = Object.keys(allergenInclusions)
        .filter((key) => allergenInclusions[parseInt(key, 10)])
        .map((key) => parseInt(key, 10));
      // 既存のアレルゲンデータを削除（編集モードの場合）
      await deleteRecipeAllergens(recipeId);
      // 新しいアレルゲンデータを登録
      await createRecipeAllergens(recipeId, selectedAllergenIds, userId!);

      router.push(`/recipes/${recipeId}`);
    } catch {
      // TODO: エラーが発生したら更新をロールバックする処理を実装
    } finally {
      setIsSaving(false);
    }
  };

  // TODO: 下書き機能
  // const handleSaveDraft = async () => {
  //   setIsSaving(true);
  //   console.log("下書きとして保存:", formData);
  //   setTimeout(() => {
  //     setIsSaving(false);
  //     alert("下書きとして保存しました！");
  //   }, 1000);
  // };

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

  // ページロード時とアレルゲン項目がないときに実行
  useEffect(() => {
    inputRef.current?.focus();
    const fetchAllergens = async () => {
      if (allergens.length === 0) {
        const data = await getAllergens();
        if (data) {
          setAllergens(data);

          // マップを作成
          const newMap = new Map<string, string>();
          data.forEach((allergen) => {
            // 同義語をキー、アレルゲン名を値として保存
            if (allergen.variants) {
              allergen.variants.forEach((variant: string) => {
                newMap.set(variant, allergen.name);
              });
            }
          });
          allergenMap.current = newMap;

          // レシピIDがすでに存在する場合、そのレシピに紐づくアレルゲンも取得
          if (isEditMode && initialData?.id) {
            const selectedAllergenIds = await getRecipeAllergensById(
              initialData.id
            );
            if (selectedAllergenIds) {
              const initialAllergenState: Record<string, boolean> = {};
              data.forEach((allergen) => {
                initialAllergenState[allergen.id] =
                  selectedAllergenIds.includes(allergen.id);
              });
              setAllergenInclusions(initialAllergenState);
            }
          } else {
            // 新規作成モードの場合、全てのアレルゲンをfalseで初期化
            const initialInclusions: Record<string, boolean> = {};
            data.forEach((allergen) => {
              initialInclusions[allergen.id] = false;
            });
            setAllergenInclusions(initialInclusions);
          }
        }
      }
    };
    fetchAllergens();
  }, [allergens, isEditMode, initialData]);

  // 材料の変更をチェックしてサジェストを更新するuseEffect
  useEffect(() => {
    if (initialData && allergens.length > 0) {
      checkAndSuggestAllergens(formData.ingredients);
    }
  }, [initialData, allergens]);

  return (
    <div className="p-4 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* レシピ基本情報 */}
        <section className="bg-white rounded-3xl p-6 shadow-sm">
          {/* 画像プレビュー */}
          <div className="flex flex-col items-center">
            <div
              className="w-[200px] h-[200px] bg-stone-100 rounded-3xl flex items-center justify-center overflow-hidden hover:bg-stone-200 transition-colors group relative"
              onClick={() => imageInputRef.current?.click()}
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
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={onUpLoadImage}
              className="hidden"
            />
          </div>

          <div className="space-y-4 mt-6">
            {/* レシピ名 */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="にんじんとかぼちゃの煮物"
              className="w-full bg-stone-50 rounded-2xl p-3 border-0 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium text-lg"
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
                        ? "bg-violet-100 text-violet-700 ring-2 ring-violet-300"
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
                        ? "bg-violet-100 text-violet-700 ring-2 ring-violet-300"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* レシピ情報 */}
            <div className="flex justify-between">
              <div className="flex items-center">
                <ScheduleIcon />
                <input
                  type="text"
                  name="cookingTime"
                  value={formData.cookingTime || ""}
                  onChange={handleChange}
                  placeholder="15分"
                  className="w-30 bg-stone-50 rounded-2xl p-3 border-0 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ml-2"
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
                  className="w-30 bg-stone-50 rounded-2xl p-3 border-0 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ml-2"
                />
              </div>
            </div>

            {/* 説明 */}
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="甘くて栄養満点！赤ちゃんが大好きな定番メニューです。自然の甘みで食べやすく、冷凍保存も可能です。"
              rows={4}
              className="w-full bg-stone-50 rounded-2xl p-3 border-0 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
            />

            {/* TODO:非公開設定 */}
            {/* <div className="flex items-center">
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
            </div> */}
          </div>
        </section>

        {/* 材料 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-stone-700">材料</h3>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center px-4 py-2 text-sm font-medium text-violet-600 hover:text-white hover:bg-violet-500 border border-violet-500 rounded-full transition-all"
            >
              <AddIcon className="w-4 h-4 mr-1" />
              追加
            </button>
          </div>
          <div className="space-y-6">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex-col items-center space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-700 text-lg">
                      {index + 1}
                    </h4>
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="p-2 hover:bg-red-50 rounded-2xl transition-colors ml-2"
                        title="材料を削除"
                      >
                        <ClearIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="flex justify-between space-x-2 mb-2">
                    <input
                      type="text"
                      name="name"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(e, index)}
                      placeholder="にんじん"
                      className="flex-1 bg-stone-50 rounded-2xl p-3 border-0 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    />
                    <input
                      type="text"
                      name="amount"
                      value={ingredient.amount}
                      onChange={(e) => handleIngredientChange(e, index)}
                      placeholder="30g"
                      className="w-24 bg-stone-50 rounded-2xl p-3 border-0 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    />
                  </div>
                  <div className="flex justify-between mb-4">
                    <input
                      type="text"
                      name="note"
                      value={ingredient.note || ""}
                      onChange={(e) => handleIngredientChange(e, index)}
                      placeholder="皮を厚めに剥く"
                      className="flex-1 bg-stone-50 rounded-2xl p-3 border-0 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    />
                  </div>
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
              className="flex items-center px-4 py-2 text-sm font-medium text-violet-600 hover:text-white hover:bg-violet-500 border border-violet-500 rounded-full transition-all"
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
                      className="p-2 hover:bg-red-50 rounded-2xl transition-colors"
                      title="ステップを削除"
                    >
                      <ClearIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <textarea
                  name="description"
                  value={step.description}
                  onChange={(e) => handleStepChange(e, index)}
                  placeholder="にんじんとかぼちゃを月齢に適した大きさに切る。にんじんは皮を厚めに剥き、かぼちゃは種とワタを取り除きます。"
                  rows={3}
                  className="w-full bg-stone-50 rounded-2xl p-3 border-0 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
                />
              </div>
            ))}
          </div>
        </section>

        {/* タグ */}
        <section>
          <h3 className="text-lg font-bold text-stone-700 mb-4">タグ</h3>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="作り置きOK"
              className="w-full bg-stone-50 rounded-2xl p-3 border-0 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all mb-4"
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
                    <ClearIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* アレルゲン選択 */}
        <section>
          <h3 className="text-lg font-bold text-stone-700 mb-4">アレルゲン</h3>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
              {allergens.map((allergen) => (
                <button
                  key={allergen.id}
                  type="button"
                  onClick={() => toggleAllergen(allergen.id)}
                  className={`h-10 flex items-center justify-center p-1.5 rounded-full text-xs transition-all hover:scale-105 active:scale-95 ${
                    allergenInclusions[allergen.id]
                      ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                      : "bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <div className="text-xs leading-tight">{allergen.name}</div>
                </button>
              ))}
            </div>
            {/* リアルタイムサジェストメッセージ */}
            {suggestedAllergenNames.length > 0 && (
              <div className="flex items-center p-3 text-red-400 mt-4">
                <ErrorIcon />
                <p className="text-sm font-medium text-stone-600 ml-2">
                  「{suggestedAllergenNames.join("」と「")}
                  」は含まれていませんか？
                </p>
              </div>
            )}
          </div>
        </section>

        {/* フォーム送信ボタン */}
        <div className="flex justify-center space-x-8 p-4">
          {/* TODO:下書き機能 */}
          {/* <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-6 py-3 bg-stone-200 text-stone-700 rounded-full font-medium hover:bg-stone-300 transition-colors disabled:opacity-50"
          >
            下書き
          </button> */}
          <button
            type="submit"
            className="flex items-center justify-center w-40 px-6 py-3 bg-violet-400 text-white rounded-2xl font-medium hover:bg-violet-600 transition-colors disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="animate-spin h-5 w-5 mr-3 border-4 border-white border-t-transparent rounded-full"></div>
            ) : isEditMode ? (
              "更新"
            ) : (
              "保存"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
