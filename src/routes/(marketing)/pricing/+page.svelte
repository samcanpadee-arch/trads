<script lang="ts">
  import PricingModule from "./pricing_module.svelte";
</script>

<svelte:head>
  <title>Pricing</title>
</svelte:head>

<section class="max-w-4xl mx-auto px-4 py-10">
  <h1 class="text-3xl font-bold">Straightforward pricing for Aussie tradies</h1>
  <p class="mt-3 text-gray-600">
    Save hours on quotes, proposals, job notes and emails. Upgrade to Pro to unlock the AI Assistant — answers from your manuals, standards and past jobs.
  </p>
</section>

<section class="max-w-5xl mx-auto px-4">
  <!-- Use the existing module (cards & CTA). Highlight Pro by default -->
  <PricingModule highlightedPlanId="pro" callToAction="Get started" />
  <p class="mt-4 text-sm text-gray-500">
    Prices include GST. Single user per account. Cancel anytime. Billing by Stripe.
  </p>
</section>

<section class="max-w-5xl mx-auto px-4 py-10">
  <h2 class="text-2xl font-semibold mb-4">What’s included</h2>

  <!-- Simple feature matrix -->
  <div class="overflow-x-auto">
    <table class="table">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Standard</th>
          <th>Pro</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Proposal / Quote generators</td><td>✅</td><td>✅</td></tr>
        <tr><td>Social post generator</td><td>✅</td><td>✅</td></tr>
        <tr><td>General AI Chat</td><td>✅</td><td>✅</td></tr>
        <tr><td>AI Assistant (library-powered)</td><td>—</td><td>✅</td></tr>
        <tr><td>Upload &amp; search your own docs</td><td>—</td><td>✅</td></tr>
        <tr><td>Email support</td><td>✅</td><td>✅</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section class="max-w-3xl mx-auto px-4 pb-16">
  <h2 class="text-2xl font-semibold mb-4">Pricing FAQs</h2>

  <div class="mb-6">
    <h3 class="font-semibold">Do I get a free trial?</h3>
    <p class="text-gray-600">Yes — Standard and Pro include a 14-day free trial.</p>
  </div>

  <div class="mb-6">
    <h3 class="font-semibold">What’s the difference between Standard and Pro?</h3>
    <p class="text-gray-600">Pro adds the AI Assistant that answers from your manuals, quotes and emails, plus document upload and search.</p>
  </div>

  <div class="mb-6">
    <h3 class="font-semibold">Can I switch plans later?</h3>
    <p class="text-gray-600">Yes — upgrade or downgrade anytime in your billing portal.</p>
  </div>

  <div class="mb-6">
    <h3 class="font-semibold">Are prices inclusive of GST?</h3>
    <p class="text-gray-600">Yes — all prices include GST.</p>
  </div>
</section>
