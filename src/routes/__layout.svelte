<script>
	import '../app.css';
	const date = new Date().getFullYear();
</script>

<main>
	<div class="back" />
	<slot />
</main>

<style>
	.back {
		background-image: url('map.jpg');
		background-repeat: no-repeat;
		background-size: cover;
		opacity: 0.25;
	}
</style>
