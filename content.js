(() => {
	const root = document.documentElement;

	/**
	 * Inject stylesheet
	 */
	const style = document.createElement("style");
	style.id = "cereal-style";
	style.textContent = `
		:root {
			--beat-interval: 0;
			--shake-interval: 0;
			--transform-origin: 0;
		}

		html, body {
			transform-origin: var(--transform-origin);
		}

		body {
			animation: beat var(--beat-interval) infinite;
		}

		html {
			animation: shake var(--shake-interval) infinite;
			overflow-x: hidden;
		}

		@keyframes beat {
			15% {
				/* transform: scale(1.1); */
				transform: scale3d(1.25, 5, 1) rotate3d(0, 0, 1, 10deg);
				filter: blur(5px) brightness(125%);
			}
			30% {
				transform: inherit;
				filter: inherit;
			}
		}

		@keyframes shake {
			10%, 90% {
				transform: translate3d(-1px, 2px, 0);
			}

			20%, 80% {
				transform: translate3d(2px, 1px, 0);
			}

			30%, 50%, 70% {
				transform: translate3d(-4px, -2px, 0);
			}

			40%, 60% {
				transform: translate3d(4px, -3px, 0);
			}
		}
	`;
	document.head.appendChild(style);


	/**
	 * Listen for the popup to update the beat interval
	 */
	chrome.runtime.onMessage.addListener( (beatInterval) => {
		root.style.setProperty("--beat-interval", beatInterval + "ms");
		root.style.setProperty("--shake-interval", +(!!beatInterval) + "s");
	});


	/**
	 * Keep the center of the transform effects aligned with the center of the
	 * viewport
	 */
	function setTransformOrigin() {
		// const viewportCenterX = window.scrollX + root.clientWidth / 2;
		// const viewportCenterY = window.scrollY + root.clientHeight / 2;
		// root.style.setProperty(
		//     "--transform-origin",
		//     `${viewportCenterX}px ${viewportCenterY}px`,
		// );
		// Optimized for speed
		root.style.setProperty(
			"--transform-origin",
			window.scrollX + root.clientWidth / 2 + "px " + window.scrollY + root.clientHeight / 2 + "px"
		);
	}
	document.addEventListener("scroll", setTransformOrigin, {
		passive: true,
	});
	setTransformOrigin();
})();
