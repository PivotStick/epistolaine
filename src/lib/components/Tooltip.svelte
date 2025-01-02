<script>
	import { Spring } from 'svelte/motion';

	const mouse = new Spring(
		{
			x: 0,
			y: 0
		},
		{
			damping: 0.2,
			stiffness: 0.1
		}
	);

	/**
	 * @type {HTMLElement | null}
	 */
	let current = $state(null);
	/**
	 * @type {{
	 *  text: string;
	 *  classList: DOMTokenList;
	 * } | null}
	 */
	let tooltip = $state(null);

	function setCurrentTooltip() {
		if (current) {
			tooltip = {
				text: current.dataset.tooltip ?? '',
				classList: current.classList
			};
		}
	}

	const observer = new MutationObserver(setCurrentTooltip);

	$effect(setCurrentTooltip);

	$effect(() => {
		observer.disconnect();
		if (current) {
			observer.observe(current, {
				attributes: true
			});
		}
	});
</script>

<svelte:window
	onmousemove={(e) => {
		mouse.set({
			x: e.clientX,
			y: e.clientY
		});

		const tooltip = document.querySelector('[data-tooltip]:hover');

		if (tooltip instanceof HTMLElement) {
			current = tooltip;
		} else {
			current = null;
		}
	}}
/>

<div
	class:hide={current === null}
	style="--x: {mouse.current.x}px; --y: {mouse.current.y}px;"
	class="tooltip"
	class:success={tooltip?.classList.contains('success')}
	class:danger={tooltip?.classList.contains('danger')}
	class:primary={tooltip?.classList.contains('primary')}
>
	{tooltip?.text}
</div>

<style lang="scss">
	.tooltip {
		pointer-events: none;
		position: fixed;
		top: var(--y);
		left: var(--x);

		background-color: white;
		box-shadow: 0 0.5rem 2rem -0.5rem var(--color-500);
		padding: 0.5rem 0.75rem;
		border-radius: 0.3rem;

		z-index: var(--z-tooltip);

		scale: 1;
		opacity: 1;
		translate: -50% calc(-100% - 1rem);
		transform-origin: center bottom;

		transition-property: opacity, scale;

		&.hide {
			opacity: 0;
			scale: 0;
		}
	}
</style>
