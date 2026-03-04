import { useState } from 'react';
import { Search, ArrowLeft, Clock, Users, ChefHat } from 'lucide-react';

type Recipe = {
  title: string;
  category: string;
  time: string;
  emoji: string;
  servings: number;
  description: string;
  ingredients: string[];
  steps: string[];
};

const recipes: Recipe[] = [
  {
    title: 'Fluffy Pancakes',
    category: 'Breakfast',
    time: '20 min',
    emoji: '🥞',
    servings: 4,
    description: 'Light and airy pancakes perfect for a lazy weekend morning.',
    ingredients: [
      '1½ cups all-purpose flour',
      '3½ tsp baking powder',
      '1 tbsp sugar',
      '¼ tsp salt',
      '1¼ cups milk',
      '1 egg',
      '3 tbsp melted butter',
    ],
    steps: [
      'Sift flour, baking powder, sugar, and salt together in a large bowl.',
      'Make a well in the center and pour in milk, egg, and melted butter. Mix until smooth.',
      'Heat a lightly oiled griddle or pan over medium-high heat.',
      'Pour batter onto the griddle, using about ¼ cup for each pancake.',
      'Cook until bubbles form on the surface, then flip and brown on the other side.',
      'Serve hot with maple syrup and fresh berries.',
    ],
  },
  {
    title: 'Avocado Toast',
    category: 'Breakfast',
    time: '10 min',
    emoji: '🥑',
    servings: 2,
    description: 'Simple, delicious, and packed with healthy fats.',
    ingredients: [
      '2 slices sourdough bread',
      '1 ripe avocado',
      '1 tbsp lemon juice',
      'Red pepper flakes',
      'Flaky sea salt',
      '2 eggs (optional)',
      'Cherry tomatoes for garnish',
    ],
    steps: [
      'Toast the sourdough bread until golden and crispy.',
      'Halve the avocado and scoop out the flesh into a bowl.',
      'Mash with a fork and mix in lemon juice and a pinch of salt.',
      'Spread the avocado mixture generously on each toast.',
      'Top with red pepper flakes, flaky salt, and sliced cherry tomatoes.',
      'Add a poached or fried egg on top if desired.',
    ],
  },
  {
    title: 'Lemon Herb Chicken',
    category: 'Dinner',
    time: '45 min',
    emoji: '🍗',
    servings: 4,
    description: 'Juicy roasted chicken thighs with a bright lemon herb marinade.',
    ingredients: [
      '4 bone-in chicken thighs',
      '3 tbsp olive oil',
      '2 lemons, juiced and zested',
      '4 cloves garlic, minced',
      '2 tsp dried oregano',
      '1 tsp dried thyme',
      'Salt and pepper to taste',
      'Fresh parsley for garnish',
    ],
    steps: [
      'Preheat oven to 425°F (220°C).',
      'Whisk together olive oil, lemon juice, zest, garlic, oregano, thyme, salt, and pepper.',
      'Place chicken thighs in a baking dish and pour the marinade over them.',
      'Let marinate for at least 15 minutes (or up to overnight in the fridge).',
      'Roast for 35–40 minutes until the internal temperature reaches 165°F.',
      'Rest for 5 minutes, then garnish with fresh parsley and serve.',
    ],
  },
  {
    title: 'Pasta Carbonara',
    category: 'Dinner',
    time: '30 min',
    emoji: '🍝',
    servings: 4,
    description: 'A classic Roman pasta dish — creamy without the cream.',
    ingredients: [
      '400g spaghetti',
      '200g pancetta or guanciale, diced',
      '4 large egg yolks',
      '1 whole egg',
      '1 cup finely grated Pecorino Romano',
      'Freshly cracked black pepper',
      'Salt for pasta water',
    ],
    steps: [
      'Bring a large pot of salted water to a boil and cook spaghetti until al dente.',
      'While pasta cooks, fry pancetta in a large skillet until crispy. Remove from heat.',
      'In a bowl, whisk together egg yolks, whole egg, and most of the Pecorino.',
      'Reserve 1 cup of pasta water, then drain the spaghetti.',
      'Add hot pasta to the pancetta skillet (off heat) and toss.',
      'Pour the egg mixture over the pasta and toss quickly, adding pasta water as needed for a silky sauce.',
      'Serve immediately with extra Pecorino and pepper.',
    ],
  },
  {
    title: 'Chocolate Lava Cake',
    category: 'Desserts',
    time: '35 min',
    emoji: '🍫',
    servings: 4,
    description: 'Rich, indulgent cakes with a molten chocolate center.',
    ingredients: [
      '120g dark chocolate (70%)',
      '120g unsalted butter',
      '2 whole eggs',
      '2 egg yolks',
      '¼ cup sugar',
      '2 tbsp all-purpose flour',
      'Pinch of salt',
      'Cocoa powder for dusting',
    ],
    steps: [
      'Preheat oven to 425°F (220°C). Butter and dust 4 ramekins with cocoa powder.',
      'Melt chocolate and butter together in a double boiler or microwave. Stir until smooth.',
      'In a separate bowl, whisk eggs, egg yolks, and sugar until thick and pale.',
      'Fold the chocolate mixture into the egg mixture gently.',
      'Sift in flour and salt, and fold until just combined.',
      'Divide batter among ramekins and bake for 12–14 minutes until edges are firm but center is soft.',
      'Let cool for 1 minute, then invert onto plates. Dust with cocoa and serve immediately.',
    ],
  },
  {
    title: 'Berry Crumble',
    category: 'Desserts',
    time: '40 min',
    emoji: '🫐',
    servings: 6,
    description: 'Warm, buttery crumble over sweet and tangy mixed berries.',
    ingredients: [
      '4 cups mixed berries (blueberries, raspberries, blackberries)',
      '¼ cup sugar',
      '1 tbsp cornstarch',
      '1 tbsp lemon juice',
      '¾ cup rolled oats',
      '½ cup all-purpose flour',
      '⅓ cup brown sugar',
      '⅓ cup cold butter, cubed',
      'Pinch of cinnamon',
    ],
    steps: [
      'Preheat oven to 375°F (190°C).',
      'Toss berries with sugar, cornstarch, and lemon juice. Pour into a baking dish.',
      'In a bowl, combine oats, flour, brown sugar, and cinnamon.',
      'Cut in cold butter using your fingers until the mixture forms coarse crumbs.',
      'Scatter the crumble topping evenly over the berries.',
      'Bake for 30–35 minutes until the topping is golden and berries are bubbling.',
      'Let cool for 10 minutes. Serve warm with vanilla ice cream.',
    ],
  },
];

