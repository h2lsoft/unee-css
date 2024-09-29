function uneeAnimatedObserve(){
	const observer = new IntersectionObserver((entries, obs) =>
		entries.forEach(e => e.isIntersecting && (e.target.classList.add('animated-executed'), obs.unobserve(e.target)),
			{ threshold: 0.8})
	);
	document.querySelectorAll('.animated').forEach(el => observer.observe(el));
}