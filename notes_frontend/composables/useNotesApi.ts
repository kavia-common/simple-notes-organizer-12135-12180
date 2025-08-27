import { ref, computed } from 'vue'
import { useRuntimeConfig, useFetch } from '#app'

export type Note = {
  id: string
  title: string
  content: string
  createdAt?: string
  updatedAt?: string
}

type NotePayload = {
  title: string
  content: string
}

function getBase() {
  const config = useRuntimeConfig()
  // Use public NOTES_API_BASE, default to /api
  return config.public.NOTES_API_BASE || '/api'
}

/**
 * PUBLIC_INTERFACE
 * Fetch all notes with optional search query.
 */
export async function useFetchNotes(query?: string): Promise<Note[]> {
  /** Fetches notes from the backend using REST. */
  const base = getBase()
  const url = query ? `${base}/notes?search=${encodeURIComponent(query)}` : `${base}/notes`
  const { data, error } = await useFetch<Note[]>(url, { method: 'GET' })
  if (error.value) throw error.value
  return data.value || []
}

/**
 * PUBLIC_INTERFACE
 * Fetch a single note by id
 */
export async function useFetchNote(id: string): Promise<Note | null> {
  /** Returns a specific note by id from backend. */
  const base = getBase()
  const { data, error } = await useFetch<Note>(`${base}/notes/${id}`, { method: 'GET' })
  if (error.value) throw error.value
  return data.value || null
}

/**
 * PUBLIC_INTERFACE
 * Create a new note
 */
export async function useCreateNote(payload: NotePayload): Promise<Note> {
  /** Creates a note via POST. */
  const base = getBase()
  const { data, error } = await useFetch<Note>(`${base}/notes`, {
    method: 'POST',
    body: payload,
  })
  if (error.value) throw error.value
  return data.value as Note
}

/**
 * PUBLIC_INTERFACE
 * Update an existing note
 */
export async function useUpdateNote(id: string, payload: NotePayload): Promise<Note> {
  /** Updates a note via PUT/PATCH. */
  const base = getBase()
  const { data, error } = await useFetch<Note>(`${base}/notes/${id}`, {
    method: 'PUT',
    body: payload,
  })
  if (error.value) throw error.value
  return data.value as Note
}

/**
 * PUBLIC_INTERFACE
 * Delete a note by id
 */
export async function useDeleteNote(id: string): Promise<void> {
  /** Deletes a note via DELETE. */
  const base = getBase()
  const { error } = await useFetch(`${base}/notes/${id}`, { method: 'DELETE' })
  if (error.value) throw error.value
}

/**
 * PUBLIC_INTERFACE
 * Reactive store-like helper for notes state within a view.
 */
export function useNotesState() {
  /** Provides reactive state for notes list, selection, and search. */
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const selectedId = ref<string | null>(null)
  const search = ref('')

  const selectedNote = computed(() => notes.value.find(n => n.id === selectedId.value) || null)

  async function refresh() {
    loading.value = true
    try {
      notes.value = await useFetchNotes(search.value.trim() || undefined)
    } finally {
      loading.value = false
    }
  }

  async function createNote() {
    const newNote = await useCreateNote({ title: 'Untitled', content: '' })
    notes.value.unshift(newNote)
    selectedId.value = newNote.id
  }

  async function updateNote(id: string, payload: NotePayload) {
    const updated = await useUpdateNote(id, payload)
    const idx = notes.value.findIndex(n => n.id === id)
    if (idx !== -1) notes.value[idx] = updated
  }

  async function deleteNote(id: string) {
    await useDeleteNote(id)
    const idx = notes.value.findIndex(n => n.id === id)
    if (idx !== -1) notes.value.splice(idx, 1)
    if (selectedId.value === id) selectedId.value = notes.value[0]?.id || null
  }

  return {
    notes,
    loading,
    selectedId,
    search,
    selectedNote,
    refresh,
    createNote,
    updateNote,
    deleteNote,
  }
}
