'use client';

import { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

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

  // Export recipes to Word (recipes only, no songs)
  const exportRecipesToWord = () => {
  if (!recipes.length) return;

  // Create the document with sections for each recipe
  const doc = new Document({
    sections: recipes.map(recipe => ({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: `Guest: ${recipe.partyName}`,
              bold: true,
              size: 28,
            }),
          ],
        }),
        recipe.recipeTitle &&
          new Paragraph({
            children: [
              new TextRun({
                text: `Recipe: ${recipe.recipeTitle}`,
                italics: true,
                size: 24,
              }),
            ],
          }),
        recipe.recipeText &&
          new Paragraph({
            children: [
              new TextRun({
                text: recipe.recipeText,
                size: 22,
              }),
            ],
          }),
        new Paragraph({ text: '' }), // spacing between recipes
      ].filter((p): p is Paragraph => !!p),
    })),
  });

  Packer.toBlob(doc).then(blob => saveAs(blob, 'recipes.docx'));
};

// Export song requests to CSV
const exportSongRequestsToCsv = () => {
  if (!recipes.length) return;

  const rows = [['Guest', 'Song Request']];

  recipes.forEach(recipe => {
    if (recipe.songRequest) {
      rows.push([recipe.partyName, recipe.songRequest]);
    }
  });

  const csv = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'song-requests.csv';
  a.click();
};

  return (
    <div>
      {/* Header with buttons */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-gray-900">Recipe Collection</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-500">{recipes.length} recipes submitted</span>
          {recipes.length > 0 && (
            <>
              <button
                onClick={exportRecipesToWord}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Export Recipes (Word)
              </button>
              <button
                onClick={exportSongRequestsToCsv}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Export Song Requests (CSV)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Loading / empty states */}
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
              {recipe.songRequest && (
                <p className="text-xs text-gray-400 mt-2 italic">Song Request: {recipe.songRequest}</p>
              )}
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
            <div className="p-6 border-b flex items-center justify-between">
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
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-gray-700">{selectedRecipe.recipeText}</div>
              {selectedRecipe.songRequest && (
                <p className="mt-4 italic text-gray-500">Song Request: {selectedRecipe.songRequest}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}