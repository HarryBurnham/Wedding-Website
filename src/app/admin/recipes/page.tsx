'use client';

import { useState, useEffect } from 'react';

interface Recipe {
  id: number;
  partyId: number;
  partyName: string;
  recipeTitle: string;
  recipeText: string;
  songRequest: string | null;
  submittedAt: string;
}

export default function AdminRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/admin/recipes');
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportRecipes = () => {
    const content = recipes.map(recipe =>
      `=== ${recipe.recipeTitle || 'Untitled Recipe'} ===\n` +
      `From: ${recipe.partyName}\n` +
      `Submitted: ${new Date(recipe.submittedAt).toLocaleDateString()}\n\n` +
      `${recipe.recipeText}\n\n`
    ).join('\n---\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-recipes.txt';
    a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-gray-900">Recipe Collection</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-500">{recipes.length} recipes submitted</span>
          {recipes.length > 0 && (
            <button onClick={exportRecipes} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Export All
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">Loading...</div>
      ) : recipes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
          No recipes submitted yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div
              key={recipe.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <h3 className="text-lg font-display text-burgundy-900 mb-1">
                {recipe.recipeTitle || 'Untitled Recipe'}
              </h3>
              <p className="text-sm text-gray-500 mb-3">From: {recipe.partyName}</p>
              <p className="text-gray-600 text-sm line-clamp-3">{recipe.recipeText}</p>
              <p className="text-xs text-gray-400 mt-4">
                {new Date(recipe.submittedAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setSelectedRecipe(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display text-gray-900">{selectedRecipe.recipeTitle || 'Untitled Recipe'}</h2>
                  <p className="text-sm text-gray-500">From: {selectedRecipe.partyName}</p>
                </div>
                <button onClick={() => setSelectedRecipe(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-gray-700">{selectedRecipe.recipeText}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
