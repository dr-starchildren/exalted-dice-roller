<script>
	import Die from '$lib/die.svelte';
	let doubles = [10];
	let success = 0;
	let difficulty = 1;
	let numDice = 1;
	let results = [10];
	let doubleOptions = [7, 8, 9, 10];
	let start = false;
	let noSort = false;

	function random() {
		start = true;
		let temp = [];
		let total = 0;
		for (let i = 0; i < numDice; i++) {
			let num = Math.floor(Math.random() * (10 - 1 + 1) + 1);
			if (doubles.includes(num)) total = total + 2;
			else if (num >= 7) total = total + 1;

			temp.push(num);
		}
		if (noSort) results = [...temp];
		else
			results = [
				...temp.sort(function (a, b) {
					return a - b;
				})
			];
		success = total;
	}

	function updateDoubles(x) {
		if (doubles.includes(x)) {
			doubles = doubles.filter((entry) => {
				return entry !== x;
			});
		} else doubles = [...doubles, x];
	}
	$: if (numDice > 30) {
		numDice = 30;
	}
	$: if (numDice < 1) {
		numDice = 1;
	}
	$: if (difficulty > 10) {
		difficulty = 10;
	}
	$: if (difficulty < 1) {
		difficulty = 1;
	}
</script>

<div class="grid">
	<h1>Welcome to Exalted Dice Roller</h1>
	<div class="diceflex">
		{#each results as r, i}
			<div class="dice">
				<Die value={r} />
			</div>
		{/each}
	</div>
	<div class="successflex">
		{#if !start}
			<h2>Will You Succeed?</h2>
		{:else if success >= difficulty}
			<div class="flexcol">
				<h2 class="succeded">Succeeded</h2>
				<div class="flex">
					<span class="small">Total successes: {success}</span>

					<span class="small">Extra Successes: {success - difficulty}</span>
				</div>
			</div>
		{:else}
			<h2 class="fail">Failed</h2>
		{/if}
	</div>
	<div class="options">
		<div>
			<label for="numdice">Number of Dice:</label>
			<input id="numdice" type="number" bind:value={numDice} min="1" max="30" />
		</div>
		<div>
			<label for="difficulty">Difficulty:</label><input
				id="difficulty"
				type="number"
				bind:value={difficulty}
				min="1"
				max="10"
			/>
		</div>
	</div>
	<div class="doubleflex">
		{#each doubleOptions as d}
			<button class="double" class:active={doubles.includes(d)} on:click={() => updateDoubles(d)}
				>Double {d}'s</button
			>
		{/each}
	</div>
	<button id="rollbtn" class="roll" on:click={() => random()}>Roll Dice</button>
	<div class="cosmetics">
		<h2>Cosmetics</h2>
		<label>
			<input type="checkbox" bind:checked={noSort} />
			Don't Sort Dice
		</label>
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-rows: 50px 1fr 0.25fr 0.15fr 0.25fr;
		justify-content: center;
		justify-items: center;
		padding: 10px;
	}
	h1 {
		font-weight: bold;
		padding-bottom: 20px;
	}
	h2 {
		font-size: 2em;
	}
	.flexcol {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.flex {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
	}
	.diceflex {
		display: flex;
		flex-wrap: wrap;
		max-width: 900px;
		min-height: 300px;
		justify-content: center;
		align-items: center;
	}
	.doubleflex {
		display: flex;
		gap: 5px;
		padding: 10px;
		padding-bottom: 20px;
	}
	.small {
		font-size: 1em;
		padding: 0;
	}
	.extra {
		font-size: 1.5em;
	}
	.successflex {
		min-width: 250px;
		min-height: 92px;
		display: flex;
		justify-content: center;
	}
	.dice {
		padding: 8px;
	}
	span {
		padding: 8px;
	}
	label {
		font-size: 1.5em;
		padding-right: 5px;
	}
	.double {
		font-size: 1.5em;
	}
	.active {
		background-color: gold;
	}
	.fail {
		color: red;
		font-size: 3em;
	}
	.succeded {
		color: green;
		font-size: 3em;
	}
	.options {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		padding: 20px;
	}
	.roll {
		margin: 3px;
		font-size: 3rem;
		line-height: 1.7;
		border: 0px;
		border-radius: 5px;
		box-shadow: 0 3px 6px 0 hsla(0, 0%, 0%, 0.4);
		padding-right: 15px;
		text-align: center;
	}
	.cosmetics {
		padding: 40px;
	}
</style>
