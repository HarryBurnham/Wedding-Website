'use client';

import { useState, useEffect } from 'react';

interface Recipe {
  id: string;
  guest_name: string;
  recipe_text?: string;
  recipe_file_url?: string;
  recipe_file_name?: string;
  submitted_at: string;
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-gray-900">Recipe Collection</h1>
        <span className="text-gray-500">{recipes.length} recipes submitted</span>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
          Loading...
        </div>
      ) : recipes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
          No recipes submitted yet. Recipes will appear here once guests submit them with their RSVPs.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <h3 className="text-lg font-display text-gray-900 mb-2">
                Recipe from {recipe.guest_name}
              </h3>
              
              {recipe.recipe_text && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {recipe.recipe_text}
                </p>
              )}

              {recipe.recipe_file_name && (
                <div className="flex items-center gap-2 text-burgundy-700 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  {recipe.recipe_file_name}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-4">
                {new Date(recipe.submitted_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedRecipe(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display text-gray-900">
                  Recipe from {selectedRecipe.guest_name}
                </h2>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedRecipe.recipe_text && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Recipe Text</h3>
                  <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-gray-700">
                    {selectedRecipe.recipe_text}
                  </div>
                </div>
              )}

              {selectedRecipe.recipe_file_url && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Attached File</h3>
                  <a
                    href={selectedRecipe.recipe_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-900 text-white rounded hover:bg-burgundy-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download {selectedRecipe.recipe_file_name}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
