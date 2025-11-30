<script lang="ts">
  const MAX_BYTES = 4 * 1024 * 1024; // ~4 MB cap to keep costs down

  let imageDataUrl: string | null = null;
  let imageName = '';
  let question = '';
  let error: string | null = null;
  let answer = '';
  let answerHtml = '';
  let loading = false;

  let cameraInput: HTMLInputElement | null = null;
  let uploadInput: HTMLInputElement | null = null;

  function resetImage() {
    imageDataUrl = null;
    imageName = '';
  }

  function escapeHtml(text: string) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatAnswer(text: string) {
    const lines = text.trim().split(/\n+/).map((line) => line.trim());
    const blocks: string[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length) {
        const listHtml = listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
        blocks.push(`<ul class="list-disc pl-5 space-y-1">${listHtml}</ul>`);
        listItems = [];
      }
    };

    for (const line of lines) {
      if (!line) {
        flushList();
        continue;
      }

      const bullet = line.match(/^[-*]\s+(.+)/);
      if (bullet) {
        listItems.push(bullet[1]);
        continue;
      }

      flushList();
      blocks.push(`<p>${escapeHtml(line)}</p>`);
    }

    flushList();
    return blocks.join('');
  }

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    error = null;
    answer = '';
    answerHtml = '';

    if (!file) {
      resetImage();
      return;
    }

    if (!file.type.startsWith('image/')) {
      error = 'Please choose a photo (JPEG or PNG).';
      target.value = '';
      resetImage();
      return;
    }

    if (file.size > MAX_BYTES) {
      error = 'Images are limited to about 4 MB to keep things fast and affordable.';
      target.value = '';
      resetImage();
      return;
    }

    imageName = file.name || 'photo';

    imageDataUrl = await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });

    if (!imageDataUrl) {
      error = 'We could not read that image. Please try again.';
      target.value = '';
      resetImage();
    }
  }

  async function submitQuestion(event: Event) {
    event.preventDefault();
    error = null;
    answer = '';

    const trimmedQuestion = question.trim();

    if (!imageDataUrl) {
      error = 'Add a photo first so the AI can see what you are asking about.';
      return;
    }

    if (!trimmedQuestion) {
      error = 'Tell us what you want to know about the photo.';
      return;
    }

    loading = true;
    try {
      const res = await fetch('/api/image-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageDataUrl, question: trimmedQuestion })
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'The assistant could not answer right now.');
      }

      const data = (await res.json()) as { answer?: string };
      answer = (data.answer || 'No answer received.').trim();
      answerHtml = formatAnswer(answer);
    } catch (err) {
      console.error('image QA failed', err);
      error = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>TradeScope Vision</title>
</svelte:head>

<section class="mx-auto max-w-4xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">On-site help</p>
    <h1 class="mt-2 text-3xl font-bold leading-tight text-gray-900">TradeScope Vision</h1>
    <p class="mt-3 max-w-3xl text-base text-gray-700">
      Point the assistant at any job photo — site fault, component close-up, or material issue — and ask for trade-grade analysis
      with next steps and safety flags.
    </p>
  </header>

  <form class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur" on:submit|preventDefault={submitQuestion}>
    <div class="space-y-4">
      <div class="space-y-3">
        <label class="text-sm font-semibold text-gray-800" for="photo-upload">Add a photo to troubleshoot</label>
        <div class="flex flex-wrap gap-3">
          <button type="button" class="btn btn-outline" on:click={() => cameraInput?.click()}>
            Take a photo (camera)
          </button>
          <button type="button" class="btn" on:click={() => uploadInput?.click()}>
            Upload from library
          </button>
        </div>
        <p class="text-xs text-gray-500">Camera will ask for permission on mobile. You can also pick an existing image.</p>
        <input
          id="photo-upload"
          name="photo-camera"
          type="file"
          accept="image/*"
          capture="environment"
          class="hidden"
          bind:this={cameraInput}
          on:change={handleFileChange}
        />
        <input
          name="photo-upload"
          type="file"
          accept="image/*"
          class="hidden"
          bind:this={uploadInput}
          on:change={handleFileChange}
        />
      </div>

      {#if imageDataUrl}
        <div class="rounded-xl border bg-gray-50 p-3">
          <div class="flex items-center justify-between gap-3 text-sm font-medium text-gray-800">
            <span class="truncate" title={imageName}>{imageName}</span>
            <button type="button" class="btn btn-ghost btn-xs" on:click={resetImage}>Remove</button>
          </div>
          <div class="mt-3 overflow-hidden rounded-lg border bg-white">
            <img src={imageDataUrl} alt="Preview of your upload" class="max-h-80 w-full object-contain" />
          </div>
        </div>
      {/if}

      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-800" for="question">What do you need to know?</label>
        <textarea
          id="question"
          class="textarea textarea-bordered w-full"
          placeholder="Eg. Burnt TPS near the switchboard — likely cause, isolation steps, and compliant repair?"
          rows={3}
          bind:value={question}
        ></textarea>
        <p class="text-xs text-gray-500">Mention the trade, context, test readings, or safety risks for a sharper response.</p>
      </div>

      {#if error}
        <div class="alert alert-error text-sm">
          <span>{error}</span>
        </div>
      {/if}

      <div class="flex items-center gap-3">
        <button type="submit" class="btn btn-primary" disabled={loading}>
          {#if loading}
            <span class="loading loading-spinner"></span>
            Analysing…
          {:else}
            Ask the assistant
          {/if}
        </button>
        <p class="text-xs text-gray-500">Powered by AI vision tuned for trade diagnostics.</p>
      </div>

      {#if answer}
        <div class="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
          <p class="text-sm font-semibold text-primary">Assistant response</p>
          <div class="prose prose-sm mt-2 text-gray-800" {@html answerHtml}></div>
        </div>
      {/if}

      <p class="text-[11px] text-gray-500">Images stay in this session only. Refresh and they are gone.</p>
    </div>
  </form>
</section>
