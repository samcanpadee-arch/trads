<script lang="ts">
  let file: File | null = null;
  let preview: string | null = null;
  let caption = '';

  function onChoose(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    file = input.files?.[0] ?? null;
    caption = '';
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (preview = reader.result as string);
      reader.readAsDataURL(file);
    } else {
      preview = null;
    }
  }
</script>

<div class="space-y-4">
  <h1 class="text-2xl font-semibold">Caption</h1>
  <p class="text-sm opacity-70">Upload an image and get a descriptive caption (OpenAI vision wiring next).</p>

  <input type="file" accept="image/*" class="file-input file-input-bordered w-full max-w-md"
         on:change={onChoose} />

  {#if preview}
    <div class="flex gap-4 items-start">
      <img src={preview} alt="preview" class="rounded border max-h-64" />
      <div class="flex-1">
        <button class="btn btn-primary mb-3" disabled>Generate caption (coming soon)</button>
        <textarea class="textarea textarea-bordered w-full" rows="4" bind:value={caption} placeholder="Caption appears here…" readonly></textarea>
      </div>
    </div>
  {/if}
</div>
