'use client';

import { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface PartyExtra {
  id: number;
  partyId: number;
  partyName: string;
  guestNames: string[];
  recipeTitle: string | null;
  recipeText: string | null;
  songRequest: string | null;
  submittedAt: string;
}

// Helper to format guest names nicely
const formatGuestNames = (names: string[]): string => {
  if (!names || names.length === 0) return 'Unknown';
  if (names.length === 1) return names[0];
  
  // Split names into first and last
  const parsed = names.map(name => {
    const parts = name.trim().split(' ');
    const lastName = parts.pop() || '';
    const firstName = parts.join(' ') || '';
    return { firstName, lastName };
  });
  
  // Check if all surnames are the same
  const allSameSurname = parsed.every(p => p.lastName === parsed[0].lastName);
  
  if (allSameSurname) {
    // "Harry & Adia Burnham" or "Harry, Adia & John Burnham"
    const firstNames = parsed.map(p => p.firstName);
    const surname = parsed[0].lastName;
    
    if (firstNames.length === 2) {
      return `${firstNames[0]} & ${firstNames[1]} ${surname}`;
    }
    // 3+ names
    const lastIndex = firstNames.length - 1;
    return `${firstNames.slice(0, lastIndex).join(', ')} & ${firstNames[lastIndex]} ${surname}`;
  }
  
  // Different surnames: "Harry Burnham & Adia Shane"
  if (names.length === 2) {
    return `${names[0]} & ${names[1]}`;
  }
  // 3+ names with different surnames
  const lastIndex = names.length - 1;
  return `${names.slice(0, lastIndex).join(', ')} & ${names[lastIndex]}`;
};

export default function AdminRecipes() {
  const [partyExtras, setPartyExtras] = useState<PartyExtra[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<PartyExtra | null>(null);
  const [activeTab, setActiveTab] = useState<'recipes' | 'songs'>('recipes');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/recipes');
      const data = await response.json();
      setPartyExtras(data.recipes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter recipes (has recipe text)
  const recipes = partyExtras.filter(p => p.recipeText && p.recipeText.trim() !== '');
  
  // Filter songs (has song request)
  const songs = partyExtras.filter(p => p.songRequest && p.songRequest.trim() !== '');

  // Export recipes to Word
  const exportRecipesToWord = () => {
    if (!recipes.length) return;
    const doc = new Document({
      sections: recipes.map(recipe => ({
        children: [
          new Paragraph({
            children: [new TextRun({ text: `From: ${formatGuestNames(recipe.guestNames)}`, bold: true, size: 28 })],
          }),
          recipe.recipeTitle &&
            new Paragraph({
              children: [new TextRun({ text: `Recipe: ${recipe.recipeTitle}`, italics: true, size: 24 })],
            }),
          recipe.recipeText &&
            new Paragraph({
              children: [new TextRun({ text: recipe.recipeText, size: 22 })],
            }),
          new Paragraph({ text: '' }),
        ].filter((p): p is Paragraph => !!p),
      })),
    });

    Packer.toBlob(doc).then(blob => saveAs(blob, 'recipes.docx'));
  };

  // Export song requests to CSV
  const exportSongRequestsToCsv = () => {
    if (!songs.length) return;

    const rows = [['Guests', 'Song Request']];
    songs.forEach(song => {
      rows.push([formatGuestNames(song.guestNames), song.songRequest || '']);
    });

    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'song-requests.csv';
    a.click();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display text-gray-900">Recipes & Songs</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'recipes'
              ? 'bg-burgundy-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          📖 Recipes ({recipes.length})
        </button>
        <button
          onClick={() => setActiveTab('songs')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'songs'
              ? 'bg-burgundy-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          🎵 Songs ({songs.length})
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Recipes Tab */}
          {activeTab === 'recipes' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-500">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} submitted</p>
                {recipes.length > 0 && (
                  <button
                    onClick={exportRecipesToWord}
                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Export to Word
                  </button>
                )}
              </div>

              {recipes.length === 0 ? (
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
                      <p className="text-sm text-gray-500 mb-3">
                        From: {formatGuestNames(recipe.guestNames)}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-3">{recipe.recipeText}</p>
                      <p className="text-xs text-gray-400 mt-4">
                        {new Date(recipe.submittedAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Songs Tab */}
          {activeTab === 'songs' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-500">{songs.length} song{songs.length !== 1 ? 's' : ''} requested</p>
                {songs.length > 0 && (
                  <button
                    onClick={exportSongRequestsToCsv}
                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Export to CSV
                  </button>
                )}
              </div>

              {songs.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
                  No song requests yet.
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Guests</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Song Request</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {songs.map(song => (
                        <tr key={song.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {formatGuestNames(song.guestNames)}
                          </td>
                          <td className="px-6 py-4 text-gray-600">{song.songRequest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedRecipe(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display text-gray-900">
                  {selectedRecipe.recipeTitle || 'Untitled Recipe'}
                </h2>
                <p className="text-sm text-gray-500">
                  From: {formatGuestNames(selectedRecipe.guestNames)}
                </p>
              </div>
              <button onClick={() => setSelectedRecipe(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-gray-700">
                {selectedRecipe.recipeText}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

