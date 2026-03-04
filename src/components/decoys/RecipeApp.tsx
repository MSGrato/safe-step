import { Search } from 'lucide-react';

const categories = ['Breakfast', 'Dinner', 'Desserts'];

const recipes = [
  { title: 'Fluffy Pancakes', category: 'Breakfast', time: '20 min', emoji: '🥞' },
  { title: 'Avocado Toast', category: 'Breakfast', time: '10 min', emoji: '🥑' },
  { title: 'Lemon Herb Chicken', category: 'Dinner', time: '45 min', emoji: '🍗' },
  { title: 'Pasta Carbonara', category: 'Dinner', time: '30 min', emoji: '🍝' },
  { title: 'Chocolate Lava Cake', category: 'Desserts', time: '35 min', emoji: '🍫' },
  { title: 'Berry Crumble', category: 'Desserts', time: '40 min', emoji: '🫐' },
];

export function RecipeApp() {
  return (
    <div className="min-h-screen bg-decoy-bg">
      {/* Header */}
      <div className="bg-decoy-card px-5 pt-12 pb-4 shadow-sm">
        <h1 className="text-2xl font-bold text-decoy-text mb-4">My Recipes</h1>
        <div className="flex items-center gap-2 bg-decoy-bg rounded-xl px-4 py-3">
          <Search className="w-4 h-4 text-decoy-muted" />
          <span className="text-decoy-muted text-sm">Search recipes...</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 px-5 py-4 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-decoy-card text-decoy-text shadow-sm border border-transparent first:bg-decoy-accent first:text-white"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recipe Cards */}
      <div className="px-5 pb-8 space-y-4">
        <h2 className="text-lg font-semibold text-decoy-text">Popular Recipes</h2>
        {recipes.map(recipe => (
          <div key={recipe.title} className="bg-decoy-card rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-decoy-bg flex items-center justify-center text-3xl">
              {recipe.emoji}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-decoy-text">{recipe.title}</h3>
              <p className="text-sm text-decoy-muted">{recipe.category} · {recipe.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
