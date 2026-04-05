import { useState, useEffect } from 'react';
import { Plus, Search, ArrowLeft, Trash2, Clock, Users, Pencil } from 'lucide-react';

type Recipe = {
  id: string;
  title: string;
  time: string;
  servings: number;
  ingredients: string;
  steps: string;
  emoji: string;
  createdAt: number;
};

const STORAGE_KEY = 'safestep_decoy_recipes';

const DEFAULT_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Fluffy Pancakes',
    time: '20 min',
    servings: 4,
    emoji: '🥞',
    ingredients: '1½ cups flour\n3½ tsp baking powder\n1 tbsp sugar\n¼ tsp salt\n1¼ cups milk\n1 egg\n3 tbsp melted butter',
    steps: '1. Sift dry ingredients together\n2. Mix in milk, egg, and butter until smooth\n3. Heat oiled griddle over medium-high\n4. Pour ¼ cup batter per pancake\n5. Flip when bubbles form, cook until golden\n6. Serve with maple syrup',
    createdAt: Date.now() - 3000,
  },
  {
    id: '2',
    title: 'Pasta Carbonara',
    time: '30 min',
    servings: 4,
    emoji: '🍝',
    ingredients: '400g spaghetti\n200g pancetta, diced\n4 egg yolks + 1 whole egg\n1 cup Pecorino Romano\nBlack pepper\nSalt',
    steps: '1. Cook spaghetti in salted water until al dente\n2. Fry pancetta until crispy\n3. Whisk yolks, egg, and cheese together\n4. Reserve pasta water, drain pasta\n5. Toss pasta with pancetta off heat\n6. Add egg mixture, toss quickly with pasta water\n7. Serve with extra cheese and pepper',
    createdAt: Date.now() - 2000,
  },
  {
    id: '3',
    title: 'Chocolate Lava Cake',
    time: '35 min',
    servings: 4,
    emoji: '🍫',
    ingredients: '120g dark chocolate\n120g butter\n2 eggs + 2 yolks\n¼ cup sugar\n2 tbsp flour\nPinch of salt\nCocoa powder',
    steps: '1. Preheat oven to 425°F, butter and dust ramekins\n2. Melt chocolate and butter together\n3. Whisk eggs, yolks, and sugar until thick\n4. Fold in chocolate mixture\n5. Add flour and salt, fold gently\n6. Bake 12–14 min until edges set, center soft\n7. Invert onto plates, serve immediately',
    createdAt: Date.now() - 1000,
  },
];

const EMOJIS = ['🍝', '🥞', '🍗', '🥑', '🍫', '🫐', '🥗', '🍕', '🌮', '🍜', '🥘', '🍰', '🧁', '🥐', '🍣'];

function loadRecipes(): Recipe[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RECIPES));
    return DEFAULT_RECIPES;
  }
  return JSON.parse(data);
}

