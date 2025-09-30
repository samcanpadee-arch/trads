<script lang="ts">
  import { pricingPlans } from "./pricing_plans";

  // Svelte 5 runes state
  let billingInterval = $state<'month' | 'year'>('month');

  interface Props {
    highlightedPlanId?: string;
    callToAction: string;
    currentPlanId?: string;
    center?: boolean;
  }

  let {
    highlightedPlanId = "",
    callToAction,
    currentPlanId = "",
    center = true,
  }: Props = $props();

  // Return selected price variant or fall back to legacy single-price fields
  function variantFor(plan: any) {
    const v = plan?.prices?.[billingInterval];
    if (v && 'id' in v) return v;
    return {
      id: plan?.stripe_price_id ?? null,
      amount: plan?.price ?? "",
      intervalName: plan?.priceIntervalName ?? ""
    };
  }

  function btnClass(active: boolean) {
    return `btn btn-sm ${active ? 'bg-primary text-primary-content' : ''}`;
  }
</script>

<!-- Toggle -->
<div class="flex justify-center mb-8 space-x-2">
  <button
    type="button"
    class={btnClass(billingInterval === 'month')}
    onclick={() => billingInterval = 'month'}
  >
    Monthly
  </button>
  <button
    type="button"
    class={btnClass(billingInterval === 'year')}
    onclick={() => billingInterval = 'year'}
  >
    Yearly
  </button>
</div>

<!-- Plan cards -->
<div class="flex flex-col lg:flex-row gap-10 {center ? 'place-content-center' : ''} flex-wrap">
  {#each pricingPlans as plan (plan.id)}
    <div
      class="flex-none card card-bordered {plan.id === highlightedPlanId ? 'border-primary' : 'border-gray-200'} shadow-xl flex-1 grow min-w-[260px] max-w-[310px] p-6"
    >
      <div class="flex flex-col h-full">
        <div class="text-xl font-bold">{plan.name}</div>

        {#if plan.description}
          <p class="mt-2 text-sm text-gray-500 leading-relaxed">
            {plan.description}
          </p>
        {/if}

        {#if plan.features?.length}
          <div class="mt-auto pt-4 text-sm text-gray-600">
            Plan Includes:
            <ul class="list-disc list-inside mt-2 space-y-1">
              {#each plan.features as feature}
                <li>{feature}</li>
              {/each}
            </ul>
          </div>
        {/if}

        <div class="pt-8">
          {#if variantFor(plan)?.amount}
            <span class="text-4xl font-bold">{variantFor(plan).amount}</span>
            <span class="text-gray-400">{variantFor(plan).intervalName}</span>
          {/if}

          <div class="mt-6 pt-4 flex-1 flex flex-row items-center">
            {#if plan.id === currentPlanId}
              <div class="btn btn-outline btn-success no-animation w-[80%] mx-auto cursor-default">
                Current Plan
              </div>
            {:else}
              <a
                href={"/account/subscribe/" + (variantFor(plan).id ?? "free_plan")}
                class="btn btn-primary w-[80%] mx-auto"
                title="Continue to checkout"
              >
                {callToAction}
              </a>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
