<script lang="ts">
  import { browser } from "$app/environment";
  import RichAnswer from "$lib/components/RichAnswer.svelte";

  const MAX_BYTES = 4 * 1024 * 1024; // ~4 MB cap to keep costs down

  let imageDataUrl: string | null = null;
  let imageName = '';
  let question = '';
  let error: string | null = null;
  let answer = '';
  let answerRich = '';
  let loading = false;
  let copied = false;

  let cameraInput: HTMLInputElement | null = null;
  let uploadInput: HTMLInputElement | null = null;
  const isMobileDevice = browser && /android|iphone|ipad|ipod/i.test(navigator.userAgent);

  function resetImage() {
    imageDataUrl = null;
    imageName = '';
    if (cameraInput) cameraInput.value = '';
    if (uploadInput) uploadInput.value = '';
  }

  async function ensureCameraPermission() {
    if (!browser || !navigator.mediaDevices?.getUserMedia) return true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err) {
      console.error('camera permission rejected', err);
      error = 'Camera permission is needed to take a photo. Please allow access and try again.';
      return false;
    }
  }

  async function openCamera() {
    error = null;
    const allowed = await ensureCameraPermission();
    if (!allowed) return;
    cameraInput?.click();
  }

  function openUpload() {
    error = null;
    uploadInput?.click();
  }

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    error = null;
    answer = '';
    answerRich = '';

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
    answerRich = '';

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
      answerRich = answer;
    } catch (err) {
      console.error('image QA failed', err);
      error = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
    } finally {
      loading = false;
    }
  }

  function resetConversation() {
    resetImage();
    question = '';
    answer = '';
    answerRich = '';
    error = null;
  }

  async function copyAnswer() {
    try {
      await navigator.clipboard.writeText(answerRich || '');
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch (err) {
      console.error('copy failed', err);
      error = 'Could not copy the response. Please try again.';
    }
  }
</script>

<svelte:head>
  <title>Smart Vision</title>
</svelte:head>

<section class="mx-auto max-w-4xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">On-site help</p>
    <h1 class="mt-2 text-3xl font-bold leading-tight text-gray-900">Smart Vision</h1>
    <p class="mt-3 max-w-3xl text-base text-gray-700">
      Point the assistant at any photo — site fault, damaged kit, weird readings, material mismatch — and ask for trade-grade
      analysis with next steps and safety flags.
    </p>
  </header>

  <form class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur" on:submit|preventDefault={submitQuestion}>
    <div class="space-y-4">
      <div class="space-y-3">
        <label class="text-sm font-semibold text-gray-800" for="photo-upload">Add a photo to troubleshoot</label>
        <div class="flex flex-wrap items-center gap-3">
          {#if isMobileDevice}
            <button type="button" class="btn btn-outline" on:click={openCamera}>
              Take a photo
            </button>
          {/if}
          <button type="button" class="btn" on:click={openUpload}>
            Upload from library
          </button>
          <span class="text-xs text-gray-500">Max 4 MB (JPEG/PNG). Larger files are blocked to keep things fast.</span>
        </div>
        <p class="text-xs text-gray-500 leading-relaxed">
          Use your camera or an existing photo. If your browser needs it, you’ll see a camera permission prompt before capture.
        </p>
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

      <div class="flex flex-wrap items-center gap-3">
        <button type="submit" class="btn btn-primary" disabled={loading}>
          {#if loading}
            <span class="loading loading-spinner"></span>
            Analysing…
          {:else}
            Ask the assistant
          {/if}
        </button>
        <button type="button" class="btn btn-ghost" on:click={resetConversation} disabled={loading}>
          Reset
        </button>
        <p class="text-xs text-gray-500 leading-snug sm:whitespace-normal sm:text-left">Powered by AI vision tuned for trade diagnostics.</p>
      </div>

      {#if answer}
        <div class="mt-4 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
          <div class="flex flex-wrap items-center gap-2 justify-between text-sm font-semibold text-primary">
            <span>Assistant response</span>
            <button type="button" class="btn btn-ghost btn-xs" on:click={copyAnswer}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
          <RichAnswer text={answerRich} />
        </div>
      {/if}

      <p class="text-[11px] text-gray-500">Images stay in this session only. Refresh and they are gone.</p>
    </div>
  </form>
</section>
