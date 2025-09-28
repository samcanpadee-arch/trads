<script lang="ts">
  import { enhance } from "$app/forms";
  let files: File[] = [];
</script>

<section class="max-w-3xl mx-auto space-y-4">
  <header class="flex items-center justify-between">
    <h1 class="text-2xl font-semibold">Assistant Library (Admin)</h1>
  </header>

  <p class="text-sm opacity-80">
    Upload manuals, standards, or guides to the central library. Accepted: PDF, TXT.
  </p>

  <form
    method="post"
    action="/api/assistant/library/ingest"
    enctype="multipart/form-data"
    class="card bg-base-100 border"
    use:enhance
  >
    <div class="card-body space-y-4">
      <div>
        <label class="label" for="files">
          <span class="label-text">Select files</span>
        </label>
        <input
          id="files"
          name="files"
          type="file"
          multiple
          class="file-input file-input-bordered w-full"
          on:change={(e) => (files = Array.from((e.target as HTMLInputElement).files ?? []))}
        />
        <label class="label">
          <span class="label-text-alt opacity-70">
            Tip: add clear filenames (brand_model_doc-type.pdf) to help search quality.
          </span>
        </label>
      </div>

      <div class="flex items-center justify-end gap-2">
        <button type="submit" class="btn btn-primary">Upload to Library</button>
      </div>
    </div>
  </form>
</section>
