<script>
	import Die from '$lib/die.svelte';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Pusher from 'pusher-js';
	import { makeid } from '$lib/utils';

	let messages = [];
	let roomcode = '';
	let roomcodeValid = false;
	let username = '';
	let names = [
		'Running Coyote',
		'Ascending Serpent',
		'Elder Starfall',
		'Wind Mantis',
		'Ivory Shield',
		'Jade Bow',
		'Crystal Spear',
		'Hungry Sun'
	];
	let doubles = [10];
	let success = 0;
	let difficulty = 1;
	let numDice = 1;
	let results = [10];
	let doubleOptions = [7, 8, 9, 10];
	let start = false;
	let noSort = false;

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function random() {
		start = true;
		let temp = [];
		let total = 0;
		for (let i = 0; i < numDice; i++) {
			let num = getRandomInt(1, 10);
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

	onMount(() => {
		username = names[Math.floor(Math.random() * names.length)];
	});

	const submit = async () => {
		random();
		if (roomcode !== '') {
			await fetch('/api/messages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ roomcode, username, results, success })
			});
		}
	};

	function startRoom() {
		roomcode = makeid(4);
		const pusher = new Pusher('60540ee71f0c34cb003b', {
			cluster: 'us2'
		});

		const channel = pusher.subscribe(roomcode);
		channel.bind('message', (data) => {
			messages = [...messages, data];
		});
		roomcodeValid = true;
	}

	function joinRoom() {
		if (roomcode.length !== 4) {
			roomcode = 'Invalid room code';
			return;
		}
		const pusher = new Pusher('60540ee71f0c34cb003b', {
			cluster: 'us2'
		});

		const channel = pusher.subscribe(roomcode);
		channel.bind('message', (data) => {
			messages = [...messages, data];
		});
		roomcodeValid = true;
	}

	$: if (numDice > 20) {
		numDice = 20;
	}
	$: if (numDice < 1) {
		numDice = 1;
	}
	$: if (difficulty > 20) {
		difficulty = 20;
	}
	$: if (difficulty < 1) {
		difficulty = 1;
	}
	$: if (username.length > 30) {
		username = username.substring(0, 30);
	}

	$: results = Array(numDice).fill(10);
	$: numDice, (start = false);
	$: difficulty, (start = false);
	$: doubles, (start = false);
</script>

<div class="grid">
	<h1>EXALTED</h1>
	<h2 class="subtitle">Dice Roller</h2>

	<div class="diceflex">
		{#each results as r, index (index)}
			<div class="dice" transition:fade>
				<Die value={r} />
			</div>
		{/each}
	</div>
	<div class="successflex">
		{#if !start}
			<h2>Will You Succeed?</h2>
		{:else if success >= difficulty}
			<div class="flexcol">
				<h2 class="succeded">Success!</h2>
				<div class="flex">
					<span class="small">Total Successes: {success}</span>
					<span class="small">Extra Successes: {success - difficulty}</span>
				</div>
			</div>
		{:else if success === 0 && results.includes(1)}
			<div class="flexcol">
				<h2 class="botch">BOTCH!</h2>
				<div class="flex">
					<span class="small">Total Successes: {success}</span>
					<span class="small">Missed by: {Math.abs(success - difficulty)}</span>
				</div>
			</div>
		{:else}
			<div class="flexcol">
				<h2 class="fail">Failure...</h2>
				<div class="flex">
					<span class="small">Total Successes: {success}</span>
					<span class="small">Missed by: {Math.abs(success - difficulty)}</span>
				</div>
			</div>
		{/if}
	</div>
	<div class="options">
		<div>
			<label for="numdice">Number of Dice:</label>
			<input id="numdice" type="number" bind:value={numDice} min="1" max="20" />
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
	<div class="rolldiv">
		<form on:submit|preventDefault={submit}>
			<button id="rollbtn" class="roll">Roll Dice</button>
		</form>
	</div>
	<div class="cosmetics">
		<h2>Cosmetics</h2>
		<label>
			<input type="checkbox" bind:checked={noSort} />
			Don't Sort Dice
		</label>
	</div>
	<div class="messages">
		{#if !roomcodeValid}
			<button class="roombutton" on:click={() => startRoom()}>Start Room</button>
			<span style="text-align:center"> or </span>
			<input style="margin:10px;" placeholder="Enter Room Code" bind:value={roomcode} />
			<button class="roombutton" on:click={() => joinRoom()}>Join Room</button>
		{:else}
			<div style="display:flex;">
				<span>Room:</span>
				<span class="msgroom">{roomcode}</span>
			</div>
			<label class="msguser"
				>Username:
				<input class="username" bind:value={username} />
			</label>
			{#each messages as msg}
				<span class="msgusername">{msg.username}</span>
				<span class="msgresult">{msg.results}</span>
				<span class="msgsuccess">Successes: {msg.success}</span>
			{/each}
		{/if}
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr minmax(350px, 0.5fr);
		grid-template-rows: 40px 20px 250px 0.25fr 0.15fr 0.25fr;
		grid-template-areas:
			'title messages'
			'subtitle messages'
			'dice messages'
			'result messages'
			'options messages'
			'doubles messages'
			'roll messages'
			'cosmetics messages';
		justify-content: center;
		justify-items: center;
		padding: 10px;
		/*background: #f4e7d6;
		opacity: 0.89;
		*/
		max-width: 1400px;
		height: 100vh;
		margin: 0 auto;
	}
	h1 {
		font-weight: bold;
		font-family: 'Spectral';
		grid-area: title;
	}
	.subtitle {
		grid-area: subtitle;
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
		grid-area: dice;
		display: flex;
		flex-wrap: wrap;
		max-width: 850px;
		justify-content: center;
		align-content: center;
	}
	.doubleflex {
		grid-area: doubles;
		display: flex;
		gap: 5px;
		padding: 10px;
		padding-bottom: 20px;
	}
	.rolldiv {
		grid-area: roll;
	}
	.small {
		font-size: 1.25em;
		padding: 0;
	}
	.successflex {
		grid-area: result;
		min-width: 250px;
		min-height: 92px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.dice {
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
	.botch {
		color: red;
		font-size: 3em;
	}
	.fail {
		color: orangered;
		font-size: 3em;
	}
	.succeded {
		color: green;
		font-size: 3em;
	}
	.options {
		grid-area: options;
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
		grid-area: cosmetics;
		padding: 40px;
	}
	.messages {
		display: flex;
		flex-direction: column;
		background: #f5eee5;
		grid-area: messages;
		min-width: 350px;
		max-height: 90vh;
		overflow-y: auto;
		padding-top: 10px;
		border: 2px solid gold;
	}
	.roombutton {
		padding: 5px;
		align-self: center;
	}
	.msgroom {
		font-family: 'Courier New', Courier, monospace;
		padding-left: 8px;
	}
	.username {
		margin-bottom: 5px;
	}
	.msgusername {
		background: lightblue;
		padding: 5px;
	}
	.msgsuccess,
	.msgresult {
		font-size: 1.15em;
		margin-left: 8px;
	}
</style>
