<script>
  // From the book, section "Svelte 5 Runes and Component Syntax"
  // $state — writable reactive variable (replaces Svelte 4's let)
  let count = $state(0);
  // $derived — computed value, updates when dependencies change
  let doubled = $derived(count * 2);
  // $effect — side effect that re-runs when dependencies change
  $effect(() => {
    document.title = `Count: ${count}`;
  });
  // $props — typed props declaration
  let { initialCount = 0, label = 'Counter' } = $props();
</script>

<p>{label}: {count} — Doubled: {doubled}</p>
<button onclick={() => count++}>Increment</button>
<button onclick={() => count = 0}>Reset</button>
