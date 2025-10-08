<script>
  // Static content page
</script>

<svelte:head>
  <title>Privacy Policy — Tradie Assistant</title>
  <meta name="description" content="How Tradie Assistant handles your data, including OpenAI APIs and file search vector stores for Smart Assistant." />
  <meta name="robots" content="index,follow" />
</svelte:head>

<section class="container mx-auto max-w-4xl px-4 py-10">
  <header class="mb-8">
    <h1 class="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
    <p class="mt-2 opacity-70">Last updated: 7 October 2025</p>
  </header>

  <div class="prose prose-slate max-w-none">
    <h2>Who we are</h2>
    <p>
      We’re Tradie Assistant (“we”, “us”), a tool that helps tradies quote, communicate, and find technical answers fast.
      We handle personal information under the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
    </p>

    <h2>Quick summary</h2>
    <ul>
      <li>We collect basic account info (like email), app usage, and content you choose to process (e.g., quotes or files you upload for AI features).</li>
      <li>Core providers: authentication/database on Supabase; billing via Stripe; AI features via OpenAI APIs.</li>
      <li>OpenAI’s API data is <em>not</em> used to train models by default; API logs are typically retained about 30 days for abuse/safety, then removed.</li>
      <li>For “Smart Assistant”, files you attach can be indexed in a vector store so the Assistant can find relevant passages. They persist until deleted or until an expiry policy applies.</li>
      <li>You can request access/correction and ask us to delete your data where legally permitted.</li>
    </ul>
    <h2>The information we collect</h2>
    <ul>
      <li><strong>Account details:</strong> email and basic profile to create and manage your account.</li>
      <li><strong>Usage & diagnostics:</strong> pages visited, basic device info, timestamps and events to keep things working and improve the product.</li>
      <li><strong>Content you provide:</strong> job details, materials, proposals, emails/replies, social captions, and (optionally) files you upload for “Smart Assistant”.</li>
      <li><strong>Billing:</strong> handled by Stripe (we don’t store full card details).</li>
    </ul>

    <h2>How we use your information</h2>
    <ul>
      <li><strong>Run the service:</strong> sign in, security, performance and support.</li>
      <li><strong>AI features you request:</strong> we send prompts and, if you attach them, files to OpenAI’s API to generate answers.</li>
      <li><strong>Improve the product:</strong> aggregate analytics (not your private content) help us spot bugs and prioritise features.</li>
      <li><strong>Payments:</strong> subscription purchase and management via Stripe.</li>
    </ul>

    <h2>Where data is stored</h2>
    <ul>
      <li><strong>App backend:</strong> Supabase Auth and Postgres store account and app data.</li>
      <li><strong>Payments:</strong> Stripe processes subscriptions and customer billing.</li>
      <li><strong>AI processing:</strong> OpenAI APIs process the prompts/files you choose to send for AI features.</li>
    </ul>
    <p>These providers may operate in multiple countries. By using our AI features and subscriptions you consent to international transfers as needed to provide the service.</p>
    <h2>AI specifics: OpenAI APIs, retention, and training</h2>
    <p>
      When you use AI features, the inputs you send (prompts, fields, and any files you choose to upload) are processed by OpenAI’s API on our behalf.
      OpenAI states that API/business inputs and outputs are <em>not</em> used to train models by default, and API logs are generally retained about 30 days for abuse/safety before removal (unless legally required to retain longer).
      If you require a stricter posture (e.g., zero-data-retention endpoints), contact us so we can discuss options supported by OpenAI.
    </p>

    <h3>“Smart Assistant” and file search (vector stores)</h3>
    <p>
      If you use “Smart Assistant” to query manuals, guides or standards, the documents you attach can be uploaded and indexed in a
      retrieval index (a “vector store”) so the Assistant can find relevant passages quickly and cite pages where possible.
    </p>
    <ul>
      <li><strong>What we keep:</strong> references/metadata so your library works across sessions.</li>
      <li><strong>What OpenAI keeps:</strong> a copy of the file and its indexed chunks for retrieval until deletion or expiry applies.
        Depending on how the vector store is created, the default may be “no expiry” or a limited lifetime (e.g., some thread-attached stores default to about 7 days after last activity).
        We may configure an <code>expires_after</code> policy for inactivity-based cleanup where appropriate.</li>
      <li><strong>Deleting files:</strong> removing a file from your library removes our reference; we also request deletion from the vector store. (Note: file deletion and index lifecycle are separate.)</li>
    </ul>

    <h2>Retention</h2>
    <ul>
      <li><strong>Account & app data:</strong> kept while you have an account and for a reasonable period after closure (e.g., tax, fraud prevention, dispute resolution).</li>
      <li><strong>OpenAI API logs:</strong> typically removed after ~30 days by OpenAI.</li>
      <li><strong>Vector stores:</strong> persist until deleted; in some flows we may set expiry (e.g., after inactivity) to manage storage and privacy.</li>
    </ul>

    <h2>Security</h2>
    <p>
      We take reasonable steps to protect personal information against unauthorised access, modification, disclosure or loss,
      consistent with the Australian Privacy Principles. This includes access controls, least-privilege practices, and encryption in transit where supported.
    </p>

    <h2>Your choices & rights</h2>
    <ul>
      <li>Access and correction: request access to the personal information we hold about you and ask us to correct it.</li>
      <li>Deletion: ask us to delete your account and associated data where legally permitted.</li>
      <li>AI documents: remove files from your library to stop further use; we’ll also request deletion from the vector store.</li>
      <li>Marketing: we don’t sell personal data. If we send product updates, you can opt out.</li>
    </ul>
    <h2>Data breaches</h2>
    <p>
      If a breach is likely to result in serious harm, we’ll assess and notify affected users and the Office of the Australian Information Commissioner under the Notifiable Data Breaches scheme.
    </p>

    <h2>Children</h2>
    <p>Our service is designed for working adults in the trades and isn’t directed to children under 16.</p>

    <h2>Changes to this policy</h2>
    <p>We may update this policy from time to time. We’ll post the latest version here and update the date above.</p>

    <h2>Contact</h2>
    <p>
      Questions or requests? Email <a class="link" href="mailto:support@tradieassistant.app">support@tradieassistant.app</a> or use our
      <a class="link" href="/contact_us">contact page</a>. We’ll respond as promptly as we can.
    </p>
  </div>
</section>