function saveRecipes(recipes: Recipe[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function RecipeApp({ onTripleTap }: { onTripleTap?: () => void }) {
  const [recipes, setRecipes] = useState<Recipe[]>(loadRecipes);
  const [view, setView] = useState<'list' | 'detail' | 'edit'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editServings, setEditServings] = useState('4');
  const [editEmoji, setEditEmoji] = useState('🍝');
  const [editIngredients, setEditIngredients] = useState('');
  const [editSteps, setEditSteps] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const selected = recipes.find(r => r.id === selectedId) || null;

  const filtered = recipes
    .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.createdAt - a.createdAt);

  const persist = (updated: Recipe[]) => {
    setRecipes(updated);
    saveRecipes(updated);
  };

  const openNew = () => {
    setEditId(null);
    setEditTitle('');
    setEditTime('');
    setEditServings('4');
    setEditEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    setEditIngredients('');
    setEditSteps('');
    setView('edit');
  };

  const openEdit = (recipe: Recipe) => {
    setEditId(recipe.id);
    setEditTitle(recipe.title);
    setEditTime(recipe.time);
    setEditServings(String(recipe.servings));
    setEditEmoji(recipe.emoji);
    setEditIngredients(recipe.ingredients);
    setEditSteps(recipe.steps);
    setView('edit');
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;
    const recipe: Recipe = {
      id: editId || crypto.randomUUID(),
      title: editTitle.trim(),
      time: editTime.trim() || '— min',
      servings: parseInt(editServings) || 4,
      emoji: editEmoji,
      ingredients: editIngredients,
      steps: editSteps,
      createdAt: editId ? (recipes.find(r => r.id === editId)?.createdAt || Date.now()) : Date.now(),
    };
    const updated = editId ? recipes.map(r => r.id === editId ? recipe : r) : [...recipes, recipe];
    persist(updated);
    setSelectedId(recipe.id);
    setView('detail');
  };

  const handleDelete = (id: string) => {
    persist(recipes.filter(r => r.id !== id));
    setView('list');
    setSelectedId(null);
  };

  // --- Detail View ---
  if (view === 'detail' && selected) {
    return (
      <div className="min-h-screen bg-decoy-bg">
        <div className="bg-decoy-card border-b border-[hsl(var(--border))] px-5 pt-12 pb-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setView('list')} className="flex items-center gap-1 text-decoy-accent">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-semibold">Back</span>
            </button>
            <div className="flex gap-3">
              <button onClick={() => openEdit(selected)} className="text-decoy-accent">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(selected.id)} className="text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-decoy-bg flex items-center justify-center text-4xl">{selected.emoji}</div>
            <div>
              <h1 className="text-xl font-bold text-decoy-text">{selected.title}</h1>
              <div className="flex gap-3 mt-1 text-sm text-decoy-muted">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{selected.time}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{selected.servings} servings</span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-6 space-y-6 pb-12">
          {selected.ingredients.trim() && (
            <div>
              <h2 className="text-lg font-semibold text-decoy-text mb-3">Ingredients</h2>
              <div className="bg-decoy-card rounded-2xl p-4 shadow-sm border border-[hsl(var(--border))] space-y-2">
                {selected.ingredients.split('\n').filter(Boolean).map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-decoy-accent mt-2 shrink-0" />
                    <span className="text-[15px] text-decoy-text">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selected.steps.trim() && (
            <div>
              <h2 className="text-lg font-semibold text-decoy-text mb-3">Instructions</h2>
              <div className="bg-decoy-card rounded-2xl p-4 shadow-sm space-y-3">
                {selected.steps.split('\n').filter(Boolean).map((line, i) => (
                  <p key={i} className="text-[15px] text-decoy-text leading-relaxed">{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Edit View ---
  if (view === 'edit') {
    return (
      <div className="min-h-screen bg-decoy-bg">
        <div className="bg-decoy-card border-b border-[hsl(var(--border))] px-5 pt-12 pb-4 shadow-sm flex items-center justify-between">
          <button onClick={() => { selectedId ? setView('detail') : setView('list'); }} className="text-decoy-accent text-sm font-semibold">Cancel</button>
          <h1 className="text-lg font-semibold text-decoy-text">{editId ? 'Edit Recipe' : 'New Recipe'}</h1>
          <button onClick={handleSave} className="text-decoy-accent text-sm font-bold">Save</button>
        </div>
        <div className="px-5 py-5 space-y-4">
          {/* Emoji picker row */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => setEditEmoji(e)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors ${
                  editEmoji === e ? 'bg-decoy-accent/20 ring-2 ring-decoy-accent' : 'bg-decoy-card'
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          <input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            placeholder="Recipe title"
            className="w-full bg-decoy-card rounded-xl px-4 py-3 text-decoy-text text-base outline-none placeholder:text-decoy-muted shadow-sm"
          />
          <div className="flex gap-3">
            <input
              value={editTime}
              onChange={e => setEditTime(e.target.value)}
              placeholder="Cook time (e.g. 30 min)"
              className="flex-1 bg-decoy-card rounded-xl px-4 py-3 text-decoy-text text-sm outline-none placeholder:text-decoy-muted shadow-sm"
            />
            <input
              type="number"
              value={editServings}
              onChange={e => setEditServings(e.target.value)}
              placeholder="Servings"
              className="w-24 bg-decoy-card rounded-xl px-4 py-3 text-decoy-text text-sm outline-none placeholder:text-decoy-muted shadow-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-decoy-text mb-1.5 block">Ingredients</label>
            <textarea
              value={editIngredients}
              onChange={e => setEditIngredients(e.target.value)}
              placeholder="One ingredient per line..."
              rows={6}
              className="w-full bg-decoy-card rounded-xl px-4 py-3 text-decoy-text text-sm outline-none placeholder:text-decoy-muted shadow-sm resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-decoy-text mb-1.5 block">Instructions</label>
            <textarea
              value={editSteps}
              onChange={e => setEditSteps(e.target.value)}
              placeholder="Write the steps..."
              rows={8}
              className="w-full bg-decoy-card rounded-xl px-4 py-3 text-decoy-text text-sm outline-none placeholder:text-decoy-muted shadow-sm resize-none"
            />
          </div>

          {editId && (
            <button
              onClick={() => handleDelete(editId)}
              className="w-full py-3 rounded-xl text-red-400 text-sm font-medium bg-decoy-card shadow-sm mt-2"
            >
              Delete Recipe
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="min-h-screen bg-decoy-bg">
      <div className="bg-decoy-card border-b border-[hsl(var(--border))] px-5 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div onPointerDown={onTripleTap}>
            <h1 className="text-2xl font-bold text-decoy-text">My Recipes</h1>
            <p className="text-sm text-decoy-muted">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={openNew} className="w-9 h-9 rounded-full bg-decoy-accent text-white flex items-center justify-center shadow">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2 bg-decoy-bg rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-decoy-muted" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent text-decoy-text text-sm outline-none w-full placeholder:text-decoy-muted"
          />
        </div>
      </div>

      <div className="px-5 py-4 pb-8 space-y-3">
        {filtered.length === 0 && (
          <p className="text-decoy-muted text-sm py-12 text-center">
            {searchQuery ? 'No recipes found.' : 'Tap + to add your first recipe.'}
          </p>
        )}
        {filtered.map(recipe => (
          <button
            key={recipe.id}
            onClick={() => { setSelectedId(recipe.id); setView('detail'); }}
            className="w-full bg-decoy-card rounded-2xl p-4 shadow-sm border border-[hsl(var(--border))] flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-14 h-14 rounded-xl bg-decoy-bg flex items-center justify-center text-3xl shrink-0">
              {recipe.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-decoy-text truncate">{recipe.title}</h3>
              <p className="text-sm text-decoy-muted">{recipe.time} · {recipe.servings} servings</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
