<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import { useNotesState } from '@/composables/useNotesApi'

const {
  notes, loading, selectedId, selectedNote, search,
  refresh, createNote, updateNote, deleteNote
} = useNotesState()

// Editor form model
const form = reactive({
  title: '',
  content: ''
})

function select(id: string) {
  selectedId.value = id
}

watch(selectedNote, (n) => {
  form.title = n?.title || ''
  form.content = n?.content || ''
}, { immediate: true })

async function save() {
  if (!selectedNote.value) return
  await updateNote(selectedNote.value.id, {
    title: form.title.trim() || 'Untitled',
    content: form.content
  })
}

async function handleDelete() {
  if (!selectedNote.value) return
  if (confirm('Delete this note?')) {
    await deleteNote(selectedNote.value.id)
  }
}

watch(search, async () => {
  await refresh()
})

onMounted(async () => {
  await refresh()
  if (!selectedId.value && notes.value.length) selectedId.value = notes.value[0].id
})
</script>

<template>
  <main class="app-shell" role="main">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <input
          v-model="search"
          class="search"
          type="search"
          placeholder="Search notes..."
          aria-label="Search notes"
        />
      </div>
      <div class="sidebar-actions">
        <button class="btn btn-primary" @click="createNote">
          + New Note
        </button>
        <button class="btn" @click="refresh" :disabled="loading">
          Refresh
        </button>
      </div>
      <div class="list" data-testid="notes-list">
        <StateMessage v-if="loading" :live="true">Loading...</StateMessage>
        <template v-else>
          <div
            v-for="n in notes"
            :key="n.id"
            class="note-card"
            :class="{ active: n.id === selectedId }"
            @click="select(n.id)"
            role="button"
            :aria-pressed="n.id === selectedId"
          >
            <h4 class="note-title">{{ n.title || 'Untitled' }}</h4>
            <p class="note-snippet">{{ n.content?.slice(0, 80) }}</p>
            <div class="meta">
              <span>{{ new Date(n.updatedAt || n.createdAt || Date.now()).toLocaleString() }}</span>
            </div>
          </div>
          <StateMessage v-if="notes.length === 0">
            No notes found<span v-if="search"> for "{{ search }}"</span>. Create your first note.
          </StateMessage>
        </template>
      </div>
    </aside>

    <!-- Content -->
    <section class="content">
      <div class="content-header">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="width:10px; height:10px; background: var(--color-primary); border-radius:2px;"></span>
          <strong>{{ selectedNote?.title || 'No note selected' }}</strong>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn" @click="save" :disabled="!selectedNote">Save</button>
          <button class="btn btn-danger" @click="handleDelete" :disabled="!selectedNote">Delete</button>
        </div>
      </div>

      <div class="content-body">
        <template v-if="selectedNote">
          <div style="display:flex; flex-direction:column; gap:12px; max-width: 960px;">
            <input
              v-model="form.title"
              class="input"
              type="text"
              placeholder="Title"
              aria-label="Note title"
            />
            <textarea
              v-model="form.content"
              class="textarea"
              placeholder="Write your note here..."
              aria-label="Note content"
            />
            <div class="meta">
              Last updated: {{ new Date(selectedNote.updatedAt || selectedNote.createdAt || Date.now()).toLocaleString() }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="empty-state">
            Select a note from the left or create a new one.
          </div>
        </template>
      </div>
    </section>
  </main>
</template>