const categories = ['All', 'Breakfast', 'Dinner', 'Desserts'];

export function RecipeApp() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = recipes.filter(r => {
    const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-decoy-bg">
        {/* Detail Header */}
        <div className="bg-decoy-card px-5 pt-12 pb-5 shadow-sm">
          <button onClick={() => setSelectedRecipe(null)} className="flex items-center gap-1 text-decoy-accent mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-decoy-bg flex items-center justify-center text-5xl">
              {selectedRecipe.emoji}
            </div>
            <div>
              <h1 className="text-xl font-bold text-decoy-text">{selectedRecipe.title}</h1>
              <p className="text-sm text-decoy-muted mt-1">{selectedRecipe.description}</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-sm text-decoy-muted">
              <Clock className="w-4 h-4" />
              {selectedRecipe.time}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-decoy-muted">
              <Users className="w-4 h-4" />
              {selectedRecipe.servings} servings
            </div>
            <div className="flex items-center gap-1.5 text-sm text-decoy-muted">
              <ChefHat className="w-4 h-4" />
              {selectedRecipe.category}
            </div>
          </div>
        </div>

        <div className="px-5 py-6 space-y-6 pb-12">
          {/* Ingredients */}
          <div>
            <h2 className="text-lg font-semibold text-decoy-text mb-3">Ingredients</h2>
            <div className="bg-decoy-card rounded-2xl p-4 shadow-sm space-y-2.5">
              {selectedRecipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-decoy-accent mt-2 shrink-0" />
                  <span className="text-[15px] text-decoy-text">{ing}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h2 className="text-lg font-semibold text-decoy-text mb-3">Instructions</h2>
            <div className="space-y-3">
              {selectedRecipe.steps.map((step, i) => (
                <div key={i} className="bg-decoy-card rounded-2xl p-4 shadow-sm flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-decoy-accent text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-[15px] text-decoy-text leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-decoy-bg">
      {/* Header */}
      <div className="bg-decoy-card px-5 pt-12 pb-4 shadow-sm">
        <h1 className="text-2xl font-bold text-decoy-text mb-4">My Recipes</h1>
        <div className="flex items-center gap-2 bg-decoy-bg rounded-xl px-4 py-3">
          <Search className="w-4 h-4 text-decoy-muted" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-decoy-text text-sm outline-none w-full placeholder:text-decoy-muted"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 px-5 py-4 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-sm border border-transparent transition-colors ${
              activeCategory === cat
                ? 'bg-decoy-accent text-white'
                : 'bg-decoy-card text-decoy-text'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recipe Cards */}
      <div className="px-5 pb-8 space-y-4">
        <h2 className="text-lg font-semibold text-decoy-text">
          {activeCategory === 'All' ? 'Popular Recipes' : activeCategory}
        </h2>
        {filtered.length === 0 && (
          <p className="text-decoy-muted text-sm py-8 text-center">No recipes found.</p>
        )}
        {filtered.map(recipe => (
          <button
            key={recipe.title}
            onClick={() => setSelectedRecipe(recipe)}
            className="w-full bg-decoy-card rounded-2xl p-4 shadow-sm flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-16 h-16 rounded-xl bg-decoy-bg flex items-center justify-center text-3xl">
              {recipe.emoji}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-decoy-text">{recipe.title}</h3>
              <p className="text-sm text-decoy-muted">{recipe.category} · {recipe.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
