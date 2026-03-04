import { Plus } from 'lucide-react';

const notes = [
  { title: 'Grocery List', preview: 'Milk, eggs, bread, butter, cheese...', date: 'Today', color: 'bg-yellow-100' },
  { title: 'Meeting Notes', preview: 'Discuss Q2 targets and team updates...', date: 'Yesterday', color: 'bg-blue-100' },
  { title: 'Book Recommendations', preview: '1. Atomic Habits 2. Deep Work 3. The...', date: 'Mar 1', color: 'bg-green-100' },
  { title: 'Weekend Plans', preview: 'Saturday: farmers market, Sunday: brunch...', date: 'Feb 28', color: 'bg-purple-100' },
  { title: 'Recipe Ideas', preview: 'Try making homemade pasta this week...', date: 'Feb 27', color: 'bg-orange-100' },
];

export function NotesApp() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-3xl font-bold text-neutral-900 mb-1">Notes</h1>
        <p className="text-sm text-neutral-500">{notes.length} notes</p>
      </div>

      <div className="px-5 pb-8 space-y-3">
        {notes.map(note => (
          <div key={note.title} className={`${note.color} rounded-2xl p-4`}>
            <h3 className="font-semibold text-neutral-900 mb-1">{note.title}</h3>
            <p className="text-sm text-neutral-600 line-clamp-1">{note.preview}</p>
            <p className="text-xs text-neutral-400 mt-2">{note.date}</p>
          </div>
        ))}
      </div>

      <button className="fixed bottom-6 right-6 w-14 h-14 bg-neutral-900 text-white rounded-full shadow-lg flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
